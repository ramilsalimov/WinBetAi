#!/usr/bin/env python3
"""generate_picks.py — daily live pick generator.

Produces `picks.json` for the site + TG bot consumption.

Flow:
1. Fetch upcoming fixtures + opening odds (source: the-odds-api.com or CSV for testing)
2. Load historical data (2223+2324+2425+2526-so-far) as training corpus
3. Run 4 product configs:
   - Soccer Premium:      Bundesliga DC, min-prob 0.65
   - Soccer Multi-League: PL+SA+BL mixed configs
   - NBA Value:           Elo, min-prob 0.60
   - NBA Premium:         Elo, min-prob 0.65
4. Output JSON to ../web/public/picks.json + results/picks-YYYY-MM-DD.json

Usage:
    python3 generate_picks.py --source csv         # use latest CSV as upcoming (dry-run)
    python3 generate_picks.py --source api         # fetch from the-odds-api
    python3 generate_picks.py --dry-run            # no file write
"""
import argparse, json, os, sys, datetime, urllib.request, urllib.error
from pathlib import Path
import pandas as pd
import numpy as np

ROOT = Path(__file__).parent.parent
HARNESS = ROOT / 'harness'
DATA = HARNESS / 'data'
RESULTS = Path(__file__).parent / 'results'
OUT_SITE = ROOT / 'web' / 'public' / 'picks.json'

sys.path.insert(0, str(HARNESS))
from run_soccer_v2 import (
    load_league, implied_probs,
    predict_dixon_coles, predict_poisson, predict_elo, predict_ensemble,
)
import run_soccer_v2 as v2

LEAGUE_CODE_TO_ID = {
    'E0': 'soccer_epl',
    'SP1': 'soccer_spain_la_liga',
    'I1': 'soccer_italy_serie_a',
    'D1': 'soccer_germany_bundesliga',
    'F1': 'soccer_france_ligue_one',
}
LEAGUE_NAMES_RU = {
    'E0': 'АПЛ', 'SP1': 'Ла Лига', 'I1': 'Серия А',
    'D1': 'Бундеслига', 'F1': 'Лига 1',
}
LEAGUE_NAMES_EN = {
    'E0': 'Premier League', 'SP1': 'La Liga', 'I1': 'Serie A',
    'D1': 'Bundesliga', 'F1': 'Ligue 1',
}

# Production configs (from PROFITABLE_COMBOS.md)
SOCCER_PRODUCTS = {
    'premium': {
        'leagues': ['D1'],
        'model': 'dixon_coles',
        'edge': 0.03, 'min_prob': 0.65,
    },
    'multi-league': {
        'per_league': {
            'I1': {'model': 'dixon_coles', 'edge': 0.03, 'min_prob': 0.45},
            'D1': {'model': 'dixon_coles', 'edge': 0.03, 'min_prob': 0.50},
            'E0': {'model': 'ensemble',    'edge': 0.03, 'min_prob': 0.40},
        },
    },
}


def iso_today():
    return datetime.date.today().isoformat()


# ---------- Training corpus ----------

def build_training_corpus(league_code):
    """Concatenate all season CSVs through current date. Matches-only (no pre-match fixtures)."""
    seasons = ['2223', '2324', '2425', '2526']
    frames = []
    for s in seasons:
        df = load_league(league_code, season=s)
        if df is None or df.empty:
            continue
        # Keep only completed matches
        df = df[df['FTR'].notna()]
        frames.append(df)
    if not frames:
        return None
    out = pd.concat(frames, ignore_index=True)
    if 'Date' in out:
        out = out.sort_values('Date').reset_index(drop=True)
    return out


# ---------- Upcoming fixtures ----------

