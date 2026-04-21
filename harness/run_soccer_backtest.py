#!/usr/bin/env python3
"""run_soccer_backtest.py — backtest models on 2024-25 top-5 European leagues.

Walk-forward:
- Train on first N matches, roll window, predict next match
- Bet if model prob > implied prob from closing odds (value bet)
- Flat 1u stake, track equity curve + ROI

Models: Dixon-Coles (penaltyblog), Poisson (penaltyblog), Elo (penaltyblog).
Data: football-data.co.uk CSVs (Bet365 closing odds fields B365H/B365D/B365A).
Output: harness/results/soccer-2425-{model}.json  — equity curve + summary

Usage: python3 run_soccer_backtest.py --model dixon_coles --leagues E0,SP1,I1,D1,F1
"""
import argparse, json, os, sys, math
from datetime import datetime
from pathlib import Path

import pandas as pd
import numpy as np

HARNESS = Path(__file__).parent
DATA = HARNESS / 'data'
RESULTS = HARNESS / 'results'

LEAGUE_NAMES = {
    'E0': 'Premier League',
    'SP1': 'La Liga',
    'I1': 'Serie A',
    'D1': 'Bundesliga',
    'F1': 'Ligue 1',
}

def load_league(code, season='2425'):
    path = DATA / f'{season}-{code}.csv'
    if not path.exists(): return None
    df = pd.read_csv(path)
    # Normalize columns — football-data.co.uk uses PSH/PSD/PSA (Pinnacle) or B365 etc
    df = df.dropna(subset=['HomeTeam', 'AwayTeam', 'FTR'])
    # Prefer Pinnacle closing (PSCH/PSCD/PSCA), fallback to Bet365 closing (B365CH/...), else opening
    def pick(row, variants):
        for v in variants:
            if v in row and pd.notna(row[v]):
                return float(row[v])
        return None
    df['odds_h'] = df.apply(lambda r: pick(r, ['PSCH','B365CH','PSH','B365H']), axis=1)
    df['odds_d'] = df.apply(lambda r: pick(r, ['PSCD','B365CD','PSD','B365D']), axis=1)
    df['odds_a'] = df.apply(lambda r: pick(r, ['PSCA','B365CA','PSA','B365A']), axis=1)
    df = df.dropna(subset=['odds_h','odds_d','odds_a'])
    # Date
    if 'Date' in df:
        df['Date'] = pd.to_datetime(df['Date'], format='mixed', dayfirst=True, errors='coerce')
        df = df.sort_values('Date').reset_index(drop=True)
    df['FTHG'] = df['FTHG'].astype(int)
    df['FTAG'] = df['FTAG'].astype(int)
    df['league'] = code
    return df

def implied_prob(odds):
    """Convert odds to implied probability, remove overround via goto-conversion style."""
    raw = np.array([1.0/o for o in odds])
    return raw / raw.sum()  # simple normalization

def backtest_dixon_coles(df, train_min=60, min_edge=0.03, min_prob=0.0, max_odds=99.0):
    """Walk-forward Dixon-Coles via penaltyblog."""
    try:
        import penaltyblog as pb
    except ImportError:
        print('ERROR: penaltyblog not installed. pip install penaltyblog', file=sys.stderr)
        return None

    picks = []
    for i in range(train_min, len(df)):
        train = df.iloc[:i]
        match = df.iloc[i]
        try:
            model = pb.models.DixonColesGoalModel(
                train['FTHG'].values, train['FTAG'].values,
                train['HomeTeam'].values, train['AwayTeam'].values
            )
            model.fit()
            probs = model.predict(match['HomeTeam'], match['AwayTeam'])
            p_home = probs.home_win
            p_draw = probs.draw
            p_away = probs.away_win
        except Exception as e:
            continue

        # Implied probs (de-vigged)
        imp = implied_prob([match['odds_h'], match['odds_d'], match['odds_a']])
        edges = [
            ('H', p_home, imp[0], match['odds_h']),
            ('D', p_draw, imp[1], match['odds_d']),
            ('A', p_away, imp[2], match['odds_a']),
        ]
        # Pick highest edge above threshold
        best = max(edges, key=lambda e: e[1] - e[2])
        outcome, model_p, imp_p, odds = best
        if (model_p - imp_p) < min_edge or model_p < min_prob or odds > max_odds:
            continue

        actual = match['FTR']
        won = (actual == outcome)
        pnl = (odds - 1) if won else -1
        picks.append({
            'date': match['Date'].isoformat() if 'Date' in match else None,
            'match': f"{match['HomeTeam']} vs {match['AwayTeam']}",
            'pick': outcome,
            'odds': odds,
            'model_p': round(model_p, 3),
            'imp_p': round(imp_p, 3),
            'edge': round(model_p - imp_p, 3),
            'actual': actual,
            'won': won,
            'pnl': round(pnl, 3),
        })
    return picks

