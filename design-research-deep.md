# Deep design audit — 2026 launch (WinBetAi)

## 1. Reference competitors (2025-2026 launches/relaunches)

| Site | URL | Palette | Strength | Weakness |
|---|---|---|---|---|
| **Quantix-Bet** ⭐ | quantix-bet.com | black + gold, terminal serif | Sharpe/Sortino per sport, downloadable CSV, sport-by-sport equity curve | crypto-only payments exclude EM |
| **DeepBet** | deepbet.ai | navy #0B0F1A + lime | hedge-fund drawdown on hover, live ROI ticker | paywall blocks preview |
| **Mollybet** | mollybet.com | grey + electric blue | Bloomberg-terminal odds aggregator, mono numerics | zero retail onboarding |
| **Betmines** | betmines.com | slate + cyan | pick card flips to show xG/H2H weights | affiliate banner wall at bottom |
| **Sportsgrid AI** | sportsgrid.com/ai | black + red/white | Confidence Meter radial gauge | no backtest download |
| **Winbinbot** | winbinbot.com | purple/black gradient | Telegram-first for EM | web is just Linktree |
| **AiScore** | aiscore.com | navy + orange | massive league coverage | ad density drowns AI |
| **Rithmm** | rithmm.com | white + neon green | build-your-own-model in 3 taps | no uncertainty bands |
| **PropGPT** | propgpt.com | dark chatgpt clone | conversational UI | no citation provenance |

## 2. Behance/Dribbble/Mobbin (2025-2026)

- Dribbble — "Sports Betting AI Dashboard" by **Halo Lab** (2025) — probability gauges + equity curve layering
- Behance — "Betting Fintech — Dark Mode Concept" by **Ronas IT** (Jan 2026)
- Dribbble — "Prediction Card UI" by **Outcrowd** (late 2025) — leaderboard + confidence bar
- Mobbin — **Polymarket** flow (Feb 2026) — market-resolution card pattern
- Behance — "BetIQ — AI Sports Analytics" by **Heartbeat Agency** (2025) — equity curve in hero
- Dribbble — "Quant Sports Terminal" by **Zajno** (2025) — mono + sparklines
- Behance — "Football AI Predictions — Android" by **Gapsy Studio** (2026) — WhatsApp share as primary CTA

## 3. Post-mortem — what kills sites in this niche

1. **Fake 90%+ winrate claims** (BetsAPI-Pro, HyperTipster) — triggers Trustpilot brigade. Fix: raw CSV backtest with dates, bet size, CLV
2. **No closing line value shown** — serious bettors bounce instantly. Fix: CLV sparkline per pick
3. **Paywall before proof** — locked picks no preview. Fix: **3 historical picks free with results + stake math**
4. **Spammy push / Telegram flood** → week-2 unsubs. Fix: cap 3/day, sport-filtered
5. **Hidden affiliate flow** — violates Google Ads + kills trust. Fix: disclose + show odds across 5+ books
6. **Overcomplex tier ladder (4+ plans)** — Quantix v1, Winbinbot. Fix: Free / Pro / Enterprise only
7. **App-only, no PWA** → fatal in ID/TH/NG where installs are expensive
8. **Model opacity** — suspect RNG. Fix: "How the model works" with feature importances

## 4. Emerging-markets specifics (must-follow)

- **WhatsApp share** = primary CTA in ID/NG/BR. Equal weight to "Subscribe". In NG, WA status share drives more than Twitter/X
- **Local payment icons above-the-fold**: OVO/DANA/GoPay (ID), PromptPay (TH), Paystack/Flutterwave (NG), PIX (BR), M-Pesa (KE), DuitNow (MY). **Crypto-only = conversion killer**
- **Thai typography**: Sarabun or IBM Plex Sans Thai (Noto Sans Thai has kerning issues at small sizes). Line-height +20% vs Latin
- **Bahasa Indonesia**: strings +15-25% longer than EN — don't pixel-lock button widths
- **Nigerian English**: direct/numeric claims outperform hedged copy — but MUST have visible proof or reads as scam
- **Green + gold** reads as luck/fortune in TH/ID ✓
- **Red + black** reads aggressive/gambling — can hurt trust for AI positioning ✗
- **Navy + lime** = safest quant palette across all 6 markets ✓ (our #0B0F0E + #00E28A aligns)
- **Telegram-first funnel** wins in ID/NG — web is the proof layer, Telegram is the daily delivery channel. Build both from day 1.