def fetch_upcoming_csv(league_code):
    """Read current-season CSV and return matches without FTR (upcoming).
    Falls back to demo: take last 10 completed matches as 'upcoming' for testing.
    """
    path = DATA / f'2526-{league_code}.csv'
    if not path.exists():
        return []
    df = pd.read_csv(path)
    def pick(row, variants):
        for v in variants:
            if v in row and pd.notna(row[v]):
                return float(row[v])
        return None
    upcoming_cols = ['HomeTeam', 'AwayTeam']
    # Matches without FTR = upcoming
    upcoming = df[df.get('FTR').isna()] if 'FTR' in df.columns else df
    if upcoming.empty:
        # Demo mode: use last 10 completed matches as "upcoming"
        print(f"  [{league_code}] no upcoming found, using last 10 completed as demo")
        upcoming = df[df['FTR'].notna()].tail(10)
    fixtures = []
    for _, row in upcoming.iterrows():
        if not all(c in row and pd.notna(row[c]) for c in upcoming_cols):
            continue
        odds_h = pick(row, ['PSCH', 'B365CH', 'PSH', 'B365H'])
        odds_d = pick(row, ['PSCD', 'B365CD', 'PSD', 'B365D'])
        odds_a = pick(row, ['PSCA', 'B365CA', 'PSA', 'B365A'])
        if None in (odds_h, odds_d, odds_a):
            continue
        date = row.get('Date', None)
        fixtures.append({
            'league': league_code,
            'league_name': LEAGUE_NAMES_EN[league_code],
            'date': str(date) if pd.notna(date) else iso_today(),
            'home': row['HomeTeam'],
            'away': row['AwayTeam'],
            'odds_h': odds_h, 'odds_d': odds_d, 'odds_a': odds_a,
        })
    return fixtures


def fetch_upcoming_api(league_code, api_key=None):
    """Fetch upcoming matches from the-odds-api.com.
    Requires ODDS_API_KEY env var or --api-key arg. Returns same schema as fetch_upcoming_csv.
    """
    api_key = api_key or os.environ.get('ODDS_API_KEY')
    if not api_key:
        print(f"  [{league_code}] no API key — skipping api fetch")
        return []
    sport = LEAGUE_CODE_TO_ID.get(league_code)
    if not sport:
        return []
    url = (f'https://api.the-odds-api.com/v4/sports/{sport}/odds'
           f'?apiKey={api_key}&regions=eu&markets=h2h&oddsFormat=decimal')
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            data = json.loads(r.read())
    except Exception as e:
        print(f"  [{league_code}] API err: {e}")
        return []
    fixtures = []
    for match in data:
        home = match['home_team']
        away = match['away_team']
        # Pinnacle preferred
        book = None
        for bk in match.get('bookmakers', []):
            if bk['key'] == 'pinnacle':
                book = bk
                break
        if not book and match.get('bookmakers'):
            book = match['bookmakers'][0]
        if not book:
            continue
        markets = {m['key']: m for m in book.get('markets', [])}
        h2h = markets.get('h2h')
        if not h2h:
            continue
        outcomes = {o['name']: o['price'] for o in h2h['outcomes']}
        if home not in outcomes or away not in outcomes or 'Draw' not in outcomes:
            continue
        fixtures.append({
            'league': league_code,
            'league_name': LEAGUE_NAMES_EN[league_code],
            'date': match.get('commence_time', iso_today()),
            'home': home, 'away': away,
            'odds_h': outcomes[home],
            'odds_d': outcomes['Draw'],
            'odds_a': outcomes[away],
        })
    return fixtures


# ---------- Prediction ----------

PREDICTORS = {
    'dixon_coles': predict_dixon_coles,
    'poisson':     predict_poisson,
    'elo':         predict_elo,
    'ensemble':    predict_ensemble,
}


def apply_model(train_df, fixture, model_name):
    """Return (outcome, model_prob, implied_prob, odds, edge) for best value bet, or None."""
    v2.ELO_STATE = {}  # reset elo per league
    predict = PREDICTORS[model_name]
    try:
        p_h, p_d, p_a = predict(train_df, fixture['home'], fixture['away'])
    except Exception as e:
        return None
    odds = [fixture['odds_h'], fixture['odds_d'], fixture['odds_a']]
    imp = implied_probs(odds, method='goto')
    cands = [
        ('H', p_h, imp[0], odds[0]),
        ('D', p_d, imp[1], odds[1]),
        ('A', p_a, imp[2], odds[2]),
    ]
    best = max(cands, key=lambda e: e[1] - e[2])
    outcome, mp, ip, o = best
    edge = mp - ip
    return {
        'outcome': outcome,
        'model_prob': round(mp, 4),
        'implied_prob': round(ip, 4),
        'odds': round(o, 2),
        'edge': round(edge, 4),
    }


def pick_label(outcome, fixture):
    if outcome == 'H': return f"{fixture['home']} win"
    if outcome == 'A': return f"{fixture['away']} win"
    return 'Draw'


def pick_label_ru(outcome, fixture):
    if outcome == 'H': return f"Победа {fixture['home']}"
    if outcome == 'A': return f"Победа {fixture['away']}"
    return 'Ничья'


