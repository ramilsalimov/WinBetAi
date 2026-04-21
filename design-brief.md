# WinBetAi — Design Brief для Claude Design

Скопируй весь этот файл в claude.ai/design как стартовый промт.

---

## Продукт
WinBetAi — landing + личный кабинет для платформы, которая раздаёт бесплатные AI-анализаторы спортивных ставок тем, кто регистрируется у партнёрского букмекера. Мы берём 4 реальных open-source AI-модели, прогоняем их по году исторических котировок, показываем честный ROI/winrate в виде графиков.

## Целевая аудитория
Опытные беттеры из Indonesia, Thailand, Nigeria, Brazil, Malaysia, Kenya, Vietnam, Philippines. Возраст 25–45, мужчины в основном, финансово активные. Знакомы с Binance/TradingView эстетикой. Язык UI — English по умолчанию, с локализацией.

## Позиционирование
Premium quant-tool, не дешёвый tipster-сайт. Ощущение "edge / инсайд" через данные. Никакой "100% winrate" — показываем реальные цифры 55–70% и честный ROI.

## Палитра
- Background: `#0B0F0E` (near-black, слегка зеленоватый)
- Surface elevated: `#151817`
- Border: `#222826`
- Primary accent: `#00E28A` (neon mint) — CTAs, positive ROI, live indicators
- Gold accent: `#C9A24B` — premium tier, верифицированные знаки
- Text primary: `#F5F5F5`
- Text muted: `#9CA3AF`
- Chart positive: `#00E28A`
- Chart negative: `#FF5D5D`

## Типографика
- UI: **Inter** (400, 500, 600, 700)
- Numbers / odds / stats: **JetBrains Mono** (400, 700)
- Hero display (опционально): **Fraunces** или **Instrument Serif** для 1–2 строк

## Референсы (триангулируй стиль)
1. **Polymarket** (polymarket.com) — live карточки, probability bars, dark-neon
2. **Linear** (linear.app) — минимализм, idealная ритмика
3. **TradingView** (tradingview.com) — плотные данные, chart-heavy
4. **Vercel/Geist** (vercel.com) — grid-backgrounds, mono-детали
5. **Stripe** (stripe.com) — gradient mesh heroes, clean trust

Избегать: Forebet (форебет), Stake.com (casino vibe), SportyBet (cheap). Мы — **quant tool**, не казино.

## Экраны для дизайна

### 1. Landing Page (приоритет #1)
Секции сверху вниз:

**Navigation (sticky)**
- Logo "WinBetAi" (предложи маркенство, желательно геометричный + одна mint-точка)
- Links: Backtest / Products / FAQ
- Right: Sign In, Language switcher
- Transparent на скролле вверху → solid dark после 40px

**Hero (100vh)**
- Eyebrow: `AI + OPEN SOURCE` (mono, mint)
- Headline (2 строки): "AI bet analyzers.\nReal track record."
- Sub: "Four open-source models. Backtested on a full year of real closing odds. Pick the one that fits your game."
- CTA primary (mint): "See backtest →"
- CTA secondary (ghost): "How it works"
- **Right side or behind text**: живая карточка "AI Pick of the Day" — имя матча, команды, prediction, confidence gauge (animated), tiny ROI sparkline за 30 дней. Rive / Lottie / Framer Motion.
- Grid background subtle (8% opacity)
- Under hero: 4 tickers (big numbers mono) — Models: 4 / Backtest: 365 days / Avg ROI: +12.3% / 100% open-source

**Proof / Backtest (scroll snap #1)**
- Section eyebrow: "Honest backtest"
- H2: "One year. Real odds. Zero cherry-picking."
- Большой chart: 4 линии (по одной на модель) — equity curve за 2024-25 сезон. TradingView-стиль. Dark grid.
- Под графиком таблица: модель, sport, winrate %, ROI %, ссылка на GitHub
- Tab switcher между sports (Soccer / NBA / Combined)

**Products (scroll snap #2)**
- 4 карточки (2x2 grid):
  - NBA XGB+NN (kyleskom)
  - Soccer Stacker (georgedouzas)
  - ProphitBet (kochlisGit)
  - EPL LogReg (mhaythornthwaite)
- Каждая карточка: модель логотип/иконка, sport tag, winrate big mono, ROI big mono, маленький sparkline, "GitHub →" link
- Hover: карточка приподнимается, glow edge в mint, показывает 2–3 доп. метрики

**How it works (3 шага)**
- Step 1 "Register at 1win via our link" — иконка, короткий текст
- Step 2 "Confirm your ID in your dashboard" — иконка
- Step 3 "Download AI analyzers, use them" — иконка
- Horizontal layout на desktop, vertical на mobile
- Между шагами тонкие mint-пунктирные коннекторы

**FAQ** (5–7 вопросов, accordion)

**Footer**
- Logo, краткое описание
- Quick links колонки
- Language switcher
- Disclaimer "18+, gambling can be addictive"
- © 2026

### 2. Личный кабинет (/dashboard) — приоритет #2
Sidebar layout.

**Sidebar (260px)**
- Logo
- Nav: Overview / Analyzers / Downloads / Account
- Bottom: user email + sign out

**Overview (main)**
- Status card: "Verified ✓" или "Pending verification" (если ещё не подтвердил реф)
- Grid 3 карточек: Active models / Total downloads / Join date
- Activity feed (последние 5 действий)

**Analyzers page**
- 4 карточки (продукты) — как на landing
- Каждая с кнопкой "Download" (если verified) или "Verify to unlock" (если нет)
- Версия / last updated / size

### 3. Admin panel (/admin) — приоритет #3, простой
- Таблица users: email / affiliate_id / status / registered_at / actions
- Filter by status (pending/verified/rejected)
- Click user → детальная страница: все их данные, verification log, manual approve/reject

## UI-компоненты (важно чтоб были)
- Animated counter (для hero-статов)
- Confidence gauge (semi-circle, mint fill)
- Sparkline (tiny chart в карточках)
- Tab switcher
- Code-like "console" block (для показа команды запуска модели)
- Toast notifications (mint для success, red для error)
- Skeleton loaders

## Ощущение
Quant-terminal × premium SaaS. Плотно, но не душно. Быстро, responsive. Dark-first, без light-mode варианта.

## Что НЕ делать
- Никаких стоковых изображений спортсменов
- Никаких мигающих скидок / "ХВАТАЙ СЕЙЧАС" плашек
- Никаких casino-бонусов на главной
- Никаких "Заработай миллион" обещаний

## Экспорт
После дизайна — экспорт в Claude Code, чтобы я (Claude в CLI) подтянул компоненты в `web/` (Next.js 15 App Router + Tailwind v4 уже стоят).
