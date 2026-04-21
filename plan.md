# WinBetAi — План

## Концепция

Партнёрская воронка букмекера → лид-магнит = бесплатные AI-анализаторы ставок с подтверждённым бэктестом.

**Поток**: лендинг → юзер кликает affiliate link → регается у бука → опционально делает депозит → у нас в ЛК вводит ID/email → мы верифицируем через партнёрский API/postback → открываем доступ к AI-тулам.

**Ключевое решение**: файлы НЕ шлём на почту (спам). Всё через внутренний ЛК: дашборд, скачивания, ключи.

---

## Фазы

### Фаза 1 — MVP для аппрува в 1xPartners / 1winPartners
Партнёрку ещё не открыли — нужно показать реальный работающий продукт.

- Landing RU
- 3-4 рабочих open-source AI аналайзера, бэктест за 1 год (реальные цифры, график, таблица)
- Stub воронки: email capture / "скоро"
- Демо ЛК (без реальной верификации)

### Фаза 2 — после аппрува
- Реальный affiliate link + S2S postback
- Верификация → гейт доступа по **funded account** (обход ToS "incentivized registration")
- Полный ЛК + админка

---

## Целевые рынки (из AlgoFy master DB)

РФ не таргетим. Топ стран базы (1.25M контактов):

| # | Страна | Контактов | 1xbet | 1win |
|---|---|---|---|---|
| 1 | Indonesia | 252K | ✅ | ✅ |
| 2 | Thailand | 129K | ✅ | ✅ |
| 3 | Nigeria | 88K | ✅ | ✅ |
| 4 | Brazil | 65K | ✅ | ✅ |
| 5 | Malaysia | 64K | ✅ | ✅ |
| 6 | Kenya | 64K | ✅ | ✅ |
| 7 | Vietnam | 51K | ✅ | ✅ |
| 8 | South Africa | 44K | ✅ | ✅ |
| 9 | Egypt | 35K | ✅ | ✅ |
| 10 | Philippines | 33K | ✅ | ✅ |

Оба бука работают во всех этих странах — блокировки только в EU/US/UK/RF, не в наших таргетах.

## Выбор бука

| | 1xbet | 1win |
|---|---|---|
| Макс CPA | не публично | **до $250** |
| Макс RevShare | 40-45% | **до 60%** |
| API/postback | token (недокументирован) | **S2S postback** (идеал для нашего flow) |
| Мин. выплата | $30 | $100 |
| Бренд-узнаваемость в Global South | **Выше** (крупный международный) | Ниже |

Поскольку РФ-ограничения 1xbet не касаются наших таргет-стран, выбор чисто по экономике и удобству интеграции. **Приоритет — 1xbet** (по слову user'а), но техническая интеграция 1win через S2S postback на 1-2 порядка проще.

**Решено: главный бук — 1win**. 1xbet/1xStavka оставляем как второй слот для РФ-расширения в будущем.

⚠ **ToS обоих запрещают incentivized registration** ("зарегайся чтоб получить X"). Обходы:
1. Маркетинг без conditional фраз ("наш рекомендуемый брокер") + гейт на **депозит**, не на регу
2. Письменное разрешение персонального менеджера (есть exception clause в ToS)

---

## Продукты (лид-магнит)

4 open-source проекта с реальным track record (ресерч GitHub 2026):

| # | Проект | Stars | Sport | Модель | Наш план |
|---|---|---|---|---|---|
| 1 | [kyleskom/NBA-Machine-Learning-Sports-Betting](https://github.com/kyleskom/NBA-Machine-Learning-Sports-Betting) | 1.6K | NBA | XGBoost + Keras NN | Запустить as-is, 1y ре-бэктест |
| 2 | [georgedouzas/sports-betting](https://github.com/georgedouzas/sports-betting) | 691 | Soccer | sklearn stacking, value-bets | Использовать **встроенный backtester** |
| 3 | [kochlisGit/ProphitBet](https://github.com/kochlisGit/ProphitBet-Soccer-Bets-Predictor) | 500 | Soccer | NN + RF + ensemble | Экспорт predictions в наш harness |
| 4 | [mhaythornthwaite/Football_Prediction](https://github.com/mhaythornthwaite/Football_Prediction_Project) | 289 | EPL | LogReg / RF / SVC | Написать wrapper, честный ~55% baseline |

**Источники данных для бэктеста**:
- **football-data.co.uk** — бесплатные CSV с Bet365/Pinnacle closing odds (gold standard) — для #2, #3, #4
- nba.com/stats + SBR historical CSVs — для #1

**Наш бэктест**: единый harness проигрывает сезон 2024-25, логирует ROI per модель, выдаём как таблицу+график на сайт.

---

## Дизайн

**Палитра**: near-black `#0B0F0E` + neon mint `#00E28A` + muted gold `#C9A24B`
**Шрифты**: Inter (UI) + JetBrains Mono (цифры/котировки) + опционально Fraunces (hero)
**Референсы**: Polymarket × Linear × TradingView — "quant/edge" эстетика
**Hero**: live-updating карточка "AI pick of the day" + анимированный ROI sparkline
**Избегать**: белый+красный корпоратив (Forebet — выглядит дёшево)

Главные конкуренты для анализа UX: [OddsJam](https://oddsjam.com), [Stakehunters](https://stakehunters.com), [Tipstrr](https://tipstrr.com), [DeepBet](https://deepbet.ai)

---

## Техстек

- **Frontend**: Next.js 15 + TypeScript + Tailwind + shadcn/ui + Framer Motion
- **Charts**: ApexCharts / Recharts / TradingView Lightweight
- **Auth**: NextAuth (email + password) — для ЛК
- **DB**: PostgreSQL (Prisma ORM) — users, verifications, downloads, admin
- **AI аналайзеры**: Python workers (подключаем 4 проекта как submodules или forks в `/analyzers/`)
- **Backtest harness**: отдельный Python скрипт, генерит JSON/CSV → frontend рендерит графики
- **Queue**: пока не нужна, позже BullMQ
- **Хостинг**: потом (пока локально + git)

---

## Структура репо

```
WinBetAi/
├── apps/
│   ├── web/              # Next.js landing + ЛК + админка
│   └── backtest-api/     # Node/Python сервис для бэктест-данных
├── analyzers/
│   ├── nba-ml/           # submodule kyleskom
│   ├── soccer-douzas/    # submodule georgedouzas
│   ├── prophitbet/       # submodule kochlisGit
│   └── football-mhay/    # submodule mhaythornthwaite
├── harness/              # единый backtest runner (Python)
│   ├── run_all.py
│   ├── data/             # football-data.co.uk CSVs
│   └── results/          # ROI per модель, графики
├── prisma/               # schema
├── plan.md
└── README.md
```

---

## Следующие шаги

1. ✅ Research (продукты / affiliate / дизайн) — готово
2. Решить **1win vs 1xStavka**
3. Init Next.js 15 + Tailwind + shadcn в `apps/web/`
4. Prisma schema: User, Verification, Download, Admin
5. Landing page hero + palette + шрифты (MVP вид)
6. Клонировать 4 анализатора в `analyzers/`
7. Написать единый backtest harness (Python) — скачать football-data CSV за 2024-25
8. Прогнать все 4 модели → красивый график + таблица на landing
9. Stub воронки (email capture) + демо ЛК
10. Подать заявку в 1win/1xPartners со ссылкой на рабочий сайт
