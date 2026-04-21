#!/usr/bin/env python3
"""run_totals_backtest.py — Over/Under 2.5 goals market backtest.

Models: Dixon-Coles, Poisson via penaltyblog.
Market: 2-way (Over 2.5 / Under 2.5), no push at 2.5.
Uses PSC>2.5 / PSC<2.5 (Pinnacle closing) or B365C>2.5 / B365C<2.5 (Bet365 closing) as odds.

Usage:
  python3 run_totals_backtest.py --model dixon_coles --season 2526
  python3 run_totals_backtest.py --model poisson --season 2526 --edge 0.04
"""
import argparse, json, os, sys
from pathlib import Path
import pandas as pd
import numpy as np

HARNESS = Path(__file__).parent
DATA = HARNESS / 'data'
RESULTS = HARNESS / 'results'
LEAGUE_NAMES = {'E0':'Premier League','SP1':'La Liga','I1':'Serie A','D1':'Bundesliga','F1':'Ligue 1'}

def load_league(code, season='2526'):
    path = DATA / f'{season}-{code}.csv'
    if not path.exists(): return None
    df = pd.read_csv(path).dropna(subset=['HomeTeam','AwayTeam','FTHG','FTAG'])
    # Closing odds for over/under 2.5 (try Pinnacle closing first, fallback Bet365)
    def pick(row, variants):
        for v in variants:
            if v in row and pd.notna(row[v]):
                return float(row[v])
        return None
    df['odds_over']  = df.apply(lambda r: pick(r, ['PC>2.5','B365C>2.5','P>2.5','B365>2.5']), axis=1)
    df['odds_under'] = df.apply(lambda r: pick(r, ['PC<2.5','B365C<2.5','P<2.5','B365<2.5']), axis=1)
    df = df.dropna(subset=['odds_over','odds_under']).reset_index(drop=True)
    if 'Date' in df:
        df['Date'] = pd.to_datetime(df['Date'], format='mixed', dayfirst=True, errors='coerce')
        df = df.sort_values('Date').reset_index(drop=True)
    df['FTHG'] = df['FTHG'].astype(int); df['FTAG'] = df['FTAG'].astype(int)
    df['total_goals'] = df['FTHG'] + df['FTAG']
    df['over_2_5'] = (df['total_goals'] >= 3).astype(int)
    return df

def implied_ou(odds_over, odds_under):
    """De-vig 2-way market: remove bookie margin by normalization."""
    p_over_raw = 1.0 / odds_over
    p_under_raw = 1.0 / odds_under
    s = p_over_raw + p_under_raw
    return p_over_raw / s, p_under_raw / s

def predict_totals(train_df, home, away, model_name='dixon_coles'):
    if model_name == 'dixon_coles':
        from penaltyblog.models import DixonColesGoalModel as M
    else:
        from penaltyblog.models import PoissonGoalsModel as M
    m = M(train_df['FTHG'].values, train_df['FTAG'].values,
          train_df['HomeTeam'].values, train_df['AwayTeam'].values)
    m.fit()
    p = m.predict(home, away)
    under, _, over = p.totals(2.5)
    return float(over), float(under)

def backtest(df, model_name='dixon_coles', train_min=60, min_edge=0.03, min_prob=0.0):
    picks = []
    bankroll = 100.0
    for i in range(train_min, len(df)):
        train = df.iloc[:i]
        row = df.iloc[i]
        try:
            p_over, p_under = predict_totals(train, row['HomeTeam'], row['AwayTeam'], model_name)
        except Exception:
            continue

        ip_over, ip_under = implied_ou(row['odds_over'], row['odds_under'])

        # Compare both sides, pick side with best edge
        candidates = [
            ('OVER',  p_over,  ip_over,  row['odds_over']),
            ('UNDER', p_under, ip_under, row['odds_under']),
        ]
        best = max(candidates, key=lambda e: e[1] - e[2])
        side, model_p, imp_p, odds = best
        if (model_p - imp_p) < min_edge or model_p < min_prob:
            continue

        actual_over = row['over_2_5'] == 1
        won = (side == 'OVER' and actual_over) or (side == 'UNDER' and not actual_over)
        pnl = (odds - 1) if won else -1
        bankroll += pnl
        picks.append({
            'date': row['Date'].isoformat() if pd.notna(row.get('Date')) else None,
            'match': f"{row['HomeTeam']} vs {row['AwayTeam']}",
            'pick': side, 'odds': round(odds, 2),
            'model_p': round(model_p, 3), 'imp_p': round(imp_p, 3),
            'edge': round(model_p - imp_p, 3),
            'total': int(row['total_goals']),
            'won': won, 'pnl': round(pnl, 3),
        })

    if not picks: return None
    n = len(picks); wins = sum(1 for p in picks if p['won'])
    pnl = sum(p['pnl'] for p in picks)
    return {
        'model': model_name, 'market': 'O/U 2.5',
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
    ap.add_argument('--model', default='dixon_coles', choices=['dixon_coles','poisson'])
    ap.add_argument('--season', default='2526')
    ap.add_argument('--leagues', default='E0,SP1,I1,D1,F1')
    ap.add_argument('--edge', type=float, default=0.03)
    ap.add_argument('--min-prob', type=float, default=0.0)
    args = ap.parse_args()
    RESULTS.mkdir(exist_ok=True)

    combined = {'picks': 0, 'wins': 0, 'pnl': 0}
    per_league = []
    for code in args.leagues.split(','):
        df = load_league(code, season=args.season)
        if df is None or len(df) < 70:
            print(f'[skip] {code}'); continue
        r = backtest(df, args.model, min_edge=args.edge, min_prob=args.min_prob)
        if r is None: continue
        r['league'] = code
        print(f"[{code}] {LEAGUE_NAMES.get(code, code)}: picks={r['picks']} winrate={r['winrate']}% ROI={r['roi_pct']}%")
        per_league.append(r)
        combined['picks'] += r['picks']; combined['wins'] += r['wins']; combined['pnl'] += r['pnl']
        with open(RESULTS / f'totals-{args.season}-{code}-{args.model}.json', 'w') as f:
            json.dump(r, f, indent=2, default=str)

    if combined['picks']:
        comb_roi = combined['pnl'] / combined['picks'] * 100
        comb_wr = combined['wins'] / combined['picks'] * 100
        print(f"\n=== COMBINED O/U 2.5 {args.model}: picks={combined['picks']} winrate={comb_wr:.1f}% ROI={comb_roi:+.2f}% ===")
        out = {'market': 'O/U 2.5', 'model': args.model, 'season': args.season,
               'total_picks': combined['picks'], 'total_wins': combined['wins'],
               'total_winrate': round(comb_wr, 2), 'total_roi_pct': round(comb_roi, 2),
               'by_league': [{k: v for k, v in r.items() if k not in ('equity_curve','picks_detail')} for r in per_league]}
        with open(RESULTS / f'totals-{args.season}-{args.model}-combined.json', 'w') as f:
            json.dump(out, f, indent=2, default=str)

if __name__ == '__main__':
    main()