def backtest_elo(df, train_min=60):
    """Simple Elo-based walk-forward."""
    K = 20
    elo = {}
    def get(t): return elo.get(t, 1500.0)
    def upd(t, new): elo[t] = new

    picks = []
    for i, row in df.iterrows():
        h, a = row['HomeTeam'], row['AwayTeam']
        rh, ra = get(h) + 60, get(a)  # home advantage +60
        E_h = 1 / (1 + 10 ** ((ra - rh) / 400))
        E_a = 1 - E_h
        # Model probs: simplistic 3-way from Elo (split draw prob as fixed 0.27)
        p_draw = 0.27
        p_home = E_h * (1 - p_draw)
        p_away = E_a * (1 - p_draw)

        if i >= train_min:
            imp = implied_prob([row['odds_h'], row['odds_d'], row['odds_a']])
            edges = [
                ('H', p_home, imp[0], row['odds_h']),
                ('D', p_draw, imp[1], row['odds_d']),
                ('A', p_away, imp[2], row['odds_a']),
            ]
            best = max(edges, key=lambda e: e[1] - e[2])
            outcome, model_p, imp_p, odds = best
            if model_p - imp_p >= 0.04:  # 4pp edge threshold
                actual = row['FTR']
                won = (actual == outcome)
                pnl = (odds - 1) if won else -1
                picks.append({
                    'date': row['Date'].isoformat() if pd.notna(row.get('Date')) else None,
                    'match': f"{h} vs {a}",
                    'pick': outcome, 'odds': odds,
                    'model_p': round(model_p, 3), 'imp_p': round(imp_p, 3),
                    'edge': round(model_p - imp_p, 3),
                    'actual': actual, 'won': won, 'pnl': round(pnl, 3),
                })

        # Update Elo
        actual_h = 1 if row['FTR'] == 'H' else (0.5 if row['FTR'] == 'D' else 0)
        upd(h, rh - 60 + K * (actual_h - E_h))
        upd(a, ra + K * ((1 - actual_h) - E_a))

    return picks

def summarize(picks, model_name, league_code=None):
    if not picks:
        return {'model': model_name, 'league': league_code, 'picks': 0}
    total = len(picks)
    wins = sum(1 for p in picks if p['won'])
    pnl = sum(p['pnl'] for p in picks)
    roi = pnl / total * 100
    # Equity curve
    eq = []
    cum = 0
    for p in picks:
        cum += p['pnl']
        eq.append({'date': p['date'], 'cum_pnl': round(cum, 3)})
    return {
        'model': model_name,
        'league': league_code,
        'picks': total,
        'wins': wins,
        'winrate': round(wins / total * 100, 2),
        'pnl': round(pnl, 3),
        'roi_pct': round(roi, 2),
        'equity_curve': eq,
        'picks_detail': picks,
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='elo', choices=['elo', 'dixon_coles'])
    ap.add_argument('--leagues', default='E0,SP1,I1,D1,F1')
    ap.add_argument('--season', default='2425')
    ap.add_argument('--train-min', type=int, default=60)
    ap.add_argument('--edge', type=float, default=0.03, help='min edge (model_p - imp_p)')
    ap.add_argument('--min-prob', type=float, default=0.0, help='min model probability')
    ap.add_argument('--max-odds', type=float, default=99.0, help='max acceptable odds')
    args = ap.parse_args()

    RESULTS.mkdir(exist_ok=True)
    codes = args.leagues.split(',')

    summary_all = []
    for code in codes:
        df = load_league(code, season=args.season)
        if df is None or len(df) < args.train_min + 10:
            print(f'[skip] {code}: not enough data'); continue
        print(f'[{code}] {LEAGUE_NAMES.get(code, code)}: {len(df)} matches', flush=True)

        if args.model == 'elo':
            picks = backtest_elo(df, train_min=args.train_min)
        else:
            picks = backtest_dixon_coles(df, train_min=args.train_min,
                                         min_edge=args.edge, min_prob=args.min_prob, max_odds=args.max_odds)

        s = summarize(picks, args.model, code)
        summary_all.append(s)
        print(f'  picks={s.get("picks",0)} winrate={s.get("winrate","-")}% ROI={s.get("roi_pct","-")}%')

        out_path = RESULTS / f'soccer-{args.season}-{code}-{args.model}.json'
        with open(out_path, 'w') as f:
            json.dump(s, f, indent=2, default=str)

    # Combined
    if summary_all:
        total_picks = sum(s.get('picks', 0) for s in summary_all)
        total_wins = sum(s.get('wins', 0) for s in summary_all)
        total_pnl = sum(s.get('pnl', 0) for s in summary_all)
        combined = {
            'model': args.model,
            'season': args.season,
            'total_picks': total_picks,
            'total_wins': total_wins,
            'total_winrate': round(total_wins / total_picks * 100, 2) if total_picks else 0,
            'total_pnl': round(total_pnl, 3),
            'total_roi_pct': round(total_pnl / total_picks * 100, 2) if total_picks else 0,
            'by_league': [{k: v for k, v in s.items() if k not in ('equity_curve', 'picks_detail')} for s in summary_all],
        }
        with open(RESULTS / f'soccer-{args.season}-{args.model}-combined.json', 'w') as f:
            json.dump(combined, f, indent=2, default=str)
        print(f'\n=== COMBINED {args.model}: picks={total_picks} winrate={combined["total_winrate"]}% ROI={combined["total_roi_pct"]}% ===')

if __name__ == '__main__':
    main()
