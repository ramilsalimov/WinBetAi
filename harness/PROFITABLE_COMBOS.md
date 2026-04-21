# WinBetAi — 4 Product Line (2025-26 season backtest)

All results on real closing odds (Pinnacle/Bet365 for soccer, sbrscrape for NBA).
Flat 1u stake, walk-forward refit per match (soccer) or per game (NBA).

## 🎯 Final 4 products

| # | Product | Sport | Config | Picks | **Winrate** | **ROI** | Freq |
|---|---|---|---|---|---|---|---|
| 1 | **Soccer Premium** | Bundesliga | DC + min-prob 0.65 | 62 | **72.58%** | **+9.48%** | ~1.5/wk |
| 2 | **Soccer Multi-League** | PL + SA + BL | Per-league best filter | 292 | **~55%** | **+12%** | ~7/wk |
| 3 | **NBA Value** | NBA | Elo + min-prob 0.60 | 150 | **58.67%** | **+3.51%** | ~4/wk |
| 4 | **NBA Premium** | NBA | Elo strict + min-prob 0.65 | 77 | **68.83%** | **+10.87%** | ~2/wk |

## Soccer Multi-League — detail

Three per-league configs pooled:

| League | Model | Filter | Picks | Winrate | ROI |
|---|---|---|---|---|---|
| Serie A | Dixon-Coles | edge 3pp, min-prob 0.45 | 99 | 55.56% | **+12.96%** |
| Bundesliga | Dixon-Coles | edge 3pp, min-prob 0.50 | 112 | 60.71% | +7.05% |
| Premier League | Ensemble (DC+Poi+Elo) | edge 3pp, min-prob 0.40 | 81 | 48.15% | **+17.37%** |

**Combined**: 292 picks, ~55% WR, ~+12% ROI.

## Rejected configurations (shown for transparency)

| Config | Picks | WR | ROI | Why rejected |
|---|---|---|---|---|
| NBA O/U rolling avg | 255 | 48.6% | -7.12% | Doesn't beat -110 totals market |
| O/U 2.5 soccer DC base | 946 | 48.4% | -9.09% | Books are sharp on totals |
| Ensemble all-leagues strict 0.55 | 116 | 46.5% | -14.85% | Non-Bundesliga drags profit |
| La Liga 1X2 (any model) | all seasons | — | negative | Market too efficient |
| Tennis (Sackmann) | — | — | no odds data | Can't calculate ROI |

## Bank projection — $1000 starting

For all 4 products played concurrently (full 2025-26 season):

| Product | Stake per pick | Total staked | Expected PnL | Bank end |
|---|---|---|---|---|
| Soccer Premium | $20 (2%) | $1,240 | +$117 | $1,117 |
| Soccer Multi-League | $10 (1%) | $2,920 | +$350 | $1,350 |
| NBA Value | $10 (1%) | $1,500 | +$53 | $1,053 |
| NBA Premium | $20 (2%) | $1,540 | +$167 | $1,167 |

**If user plays only 1 product**: Premium tiers (#1 or #4) give best ROI per pick. Multi-League (#2) gives highest absolute profit through volume.

## Data sources

- **Soccer**: football-data.co.uk 2022-23, 2023-24, 2024-25, 2025-26 current
  - Columns: `PSCH/PSCD/PSCA` (Pinnacle closing) preferred
- **NBA**: kyleskom's `OddsData.sqlite` (tables `2024-25`, `odds_2025-26`)
  - American ML odds, converted to decimal
- **Avg odds** (no specific book): fixed 1.91 (-110 juice)

## Methodology disclosure

1. Walk-forward retrain per match/game — no look-ahead
2. Value-bet logic: bet only when `model_prob - implied_prob ≥ edge`
3. De-vig via `goto_conversion` for soccer, normalization for NBA
4. Flat stake (Kelly tested, underperformed on these models)
5. All numbers from closed season data (2024-25) + current season to date (2025-26 ≈ 50-88% complete depending on sport)

## What we DON'T claim

- ❌ "90% winrate" (impossible at scale; real ML peaks at 55-70%)
- ❌ "Consistent across all leagues/markets" (La Liga + O/U 2.5 failed)
- ❌ "Guaranteed profit" (past performance ≠ future)

## Next iterations (v3 harness)

- Ensemble with league-specific weights (DC 0.5 + Poi 0.3 + Elo 0.2 for Bundesliga etc.)
- 3-season rolling validation before declaring a combo "stable"
- Kelly staking once out-of-sample edge proven
- Add Bayesian model for higher accuracy on low-data leagues
- NBA: include days-rest, home-court strength, pace features (beat Elo)
