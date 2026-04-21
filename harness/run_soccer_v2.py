#!/usr/bin/env python3
"""run_soccer_v2.py — harness v2 with Kelly staking, Poisson model, goto_conversion de-vig.

Improvements over v1:
- Kelly fraction stake (instead of flat 1u)
- goto_conversion for implied prob de-vigging (replace naive 1/o normalization)
- 3 models: Elo, Dixon-Coles, Poisson
- Per-league parameter grid search mode

Usage:
  python3 run_soccer_v2.py --model dixon_coles --stake kelly --leagues E0,SP1,I1,D1,F1
  python3 run_soccer_v2.py --grid --model dixon_coles  # find per-league optimal edge
"""
import argparse, json, os, sys, itertools
from pathlib import Path
import pandas as pd
import numpy as np

HARNESS = Path(__file__).parent
DATA = HARNESS / 'data'
RESULTS = HARNESS / 'results'

LEAGUE_NAMES = {
    'E0': 'Premier League', 'SP1': 'La Liga', 'I1': 'Serie A',
    'D1': 'Bundesliga', 'F1': 'Ligue 1',
}

def load_league(code, season='2425'):
    path = DATA / f'{season}-{code}.csv'
    if not path.exists(): return None
    df = pd.read_csv(path).dropna(subset=['HomeTeam', 'AwayTeam', 'FTR'])
    def pick(row, variants):
        for v in variants:
            if v in row and pd.notna(row[v]):
                return float(row[v])
        return None
    df['odds_h'] = df.apply(lambda r: pick(r, ['PSCH','B365CH','PSH','B365H']), axis=1)
    df['odds_d'] = df.apply(lambda r: pick(r, ['PSCD','B365CD','PSD','B365D']), axis=1)
    df['odds_a'] = df.apply(lambda r: pick(r, ['PSCA','B365CA','PSA','B365A']), axis=1)
    df = df.dropna(subset=['odds_h','odds_d','odds_a']).reset_index(drop=True)
    if 'Date' in df:
        df['Date'] = pd.to_datetime(df['Date'], format='mixed', dayfirst=True, errors='coerce')
        df = df.sort_values('Date').reset_index(drop=True)
    df['FTHG'] = df['FTHG'].astype(int)
    df['FTAG'] = df['FTAG'].astype(int)
    return df

def implied_probs(odds, method='goto'):
    """Return de-vigged probabilities via goto_conversion OR naive normalization."""
    odds = np.array(odds, dtype=float)
    if method == 'goto':
        try:
            from goto_conversion import goto_conversion
            probs = np.array(goto_conversion(odds.tolist()))
            return probs
        except Exception:
            pass
    # Fallback: naive 1/o normalization
    raw = 1.0 / odds
    return raw / raw.sum()

def kelly_fraction(prob, odds, frac=0.25):
    """Kelly Criterion with fractional (default 25%) — safer than full Kelly."""
    b = odds - 1
    q = 1 - prob
    edge = prob * b - q
    if edge <= 0: return 0
    f_full = edge / b
    return max(0, min(0.1, f_full * frac))  # cap at 10% bankroll per bet

def predict_dixon_coles(train_df, home_team, away_team):
    from penaltyblog.models import DixonColesGoalModel
    m = DixonColesGoalModel(
        train_df['FTHG'].values, train_df['FTAG'].values,
        train_df['HomeTeam'].values, train_df['AwayTeam'].values
    )
    m.fit()
    p = m.predict(home_team, away_team)
    return p.home_win, p.draw, p.away_win

def predict_poisson(train_df, home_team, away_team):
    from penaltyblog.models import PoissonGoalsModel
    m = PoissonGoalsModel(
        train_df['FTHG'].values, train_df['FTAG'].values,
        train_df['HomeTeam'].values, train_df['AwayTeam'].values
    )
    m.fit()
    p = m.predict(home_team, away_team)
    return p.home_win, p.draw, p.away_win

ELO_STATE = {}