# ---------- Generation ----------

def generate_soccer_picks(source='csv', api_key=None):
    """Run soccer products. Returns dict with 'premium' and 'multi-league' pick arrays."""
    # Training corpora per league (expensive — train once)
    train_cache = {}
    def train(code):
        if code not in train_cache:
            train_cache[code] = build_training_corpus(code)
            if train_cache[code] is not None:
                print(f"  [train] {code}: {len(train_cache[code])} matches")
        return train_cache[code]

    # Fetch fixtures per league
    all_fix = {}
    for code in set(['D1', 'E0', 'I1', 'SP1', 'F1']):
        if source == 'api':
            all_fix[code] = fetch_upcoming_api(code, api_key)
        else:
            all_fix[code] = fetch_upcoming_csv(code)
        print(f"  [{code}] upcoming: {len(all_fix[code])}")

    # --- Premium: Bundesliga DC min-prob 0.65 ---
    cfg = SOCCER_PRODUCTS['premium']
    premium_picks = []
    for code in cfg['leagues']:
        train_df = train(code)
        if train_df is None: continue
        for fx in all_fix.get(code, []):
            r = apply_model(train_df, fx, cfg['model'])
            if not r: continue
            if r['edge'] < cfg['edge'] or r['model_prob'] < cfg['min_prob']:
                continue
            premium_picks.append({
                'product': 'soccer-premium',
                'sport': 'soccer',
                'league': code,
                'league_name': fx['league_name'],
                'date': fx['date'],
                'match': f"{fx['home']} vs {fx['away']}",
                'home': fx['home'], 'away': fx['away'],
                'pick': pick_label(r['outcome'], fx),
                'pick_ru': pick_label_ru(r['outcome'], fx),
                'outcome_code': r['outcome'],
                'model': cfg['model'],
                'model_prob': r['model_prob'],
                'implied_prob': r['implied_prob'],
                'edge': r['edge'],
                'odds': r['odds'],
                'confidence': round(r['model_prob'] * 100, 1),
            })

    # --- Multi-League: per-league configs ---
    ml_picks = []
    for code, cfg in SOCCER_PRODUCTS['multi-league']['per_league'].items():
        train_df = train(code)
        if train_df is None: continue
        for fx in all_fix.get(code, []):
            r = apply_model(train_df, fx, cfg['model'])
            if not r: continue
            if r['edge'] < cfg['edge'] or r['model_prob'] < cfg['min_prob']:
                continue
            ml_picks.append({
                'product': 'soccer-multi-league',
                'sport': 'soccer',
                'league': code,
                'league_name': fx['league_name'],
                'date': fx['date'],
                'match': f"{fx['home']} vs {fx['away']}",
                'home': fx['home'], 'away': fx['away'],
                'pick': pick_label(r['outcome'], fx),
                'pick_ru': pick_label_ru(r['outcome'], fx),
                'outcome_code': r['outcome'],
                'model': cfg['model'],
                'model_prob': r['model_prob'],
                'implied_prob': r['implied_prob'],
                'edge': r['edge'],
                'odds': r['odds'],
                'confidence': round(r['model_prob'] * 100, 1),
            })

    return {'premium': premium_picks, 'multi-league': ml_picks}


NBA_DB = ROOT / 'analyzers' / 'nba-ml' / 'Data' / 'OddsData.sqlite'
NBA_SEASONS = ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26']


def american_to_decimal(am):
    if am is None: return None
    am = float(am)
    if am > 0: return 1 + am / 100
    if am < 0: return 1 + 100 / abs(am)
    return None


def build_nba_elo(home_adv=100, K=20):
    """Walk through all historical NBA games, return final Elo state."""
    import sqlite3
    if not NBA_DB.exists():
        print(f'  [nba] odds DB not found at {NBA_DB}')
        return {}
    elo = {}
    conn = sqlite3.connect(str(NBA_DB))
    cur = conn.cursor()
    total_games = 0
    for season in NBA_SEASONS:
        rows = []
        for tn in (season, 'odds_' + season, season + '_new', 'odds_' + season + '_new'):
            try:
                for r in cur.execute(
                    'SELECT Date, Home, Away, ML_Home, ML_Away, Points, Win_Margin FROM "' + tn + '" ORDER BY Date'
                ):
                    rows.append(r)
                if rows: break
            except sqlite3.OperationalError:
                continue
        for (date, home, away, ml_h, ml_a, points, margin) in rows:
            if margin is None: continue  # upcoming/no-result — skip
            rh = elo.get(home, 1500) + home_adv
            ra = elo.get(away, 1500)
            E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
            actual_h = 1 if margin > 0 else 0
            elo[home] = elo.get(home, 1500) + K * (actual_h - E_h)
            elo[away] = elo.get(away, 1500) + K * ((1 - actual_h) - (1 - E_h))
            total_games += 1
    conn.close()
    print(f'  [nba] elo built from {total_games} games, {len(elo)} teams')
    return elo


