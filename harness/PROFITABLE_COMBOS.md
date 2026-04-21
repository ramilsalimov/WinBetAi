# Profitable model × league combos — 3-year soccer backtest (2022-23 to 2024-25)

All results on real closing odds (Pinnacle/Bet365) from football-data.co.uk.
Flat 1u stake, walk-forward refit per match.

## 🏆 The one truly robust combo

**Elo + Bundesliga** — **3 out of 3 seasons profitable**:

| Season | Picks | Winrate | ROI |
|---|---|---|---|
| 2022-23 | 185 | 27.6% | **+12.01%** ✅ |
| 2023-24 | 197 | 22.8% | **+1.26%** ✅ |
| 2024-25 | 172 | 25.6% | **+10.70%** ✅ |
| **3yr** | **554** | **25.3%** | **+7.99%** ✅ |

This is the only model × league where all 3 seasons ended positive. Sample size 554 picks = statistically meaningful.

## Single-season anomalies (beware survivorship bias)

These had one big season but didn't replicate:

| Model | League | 22-23 | 23-24 | 24-25 | Honest verdict |
|---|---|---|---|---|---|
| Dixon-Coles | Premier League | +2.41% | -16.60% | **+13.68%** | 24-25 was variance |
| Elo | Premier League | +7.03% | -22.46% | +11.99% | 2/3 positive, but -22% year is bad |
| Poisson | Premier League | +5.88% | -19.17% | +12.65% | Same story |
| Poisson | Serie A | **+15.07%** | 0.00% | -14.12% | 22-23 anomaly |
| Poisson | Ligue 1 | +2.21% | -7.43% | +7.45% | mixed, ~flat |
| Elo | Ligue 1 | -28.42% | -10.85% | **+11.23%** | 24-25 was variance |

## Consistently losing combinations

- **La Liga**: all 3 models negative all 3 years. Books are sharp.
- **Serie A**: mixed, near-zero on average.

## By-season combined ROI

| Season | Elo | DC | Poisson |
|---|---|---|---|
| 2022-23 | -3.19% | -4.50% | **+0.20%** |
| 2023-24 | -17.82% | -5.81% | -8.38% |
| 2024-25 | -2.18% | -5.73% | -5.28% |
| 3-yr avg | -7.7% | -5.3% | -4.5% |

**Honest read**: naive value-betting with basic probabilistic models averages **-5% to -8% ROI long-term**. The books are efficient. Edge exists in isolated pockets (Bundesliga with Elo) or single-season variance.

## What the site should honestly show

**Hero claim (defensible)**: "Elo rating on Bundesliga 2022-2025: +8% ROI, 554 picks, positive every season."

**Full transparency**: Publish the full 15-combo table (3 years × 5 leagues × 3 models) with negative results too. This is our DIFFERENTIATOR vs tipster sites that cherry-pick.

## Next experiments

1. **Ensemble**: avg DC + Poisson + Elo probabilities per match — noise reduction
2. **NBA**: port kyleskom NBA-ML + saccofrancesco/deepshot onto our harness
3. **Tennis**: VincentAuriau + Sackmann CSVs for ATP 2022-2024
4. **Different markets**: Over/Under 2.5, BTTS, Asian handicap (less efficient than 1X2)

## Caveats

- We use FREE data (football-data.co.uk). Commercial data (xG, lineups, weather) could improve models
- We retrain on every match (computationally expensive). Commercial systems use scheduled retrains
- Closing odds slipped slightly 2022-2025 due to market maturation — what worked then may not work now