def predict_elo(train_df, home_team, away_team):
    """Walk-forward Elo; expects ELO_STATE is reset once per league."""
    # Build from train if first call
    if not ELO_STATE:
        for _, r in train_df.iterrows():
            h, a = r['HomeTeam'], r['AwayTeam']
            rh, ra = ELO_STATE.get(h, 1500) + 60, ELO_STATE.get(a, 1500)
            E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
            actual = 1 if r['FTR'] == 'H' else (0.5 if r['FTR'] == 'D' else 0)
            ELO_STATE[h] = rh - 60 + 20 * (actual - E_h)
            ELO_STATE[a] = ra + 20 * ((1 - actual) - E_h)
    rh = ELO_STATE.get(home_team, 1500) + 60
    ra = ELO_STATE.get(away_team, 1500)
    E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
    p_draw = 0.27
    return E_h * (1 - p_draw), p_draw, (1 - E_h) * (1 - p_draw)

PREDICTORS = {
    'elo': predict_elo,
    'dixon_coles': predict_dixon_coles,
    'poisson': predict_poisson,
}

def backtest(df, model_name, train_min=60, min_edge=0.03, min_prob=0.0, max_odds=99.0,
             stake='flat', kelly_frac=0.25, devig='goto'):
    global ELO_STATE
    ELO_STATE = {}  # reset
    predict = PREDICTORS[model_name]

    picks = []
    bankroll = 100.0
    eq = []

    for i in range(train_min, len(df)):
        train = df.iloc[:i]
        row = df.iloc[i]
        try:
            p_h, p_d, p_a = predict(train, row['HomeTeam'], row['AwayTeam'])
        except Exception as e:
            continue

        imp = implied_probs([row['odds_h'], row['odds_d'], row['odds_a']], method=devig)
        candidates = [
            ('H', p_h, imp[0], row['odds_h']),
            ('D', p_d, imp[1], row['odds_d']),
            ('A', p_a, imp[2], row['odds_a']),
        ]
        best = max(candidates, key=lambda e: e[1] - e[2])
        outcome, mp, ip, odds = best
        if (mp - ip) < min_edge or mp < min_prob or odds > max_odds:
            # Update elo on result anyway (walk-forward)
            if model_name == 'elo':
                h, a = row['HomeTeam'], row['AwayTeam']
                rh, ra = ELO_STATE.get(h, 1500) + 60, ELO_STATE.get(a, 1500)
                E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
                actual = 1 if row['FTR'] == 'H' else (0.5 if row['FTR'] == 'D' else 0)
                ELO_STATE[h] = rh - 60 + 20 * (actual - E_h)
                ELO_STATE[a] = ra + 20 * ((1 - actual) - E_h)
            continue

        if stake == 'kelly':
            f = kelly_fraction(mp, odds, frac=kelly_frac)
            stake_amt = bankroll * f
        else:
            stake_amt = 1.0

        if stake_amt <= 0:
            continue

        won = (row['FTR'] == outcome)
        pnl = stake_amt * (odds - 1) if won else -stake_amt
        bankroll += pnl

        picks.append({
            'date': row['Date'].isoformat() if pd.notna(row.get('Date')) else None,
            'match': f"{row['HomeTeam']} vs {row['AwayTeam']}",
            'pick': outcome, 'odds': round(odds, 2),
            'model_p': round(mp, 3), 'imp_p': round(ip, 3),
            'edge': round(mp - ip, 3),
            'stake': round(stake_amt, 2),
            'actual': row['FTR'], 'won': won, 'pnl': round(pnl, 2),
            'bankroll': round(bankroll, 2),
        })
        eq.append({'date': picks[-1]['date'], 'bankroll': round(bankroll, 2)})

        # Update elo
        if model_name == 'elo':
            h, a = row['HomeTeam'], row['AwayTeam']
            rh, ra = ELO_STATE.get(h, 1500) + 60, ELO_STATE.get(a, 1500)
            E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
            actual = 1 if row['FTR'] == 'H' else (0.5 if row['FTR'] == 'D' else 0)
            ELO_STATE[h] = rh - 60 + 20 * (actual - E_h)
            ELO_STATE[a] = ra + 20 * ((1 - actual) - E_h)

    if not picks:
        return None
    n = len(picks)
    wins = sum(1 for p in picks if p['won'])
    total_staked = sum(p['stake'] for p in picks)
    total_pnl = sum(p['pnl'] for p in picks)
    return {
        'model': model_name, 'stake_mode': stake,
        'picks': n, 'wins': wins,
        'winrate': round(wins / n * 100, 2),
        'total_staked': round(total_staked, 2),
        'total_pnl': round(total_pnl, 2),
        'roi_pct': round(total_pnl / total_staked * 100, 2) if total_staked else 0,
        'final_bankroll': round(bankroll, 2),
        'bankroll_growth_pct': round((bankroll - 100) / 100 * 100, 2),
        'equity_curve': eq,
        'picks_detail': picks[:200],  # cap for JSON size
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='dixon_coles', choices=list(PREDICTORS.keys()))
    ap.add_argument('--leagues', default='E0,SP1,I1,D1,F1')
    ap.add_argument('--stake', default='flat', choices=['flat', 'kelly'])
    ap.add_argument('--kelly-frac', type=float, default=0.25)
    ap.add_argument('--edge', type=float, default=0.03)
    ap.add_argument('--min-prob', type=float, default=0.0)
    ap.add_argument('--max-odds', type=float, default=99.0)
    ap.add_argument('--devig', default='goto', choices=['goto', 'naive'])
    ap.add_argument('--grid', action='store_true', help='grid search per-league')
    args = ap.parse_args()

    RESULTS.mkdir(exist_ok=True)

    if args.grid:
        edges = [0.02, 0.03, 0.04, 0.05, 0.07, 0.1]
        print(f'grid search: {args.model} × {len(edges)} edge values × 5 leagues')
        grid_out = {}
        for code in args.leagues.split(','):
            df = load_league(code)
            if df is None: continue
            best = None
            for e in edges:
                r = backtest(df, args.model, min_edge=e, stake=args.stake,
                             kelly_frac=args.kelly_frac, devig=args.devig)
                if r is None: continue
                score = r['roi_pct']
                if best is None or score > best['score']:
                    best = {'edge': e, 'score': score, 'result': r}
            if best:
                print(f"[{code}] best edge={best['edge']}: ROI={best['score']}% picks={best['result']['picks']}")
                grid_out[code] = best
        with open(RESULTS / f'grid-{args.model}-{args.stake}.json', 'w') as f:
            json.dump({k: {'edge': v['edge'], 'score': v['score'],
                           'picks': v['result']['picks'], 'winrate': v['result']['winrate']}
                       for k, v in grid_out.items()}, f, indent=2)
        return

    combined_pnl = 0
    combined_picks = 0
    combined_wins = 0
    combined_staked = 0
    per_league = []
    for code in args.leagues.split(','):
        df = load_league(code)
        if df is None: continue
        r = backtest(df, args.model, min_edge=args.edge, min_prob=args.min_prob,
                     max_odds=args.max_odds, stake=args.stake, kelly_frac=args.kelly_frac, devig=args.devig)
        if r is None: continue
        r['league'] = code
        print(f"[{code}] {LEAGUE_NAMES.get(code, code)}: picks={r['picks']} winrate={r['winrate']}% ROI={r['roi_pct']}% bankroll=${r['final_bankroll']}")
        per_league.append(r)
        combined_picks += r['picks']; combined_wins += r['wins']
        combined_staked += r['total_staked']; combined_pnl += r['total_pnl']
        out = RESULTS / f'v2-soccer-2425-{code}-{args.model}-{args.stake}.json'
        with open(out, 'w') as f:
            json.dump(r, f, indent=2, default=str)
    if combined_picks:
        combined_roi = combined_pnl / combined_staked * 100
        combined = {
            'model': args.model, 'stake': args.stake, 'devig': args.devig,
            'total_picks': combined_picks, 'total_wins': combined_wins,
            'total_winrate': round(combined_wins / combined_picks * 100, 2),
            'total_pnl': round(combined_pnl, 2),
            'total_roi_pct': round(combined_roi, 2),
            'by_league': [{k: v for k, v in r.items() if k not in ('equity_curve', 'picks_detail')} for r in per_league],
        }
        with open(RESULTS / f'v2-soccer-2425-{args.model}-{args.stake}-combined.json', 'w') as f:
            json.dump(combined, f, indent=2, default=str)
        print(f"\n=== COMBINED {args.model}/{args.stake}: picks={combined_picks} winrate={combined['total_winrate']}% ROI={combined['total_roi_pct']}% ===")

if __name__ == '__main__':
    main()