def fetch_nba_upcoming_csv(elo_state):
    """Demo: last 10 NBA games from most-recent season as 'upcoming'."""
    import sqlite3
    if not NBA_DB.exists(): return []
    conn = sqlite3.connect(str(NBA_DB))
    cur = conn.cursor()
    fixtures = []
    for season in ('2025-26', '2024-25'):
        for tn in (season, 'odds_' + season, season + '_new'):
            try:
                rows = list(cur.execute(
                    'SELECT Date, Home, Away, ML_Home, ML_Away FROM "' + tn + '" ORDER BY Date DESC LIMIT 10'
                ))
                if rows:
                    for (date, home, away, ml_h, ml_a) in rows:
                        if ml_h is None or ml_a is None: continue
                        o_h = american_to_decimal(ml_h)
                        o_a = american_to_decimal(ml_a)
                        if not o_h or not o_a: continue
                        fixtures.append({
                            'league': 'NBA', 'league_name': 'NBA',
                            'date': str(date), 'home': home, 'away': away,
                            'odds_h': o_h, 'odds_a': o_a,
                        })
                    break
            except sqlite3.OperationalError:
                continue
        if fixtures: break
    conn.close()
    return fixtures


def fetch_nba_upcoming_api(api_key=None):
    """Fetch upcoming NBA games from the-odds-api.com."""
    api_key = api_key or os.environ.get('ODDS_API_KEY')
    if not api_key: return []
    url = (f'https://api.the-odds-api.com/v4/sports/basketball_nba/odds'
           f'?apiKey={api_key}&regions=us&markets=h2h&oddsFormat=decimal')
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            data = json.loads(r.read())
    except Exception as e:
        print(f'  [nba] API err: {e}')
        return []
    fixtures = []
    for match in data:
        home, away = match['home_team'], match['away_team']
        book = next((b for b in match.get('bookmakers', []) if b['key'] == 'pinnacle'), None)
        if not book and match.get('bookmakers'):
            book = match['bookmakers'][0]
        if not book: continue
        h2h = next((m for m in book.get('markets', []) if m['key'] == 'h2h'), None)
        if not h2h: continue
        out = {o['name']: o['price'] for o in h2h['outcomes']}
        if home not in out or away not in out: continue
        fixtures.append({
            'league': 'NBA', 'league_name': 'NBA',
            'date': match.get('commence_time', iso_today()),
            'home': home, 'away': away,
            'odds_h': out[home], 'odds_a': out[away],
        })
    return fixtures


def apply_nba_elo(elo_state, fixture, home_adv=100):
    """Given Elo + fixture (home/away/odds), return prediction + edge."""
    home, away = fixture['home'], fixture['away']
    o_h, o_a = fixture['odds_h'], fixture['odds_a']
    rh = elo_state.get(home, 1500) + home_adv
    ra = elo_state.get(away, 1500)
    E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
    E_a = 1 - E_h
    # 2-way de-vig
    p_h_raw, p_a_raw = 1 / o_h, 1 / o_a
    s = p_h_raw + p_a_raw
    imp_h, imp_a = p_h_raw / s, p_a_raw / s
    cands = [
        ('HOME', E_h, imp_h, o_h),
        ('AWAY', E_a, imp_a, o_a),
    ]
    best = max(cands, key=lambda e: e[1] - e[2])
    side, mp, ip, odds = best
    return {
        'outcome': side, 'model_prob': round(mp, 4),
        'implied_prob': round(ip, 4), 'odds': round(odds, 2),
        'edge': round(mp - ip, 4),
    }


def nba_pick_label(outcome, fx):
    if outcome == 'HOME': return f"{fx['home']} win"
    return f"{fx['away']} win"


def nba_pick_label_ru(outcome, fx):
    if outcome == 'HOME': return f"Победа {fx['home']}"
    return f"Победа {fx['away']}"


