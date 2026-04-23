# WinBetAi — Production Deploy Plan

## Stack

| Component | Tech | Host |
|---|---|---|
| Frontend | Next.js 15 + React 18 | Vercel (free tier) |
| Picks generator | Python 3.13 + penaltyblog | OVH2 VPS cron |
| Picks delivery | JSON file via HTTPS | Vercel static + OVH2 rsync |
| TG bot | Python script | OVH2 cron, after generator |
| Auth / subscriptions | Supabase or Clerk | External SaaS |
| Payments | Bookmaker referral (1win CPA) | External |
| DB (users, picks log) | Postgres (Supabase) | Supabase free tier |

## Step-by-step

### 1. Domain + Vercel

1. Buy `winbetai.com` (~$12/year at Cloudflare/Namecheap)
2. Connect GitHub repo → Vercel project
3. Auto-deploy on push to main

### 2. Daily picks pipeline

On OVH2 (already has cron + harness):
```cron
# 05:00 UTC: regenerate picks
0 5 * * * cd /home/ubuntu/winbetai && ODDS_API_KEY=xxx python3 generator/generate_picks.py --source api >> generator.log 2>&1

# 05:15 UTC: commit + push to GitHub (Vercel redeploys automatically)
15 5 * * * cd /home/ubuntu/winbetai-repo && cp /home/ubuntu/winbetai/web/public/picks.json web/public/picks.json && git add web/public/picks.json && git commit -m "daily picks" && git push >> deploy.log 2>&1

# 05:20 UTC: TG broadcast
20 5 * * * cd /home/ubuntu/winbetai && TG_BOT_TOKEN=xxx TG_CHAT_ID=@winbetai python3 generator/tg_broadcast.py >> tg.log 2>&1
```

### 3. Auth + subscriptions

Minimal MVP — no custom backend. Use Supabase:
- Email/password auth
- Users table: `{id, email, ref_code, verified_at, 1win_user_id}`
- When user inputs 1win account ID in LK → mark `verified_at`, unlock downloads
- Use Supabase RLS (Row-Level Security) instead of a custom API

### 4. 1win S2S postback

When user registers via affiliate link:
- 1win sends S2S webhook → Next.js API route `/api/1win/postback`
- Store: user's 1win_user_id ↔ our user.ref_code
- When user enters 1win_user_id in LK → check match → `verified_at = now()`

### 5. Odds API

- [the-odds-api.com](https://the-odds-api.com) free 500/month
- 1 request per league/day = 5 requests/day = 150/month — within free tier
- If upgrade needed: $29/month for 20k requests

### 6. Cost estimate

| Item | Monthly |
|---|---|
| Domain | $1 |
| Vercel | $0 (free tier enough for <100k visits/mo) |
| OVH2 VPS | already paid for DMTG |
| Supabase | $0 (free tier: 500MB DB, 2GB bandwidth) |
| the-odds-api | $0 (free tier) |
| **TOTAL** | **~$1/mo** until scaling |

## Launch checklist

- [ ] Port NBA generator (currently empty in `generator/generate_picks.py`)
- [ ] Register the-odds-api, obtain key
- [ ] Test `--source api` end-to-end for all 4 products
- [ ] Buy domain + configure DNS
- [ ] Vercel deploy from GitHub (winbetai repo)
- [ ] Supabase project + schema (`users`, `picks_log`)
- [ ] 1win affiliate signup + approved account
- [ ] Replace `Admin.jsx` mock data with Supabase queries
- [ ] TG channel creation + bot approval
- [ ] Multi-language switch (currently EN/RU only active; ID/TH/PT/VI copy exists but not surfaced)
