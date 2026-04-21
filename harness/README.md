# WinBetAi Backtest Harness

Unified harness to replay historical seasons and measure honest ROI per model.

## Data

`data/` — football-data.co.uk CSVs (free, 2024-25 season, 5 top European leagues).
Format: `{season}-{league}.csv`, e.g. `2425-E0.csv`.

Columns used:
- `HomeTeam`, `AwayTeam`, `FTHG`, `FTAG`, `FTR`
- Closing odds: `PSCH/PSCD/PSCA` (Pinnacle), fallback `B365CH/B365CD/B365CA` (Bet365)

## Models

- **Elo** — simple Elo-rated walk-forward, fixed draw probability 0.27
- **Dixon-Coles** — `penaltyblog` `DixonColesGoalModel`, walk-forward refit every match
- _(future)_ Poisson, Bayesian, xG-based

## Run

```bash
# Elo baseline (no deps besides pandas/numpy)
python3 run_soccer_backtest.py --model elo

# Dixon-Coles (requires penaltyblog)
python3 run_soccer_backtest.py --model dixon_coles --edge 0.03

# Strict value-bet: 5pp edge, min model prob 35%, max odds 6.0
python3 run_soccer_backtest.py --model dixon_coles --edge 0.05 --min-prob 0.35 --max-odds 6.0
```

## Output

`results/soccer-{season}-{league}-{model}.json` per league + combined summary.
Each contains equity curve (cum PnL per pick) + picks detail.

## Initial results (2024-25 season)

| Model | Edge | League | Picks | Winrate | ROI |
|---|---|---|---|---|---|
| Elo | 4pp | PL | 256 | 23.4% | **+9.75%** ✅ |
| Elo | 4pp | Ligue 1 | 202 | 25.3% | **+16.67%** ✅ |
| Elo | 4pp | La Liga | 280 | 19.6% | -17.60% |
| Elo | 4pp | Serie A | 275 | 17.5% | -28.39% |
| Elo | 4pp | Bundesliga | 182 | 22.0% | -2.18% |
| DC | 3pp | PL | 270 | 35.9% | **+10.94%** ✅ |
| DC | 3pp | La Liga | 266 | 31.2% | -21.39% |
| DC | 3pp | Serie A | 259 | 37.8% | -7.49% |
| DC | 3pp | Bundesliga | 194 | 29.4% | -11.68% |
| DC | 3pp | Ligue 1 | 202 | 40.6% | -6.81% |
| DC | 5pp (strict) | Serie A | 151 | 47.7% | **+1.59%** |
| DC | 5pp (strict) | Ligue 1 | 109 | 53.2% | **+8.04%** ✅ |

**Honest read**: naive value-bet beats random on PL across both models, and on Ligue 1 under Elo. Other leagues punish naive models — the books are sharp. Strict filter (5pp edge + min 35% prob + max odds 6.0) flips Serie A + Ligue 1 to profit but kills PL.

Next iterations:
- Kelly stake sizing
- Per-league optimal edge threshold
- Ensemble (DC + Elo + goto_conversion implied-prob correction)
- Expand to NBA (kyleskom) + Tennis (VincentAuriau) for multi-sport data
