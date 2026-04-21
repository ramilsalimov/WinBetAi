# Multi-sport AI analyzers — shortlist (2026 research)

## Final shortlist — 8 projects covering 6+ sports

| # | Sport | Project | Stars | Model | Why pick |
|---|---|---|---|---|---|
| 1 | **NBA** | [kyleskom/NBA-ML-Sports-Betting](https://github.com/kyleskom/NBA-Machine-Learning-Sports-Betting) | **1629** | XGBoost + NN | Flagship repo, instant credibility |
| 2 | **Soccer** | [martineastwood/penaltyblog](https://github.com/martineastwood/penaltyblog) | 157 | Poisson, Dixon-Coles, Elo, Bayesian | 2026-active, value-bet math + Kelly |
| 3 | **Multi-sport** | [georgedouzas/sports-betting](https://github.com/georgedouzas/sports-betting) | 691 | sklearn pipeline, odds-aware | One codebase, several leagues |
| 4 | **Tennis** | [VincentAuriau/Tennis-Prediction](https://github.com/VincentAuriau/Tennis-Prediction) | 69 | XGBoost + Elo | Best OSS tennis, ~65-68% |
| 5 | **NBA alt** | [NBA-Betting/NBA_AI](https://github.com/NBA-Betting/NBA_AI) | 100 | Ensemble (GB + DL) | Second NBA voice, shows model blending |
| 6 | **UFC/MMA** | [WarrierRajeev/UFC-Predictions](https://github.com/WarrierRajeev/UFC-Predictions) | 131 | Classifiers + web UI | De-facto UFC repo, 65-70% |
| 7 | **Esports (LoL)** | [reneleogp/ML-Prediction-LoL](https://github.com/reneleogp/ML-Prediction-LoL) | 54 | Two ML algos post-champ select | ~78% late-game |
| 8 | **Value-bet math** | [goto_conversion](https://github.com/gotoConversion/goto_conversion) + [WagerBrain](https://github.com/sedemmler/WagerBrain) | 108 + 300 | Kelly, EV, odds→true prob | Quantix-Bet-style wrapper layer |

**Covered sports**: NBA (×2), Soccer, Tennis, UFC, Esports/LoL. Plus multi-sport pipeline (#3) can be extended to any league with historical CSVs.

## Key strategic insight

**Quantix-Bet is NOT open-source.** They publish Sharpe per sport but keep code private. We can position **WinBetAi = open-source Quantix equivalent**.

Their aesthetic is recreated via: penaltyblog (soccer) + goto_conversion (implied prob math) + WagerBrain (Kelly/EV) → wrap models' outputs into a value-bet dashboard. This makes the site look professional vs "notebook dump".

## Data sources (all free + reproducible)
- NBA: `nba_api` + Sportsbook Reviews Online (SBR)
- Soccer: **football-data.co.uk** (Bet365/Pinnacle closing odds CSVs)
- Tennis: Jeff Sackmann's tennis_atp CSVs
- UFC: ufcstats scraper
- LoL: Riot API
- MLB/NFL/NHL (if we expand): pybaseball / nfl_data_py / nhl-api-py

## Weak coverage (skip for MVP, add later)

| Sport | Status | Plan |
|---|---|---|
| NHL | OSS thin (3-stars) | Custom thin model on nhl-api-py via georgedouzas pipeline |
| MLB | OSS decent but stale | Custom on pybaseball Statcast |
| NFL | OSS small (10 stars) | Custom thin model on nfl_data_py |
| Volleyball | Very thin | Skip MVP |
| Golf/PGA | Very thin | Skip MVP |

## What to avoid
Any repo described as "AI betting tool" with 0 stars and no backtest → 95% are LLM wrappers. Don't ship those.

## Practical build order for the harness
1. Write unified backtest runner that accepts `model.predict(match) → {probability, stake_hint}`
2. Plug each of the 8 projects via thin adapter (3-4 are easy: kyleskom, penaltyblog, georgedouzas, tennis)
3. Replay 2024-25 season data with closing odds → ROI per model
4. Present as equity curves + CSV download (Quantix aesthetic)
5. Value-bet overlay via goto_conversion + WagerBrain — "model vs closing line" Sharpe per sport
