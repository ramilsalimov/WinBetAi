# WinBetAi Generator

Daily live pick generator + TG broadcaster.

## Flow

```
 [ ingest odds ]         [ generate_picks.py ]         [ web/public/picks.json ]
  CSV / the-odds-api  →     apply 4 models          →    site fetches /picks.json
                            filter by thresholds
                                    ↓
                         [ tg_broadcast.py ]
                            TG channel broadcast
```

## Daily cron (OVH2)

```cron
0 5 * * * cd /home/ubuntu/winbetai && python3 generator/generate_picks.py --source csv >> /home/ubuntu/winbetai/generator.log 2>&1
```

Runs at 05:00 UTC. Produces:
- `generator/results/picks-YYYY-MM-DD.json` — archive
- `web/public/picks.json` — site consumption

## Switch to live odds

1. Register at [the-odds-api.com](https://the-odds-api.com) — free tier 500 req/month
2. Set env var:
   ```bash
   export ODDS_API_KEY=your_key_here
   ```
3. Change cron source:
   ```cron
   0 5 * * * cd /home/ubuntu/winbetai && ODDS_API_KEY=... python3 generator/generate_picks.py --source api >> ...
   ```

## TG broadcaster

```bash
export TG_BOT_TOKEN="123456:ABC..."
export TG_CHAT_ID="@winbetai_picks"
python3 tg_broadcast.py             # send all
python3 tg_broadcast.py --product soccer-premium  # filter
python3 tg_broadcast.py --dry-run   # preview without sending
```

Recommended cron pairing:
```cron
0 5 * * * cd /home/ubuntu/winbetai && python3 generator/generate_picks.py --source api && python3 generator/tg_broadcast.py >> tg.log 2>&1
```

## NBA picks

Currently `generate_nba_picks()` returns empty list. To activate:
1. Port Elo walk-forward from `harness/run_nba_backtest.py` into `generate_picks.py:generate_nba_picks()`
2. Hook up NBA upcoming-games fetch (the-odds-api `basketball_nba`)
3. Apply min-prob 0.60 (NBA Value) and 0.65 (NBA Premium) filters

## Current products & filters

See `harness/PROFITABLE_COMBOS.md` for source-of-truth backtest numbers.

| Product | League | Model | min-prob | min-edge |
|---|---|---|---|---|
| Soccer Premium | Bundesliga | Dixon-Coles | 0.65 | 0.03 |
| Multi-League | PL/SA/BL | DC/DC/Ensemble | 0.40-0.50 | 0.03 |
| NBA Value | NBA | Elo | 0.60 | 0.03 |
| NBA Premium | NBA | Elo | 0.65 | 0.03 |

## Guard rails

- Training corpus: 4 full seasons (2022-23 through 2025-26 completed matches)
- Walk-forward — no look-ahead (each fixture uses only prior-dated matches)
- De-vig via `goto_conversion` (for soccer) — closer to true probs than `1/odds`
- If API/CSV has no fixtures → falls back to last-10-completed demo (easy to eyeball output)
