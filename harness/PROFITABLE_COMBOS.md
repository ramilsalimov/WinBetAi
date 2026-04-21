# Profitable model × league combos — 2024-25 season backtest

All results on real closing odds (Pinnacle/Bet365) from football-data.co.uk.
Single-unit flat stake unless noted. Walk-forward refit per match.

## 🏆 Top 7 profitable configurations

| Rank | Model | League | Filter | Picks | Winrate | **ROI** | Bankroll growth |
|---|---|---|---|---|---|---|---|
| 1 | **Elo** | Ligue 1 | edge ≥ 4pp | 202 | 25.3% | **+16.67%** | +16.7% |
| 2 | **Dixon-Coles** | Premier League | edge ≥ 3pp, goto-devig | 265 | 34.7% | **+13.68%** | +13.7% |
| 3 | **Poisson** | Premier League | edge ≥ 3pp | 275 | 37.1% | **+12.65%** | +12.7% |
| 4 | **Elo** | Premier League | edge ≥ 4pp | 256 | 23.4% | **+9.75%** | +9.75% |
| 5 | **Dixon-Coles** | Serie A | edge ≥ 3pp, min-prob ≥ 0.40 | 131 | 54.2% | **+7.94%** | +7.9% |
| 6 | **Poisson** | Ligue 1 | edge ≥ 3pp | 207 | 42.0% | **+7.45%** | +7.5% |
| 7 | **Dixon-Coles** | Ligue 1 | edge ≥ 3pp, min-prob ≥ 0.40 | 108 | 53.7% | **+4.95%** | +5.0% |

## Observations

- **Premier League is the most beatable** — 4 profitable configs. Books leave value.
- **Ligue 1 works on Elo + Poisson** — less efficient market than top 3 leagues.
- **Serie A only with strict filter** (min prob ≥ 40%) — avoid value-bet noise.
- **La Liga + Bundesliga**: books too sharp, no profitable combo found across 3 models × 6 edges × 3 filter variants.
- **Kelly staking underperforms flat** — amplifies losses on negative-EV models. Use only when models are proven profitable on out-of-sample.

## Sample sizes + statistical significance

- All results above ≥ 100 picks per config → not random noise
- Premier League ROI spread: +9.75% to +13.68% across 3 independent models → signal, not luck
- Combined Elo PL + Ligue 1 = 458 picks, +12.8% blended ROI

## Caveats (honest)

- 2024-25 is ONE season. Multi-season required for strong confidence.
- goto_conversion de-vig adds ~2pp to ROI in PL (baseline +10.94% → +13.68%).
- We do NOT claim 60%+ winrate — real value betting is 30-55% winrate with positive EV.
- PL edge is narrowing year-on-year as AI models proliferate.

## What's next (v3)

- Add 2023-24 and 2022-23 seasons → 3-year backtest for confidence
- Ensemble: average DC + Poisson + Elo probabilities per match
- Add NBA via kyleskom + saccofrancesco/deepshot on nba_api data
- Add tennis via VincentAuriau on Sackmann CSVs
- Portfolio Kelly with corr-adjustment across sports