# Production configs (from PROFITABLE_COMBOS.md)
NBA_PRODUCTS = {
    'value':   {'min_edge': 0.03, 'min_prob': 0.60},
    'premium': {'min_edge': 0.03, 'min_prob': 0.65},
}


def generate_nba_picks(source='csv', api_key=None):
    """Run NBA Value + Premium. Returns dict with pick arrays."""
    elo = build_nba_elo()
    if not elo:
        return {'value': [], 'premium': []}

    fixtures = fetch_nba_upcoming_api(api_key) if source == 'api' else fetch_nba_upcoming_csv(elo)
    print(f'  [nba] upcoming: {len(fixtures)}')

    value_picks, premium_picks = [], []
    for fx in fixtures:
        r = apply_nba_elo(elo, fx)
        if not r: continue
        base = {
            'sport': 'nba',
            'league': 'NBA', 'league_name': 'NBA',
            'date': fx['date'],
            'match': f"{fx['home']} vs {fx['away']}",
            'home': fx['home'], 'away': fx['away'],
            'pick': nba_pick_label(r['outcome'], fx),
            'pick_ru': nba_pick_label_ru(r['outcome'], fx),
            'outcome_code': r['outcome'],
            'model': 'elo',
            'model_prob': r['model_prob'],
            'implied_prob': r['implied_prob'],
            'edge': r['edge'],
            'odds': r['odds'],
            'confidence': round(r['model_prob'] * 100, 1),
        }
        # Value filter
        cfg_v = NBA_PRODUCTS['value']
        if r['edge'] >= cfg_v['min_edge'] and r['model_prob'] >= cfg_v['min_prob']:
            value_picks.append({**base, 'product': 'nba-value'})
        # Premium filter (stricter)
        cfg_p = NBA_PRODUCTS['premium']
        if r['edge'] >= cfg_p['min_edge'] and r['model_prob'] >= cfg_p['min_prob']:
            premium_picks.append({**base, 'product': 'nba-premium'})

    return {'value': value_picks, 'premium': premium_picks}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', default='csv', choices=['csv', 'api'])
    ap.add_argument('--api-key', default=None)
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    RESULTS.mkdir(exist_ok=True)
    today = iso_today()
    print(f'[generate_picks] {today} source={args.source}')

    soccer = generate_soccer_picks(source=args.source, api_key=args.api_key)
    nba = generate_nba_picks(source=args.source, api_key=args.api_key)

    all_picks = (
        soccer['premium'] + soccer['multi-league'] + nba['value'] + nba['premium']
    )

    out = {
        'generated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'date': today,
        'products': {
            'soccer-premium': {
                'name': 'Soccer Premium',
                'description': 'Bundesliga Dixon-Coles, strict confidence threshold',
                'backtest_winrate': 72.58,
                'backtest_roi': 9.48,
                'picks': soccer['premium'],
            },
            'soccer-multi-league': {
                'name': 'Soccer Multi-League',
                'description': 'PL + Serie A + Bundesliga, per-league optimal configs',
                'backtest_winrate': 55.0,
                'backtest_roi': 12.0,
                'picks': soccer['multi-league'],
            },
            'nba-value': {
                'name': 'NBA Value',
                'description': 'Elo model, relaxed confidence (more volume)',
                'backtest_winrate': 58.67,
                'backtest_roi': 3.51,
                'picks': nba['value'],
            },
            'nba-premium': {
                'name': 'NBA Premium',
                'description': 'Elo model, strict confidence',
                'backtest_winrate': 68.83,
                'backtest_roi': 10.87,
                'picks': nba['premium'],
            },
        },
        'total_picks': len(all_picks),
    }

    print(f"\n=== GENERATED ===")
    print(f"  soccer-premium:      {len(soccer['premium'])} picks")
    print(f"  soccer-multi-league: {len(soccer['multi-league'])} picks")
    print(f"  nba-value:           {len(nba['value'])} picks")
    print(f"  nba-premium:         {len(nba['premium'])} picks")
    print(f"  TOTAL:               {len(all_picks)}")

    if args.dry_run:
        print('\n(dry-run: no files written)')
        return

    # Write date-stamped archive
    archive = RESULTS / f'picks-{today}.json'
    with open(archive, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2, default=str, ensure_ascii=False)
    print(f'\nWrote {archive}')

    # Write to site public folder
    OUT_SITE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_SITE, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2, default=str, ensure_ascii=False)
    print(f'Wrote {OUT_SITE}')


if __name__ == '__main__':
    main()
