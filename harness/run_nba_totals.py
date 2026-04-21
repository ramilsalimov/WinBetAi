#!/usr/bin/env python3
"""run_nba_totals.py — NBA Over/Under totals backtest.

Data: kyleskom OddsData.sqlite (Points = actual total, OU = market line)
Market: 2-way Over/Under at the market line.
Model: Team scoring averages (walk-forward).

Expected total = avg_PF(home) + avg_PF(away) (simple, no defense adj yet).
Bet when |model_total - OU_line| exceeds threshold.

Usage:
  python3 run_nba_totals.py --season 2025-26 --edge 3.0
  python3 run_nba_totals.py --season 2024-25 --edge 5.0
"""
import argparse, json, os, sys, sqlite3
from pathlib import Path
from collections import defaultdict, deque

HARNESS = Path(__file__).resolve().parent
DB = HARNESS.parent / 'analyzers' / 'nba-ml' / 'Data' / 'OddsData.sqlite'
RESULTS = HARNESS / 'results'

def load_games(season='2025-26'):
    if not DB.exists(): return []
    conn = sqlite3.connect(str(DB))
    cur = conn.cursor()
    rows = []
    for tn in (season, 'odds_' + season, season + '_new'):
        try:
            for r in cur.execute('SELECT Date, Home, Away, OU, Points, Win_Margin FROM "' + tn + '" ORDER BY Date'):
                rows.append(r)
            if rows: break
        except sqlite3.OperationalError:
            continue
    conn.close()
    return rows

def backtest(games, train_min=100, min_edge_pts=3.0, rolling=10, fixed_odds=1.91):
    """For NBA O/U, kyleskom DB has OU line but not O/U odds — use fixed -110/-110 = 1.91/1.91."""
    # Track recent PF + PA per team
    pf = defaultdict(lambda: deque(maxlen=rolling))
    pa = defaultdict(lambda: deque(maxlen=rolling))
    picks = []

    for i, (date, home, away, ou_line, points, margin) in enumerate(games):
        if ou_line is None or points is None: continue

        if i >= train_min and len(pf[home]) >= 3 and len(pf[away]) >= 3:
            # Model expected total: average of (home_PF_avg + away_PA_avg, away_PF_avg + home_PA_avg)
            h_off = sum(pf[home]) / len(pf[home])
            h_def = sum(pa[home]) / len(pa[home])
            a_off = sum(pf[away]) / len(pf[away])
            a_def = sum(pa[away]) / len(pa[away])
            model_total = (h_off + a_def + a_off + h_def) / 2

            diff = model_total - float(ou_line)
            if abs(diff) >= min_edge_pts:
                side = 'OVER' if diff > 0 else 'UNDER'
                actual_over = float(points) > float(ou_line)
                actual_push = float(points) == float(ou_line)
                if actual_push:
                    continue  # skip pushes
                won = (side == 'OVER' and actual_over) or (side == 'UNDER' and not actual_over)
                pnl = (fixed_odds - 1) if won else -1
                picks.append({
                    'date': date, 'match': f'{home} vs {away}',
                    'side': side, 'line': float(ou_line),
                    'model_total': round(model_total, 1),
                    'edge_pts': round(diff, 2),
                    'actual': float(points),
                    'won': won, 'pnl': round(pnl, 3),
                })

        # Update rolling stats (home_points + away_points)
        if margin is not None:
            home_pts = (float(points) + float(margin)) / 2
            away_pts = (float(points) - float(margin)) / 2
            pf[home].append(home_pts); pa[home].append(away_pts)
            pf[away].append(away_pts); pa[away].append(home_pts)

    if not picks: return None
    n = len(picks); wins = sum(1 for p in picks if p['won'])
    pnl = sum(p['pnl'] for p in picks)
    return {
        'model': 'rolling_avg', 'sport': 'NBA', 'market': 'O/U',
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
    ap.add_argument('--season', default='2025-26')
    ap.add_argument('--edge', type=float, default=3.0, help='edge in points')
    ap.add_argument('--rolling', type=int, default=10)
    ap.add_argument('--train-min', type=int, default=100)
    args = ap.parse_args()

    RESULTS.mkdir(exist_ok=True)
    games = load_games(args.season)
    if not games:
        print(f'No games for {args.season}'); return
    print(f'NBA {args.season}: {len(games)} games loaded')

    for edge in [args.edge, args.edge + 2, args.edge + 4, args.edge + 6]:
        r = backtest(games, train_min=args.train_min, min_edge_pts=edge, rolling=args.rolling)
        if r:
            print(f'  edge>={edge}pts: picks={r["picks"]} winrate={r["winrate"]}% ROI={r["roi_pct"]:+.2f}%')
            season_safe = args.season.replace('-','_')
            with open(RESULTS / f'nba-totals-{season_safe}-edge{edge}.json', 'w') as f:
                json.dump(r, f, indent=2, default=str)

if __name__ == '__main__':
    main()
