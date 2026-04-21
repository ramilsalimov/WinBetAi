#!/usr/bin/env python3
"""run_nba_backtest.py — NBA moneyline backtest using Elo ratings.

Data source: kyleskom's OddsData.sqlite (sbrscrape history back to 2007-08).
Market: moneyline (ML) only — predict winner.
Model: Elo walk-forward with home court advantage (+100 rating).

Usage:
  python3 run_nba_backtest.py --season 2024-25
  python3 run_nba_backtest.py --season 2025-26 --edge 0.04
"""
import argparse, json, os, sys, sqlite3
from pathlib import Path

HARNESS = Path(__file__).resolve().parent
# kyleskom's SQLite is in analyzers/nba-ml/Data/
DB = HARNESS.parent / 'analyzers' / 'nba-ml' / 'Data' / 'OddsData.sqlite'
RESULTS = HARNESS / 'results'

def american_to_decimal(am):
    am = float(am)
    if am > 0: return 1 + am / 100
    return 1 + 100 / abs(am)

def implied_2way(o_home, o_away):
    p_h, p_a = 1/o_home, 1/o_away
    s = p_h + p_a
    return p_h/s, p_a/s

def load_games(season='2024-25'):
    if not DB.exists():
        print(f'ERROR: odds DB not found at {DB}', file=sys.stderr)
        return []
    conn = sqlite3.connect(str(DB))
    cur = conn.cursor()
    # Some tables are named with quotes-friendly variants
    rows = []
    for tn in (season, 'odds_' + season, season + '_new', 'odds_' + season + '_new'):
        try:
            for r in cur.execute('SELECT Date, Home, Away, ML_Home, ML_Away, Points, Win_Margin FROM "' + tn + '" ORDER BY Date'):
                rows.append(r)
            if rows: break
        except sqlite3.OperationalError:
            continue
    if not rows:
        print(f'ERROR: no data found for {season} in any table variant', file=sys.stderr)
    conn.close()
    return rows

def backtest(games, train_min=100, min_edge=0.03, min_prob=0.0, max_odds=99.0, K=20, home_adv=100):
    elo = {}
    def rat(t): return elo.get(t, 1500)
    picks = []
    for i, (date, home, away, ml_h, ml_a, points, margin) in enumerate(games):
        if ml_h is None or ml_a is None: continue
        try:
            o_h = american_to_decimal(ml_h)
            o_a = american_to_decimal(ml_a)
        except Exception:
            continue
        rh = rat(home) + home_adv
        ra = rat(away)
        E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
        E_a = 1 - E_h

        if i >= train_min:
            ip_h, ip_a = implied_2way(o_h, o_a)
            cands = [
                ('HOME', E_h, ip_h, o_h),
                ('AWAY', E_a, ip_a, o_a),
            ]
            best = max(cands, key=lambda e: e[1] - e[2])
            side, model_p, imp_p, odds = best
            if (model_p - imp_p) >= min_edge and model_p >= min_prob and odds <= max_odds:
                actual_home_won = (margin is not None and margin > 0)
                won = (side == 'HOME' and actual_home_won) or (side == 'AWAY' and not actual_home_won)
                pnl = (odds - 1) if won else -1
                picks.append({
                    'date': date, 'match': f'{home} vs {away}',
                    'pick': side, 'odds': round(odds, 3),
                    'model_p': round(model_p, 3), 'imp_p': round(imp_p, 3),
                    'edge': round(model_p - imp_p, 3),
                    'margin': margin,
                    'won': won, 'pnl': round(pnl, 3),
                })

        # Update Elo on result
        if margin is not None:
            actual_h = 1 if margin > 0 else 0
            elo[home] = rat(home) + K * (actual_h - E_h)
            elo[away] = rat(away) + K * ((1 - actual_h) - E_a)

    if not picks: return None
    n = len(picks); wins = sum(1 for p in picks if p['won'])
    pnl = sum(p['pnl'] for p in picks)
    return {
        'model': 'elo', 'sport': 'NBA', 'market': 'moneyline',
        'picks': n, 'wins': wins,
        'winrate': round(wins/n*100, 2),
        'pnl': round(pnl, 3),
        'roi_pct': round(pnl/n*100, 2),
        'equity_curve': [{'date': p['date'], 'cum_pnl': round(sum(q['pnl'] for q in picks[:i+1]), 3)}
                         for i, p in enumerate(picks)],
        'picks_detail': picks[:200],
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--season', default='2024-25')
    ap.add_argument('--edge', type=float, default=0.03)
    ap.add_argument('--min-prob', type=float, default=0.0)
    ap.add_argument('--max-odds', type=float, default=99.0)
    ap.add_argument('--train-min', type=int, default=100)
    args = ap.parse_args()

    RESULTS.mkdir(exist_ok=True)
    games = load_games(args.season)
    if not games:
        print(f'No games for {args.season}'); return
    print(f'NBA {args.season}: {len(games)} games loaded')

    r = backtest(games, train_min=args.train_min, min_edge=args.edge, min_prob=args.min_prob, max_odds=args.max_odds)
    if not r: print('No picks'); return
    print(f'  config edge={args.edge} minP={args.min_prob} maxO={args.max_odds}')
    print(f'  picks={r["picks"]} winrate={r["winrate"]}% ROI={r["roi_pct"]:+.2f}%')

    season_safe = args.season.replace('-','_')
    with open(RESULTS / f'nba-{season_safe}-elo.json', 'w') as f:
        json.dump(r, f, indent=2, default=str)

if __name__ == '__main__':
    main()
