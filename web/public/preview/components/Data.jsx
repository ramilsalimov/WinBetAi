// Shared data for WinBetAi — 4 REAL products from backtest on 2025-26 season

const MODELS = [
  {
    id: 'soccer-premium',
    name: 'Soccer Premium',
    author: 'Dixon-Coles + penaltyblog',
    repo: 'martineastwood/penaltyblog',
    sport: 'Бундеслига',
    sportColor: '#00E28A',
    winrate: 72.58,
    roi: 9.48,
    desc: 'Dixon-Coles статистическая модель на Бундеслигу с фильтром уверенности ≥65%. 1-2 пика в неделю, только высококонфиденсные прогнозы.',
    metrics: { picks365: 62, sharpe: 1.65, avgOdds: 1.55 },
    seedCurve: 7,
    finalROI: 9.48,
    vol: 0.8,
  },
  {
    id: 'soccer-multi',
    name: 'Soccer Multi-League',
    author: 'Dixon-Coles + Ensemble',
    repo: 'ensemble',
    sport: 'АПЛ/СА/Бундес.',
    sportColor: '#C9A24B',
    winrate: 55.0,
    roi: 12.0,
    desc: 'Три лучших конфигурации по лиге: Serie A DC (0.45), Бундеслига DC (0.50), АПЛ Ensemble (0.40). ~7 пиков в неделю через 3 лиги.',
    metrics: { picks365: 292, sharpe: 1.35, avgOdds: 2.10 },
    seedCurve: 13,
    finalROI: 12.0,
    vol: 1.0,
  },
  {
    id: 'nba-value',
    name: 'NBA Value',
    author: 'Elo walk-forward',
    repo: 'kyleskom/NBA-Machine-Learning-Sports-Betting',
    sport: 'NBA',
    sportColor: '#4FA3FF',
    winrate: 58.67,
    roi: 3.51,
    desc: 'Elo rating с home-court advantage на данных kyleskom (sbrscrape). Фильтр min-prob 0.60. 3-4 пика в неделю, средняя объём.',
    metrics: { picks365: 150, sharpe: 0.72, avgOdds: 1.85 },
    seedCurve: 21,
    finalROI: 3.51,
    vol: 1.1,
  },
  {
    id: 'nba-premium',
    name: 'NBA Premium',
    author: 'Elo strict',
    repo: 'kyleskom/NBA-Machine-Learning-Sports-Betting',
    sport: 'NBA',
    sportColor: '#9b59b6',
    winrate: 68.83,
    roi: 10.87,
    desc: 'Строгая версия NBA Value: только матчи с вероятностью фаворита ≥65%. ~2 пика в неделю, максимальная надёжность.',
    metrics: { picks365: 77, sharpe: 1.48, avgOdds: 1.50 },
    seedCurve: 31,
    finalROI: 10.87,
    vol: 0.9,
  },
];

const PICKS = [
  {
    league: 'Бундеслига · Тур 30',
    kickoff: '22 апр · 15:30 UTC',
    home: { name: 'Байер Л.', tag: 'B04', elo: 2012, form: 'В В Н П В' },
    away: { name: 'Штутгарт', tag: 'STU', elo: 1887, form: 'В В П В В' },
    prediction: 'Победа Байера',
    odds: 1.58,
    confidence: 72,
    model: 'Soccer Premium',
    edge: '+6.4%',
  },
  {
    league: 'NBA · Регулярка',
    kickoff: '22 апр · 01:30 UTC',
    home: { name: 'LA Lakers', tag: 'LAL', elo: 1612, form: 'В П В В В' },
    away: { name: 'Boston Celtics', tag: 'BOS', elo: 1698, form: 'В В В В П' },
    prediction: 'Победа Селтикс',
    odds: 1.65,
    confidence: 68,
    model: 'NBA Premium',
    edge: '+4.9%',
  },
  {
    league: 'Серия А · Тур 33',
    kickoff: '22 апр · 19:00 UTC',
    home: { name: 'Интер', tag: 'INT', elo: 2038, form: 'В В В В Н' },
    away: { name: 'Аталанта', tag: 'ATA', elo: 1942, form: 'Н П В В П' },
    prediction: 'Победа Интера',
    odds: 1.72,
    confidence: 55,
    model: 'Soccer Multi-League',
    edge: '+7.2%',
  },
];

const FAQ = [
  {
    q: 'Это реально бесплатно?',
    a: 'Да. Регистрируешься у нашего партнёрского букмекера (1win) по нашей ссылке и подтверждаешь аккаунт в кабинете. Мы получаем реферальную комиссию от него — не с тебя. Ты получаешь доступ ко всем 4 анализаторам навсегда.',
  },
  {
    q: 'Почему open-source модели? Почему не собственные?',
    a: 'Потому что прозрачность — суть проекта. Каждая модель которую мы используем — это реальный публичный GitHub репозиторий, который можно проверить, форкнуть и запустить самому. Никакого чёрного ящика. Мы провели честный бэктест и упаковали runtime.',
  },
  {
    q: 'Что значит "бэктест на closing odds"?',
    a: 'Мы прогнали каждую модель против реальных closing lines (финальных коэффициентов перед закрытием рынка) за год данных 2025-26. Closing odds — это консенсус рынка; стабильно бить их — то что отделяет сигнал от случайности.',
  },
  {
    q: 'Почему winrate 55-72%? Другие сайты обещают 90%+.',
    a: 'Потому что 90% — это ложь. При обычных коэффициентах (1.50-2.00) winrate 55% уже прибылен. 72% с ROI +9.5% — отличный результат. Любой кто обещает больше — что-то продаёт.',
  },
  {
    q: 'Какие виды спорта?',
    a: 'Soccer Premium — Бундеслига. Soccer Multi-League — АПЛ, Серия А, Бундеслига (3 лучшие лиги на 2025-26). NBA Value и NBA Premium — NBA регулярка и плей-офф. Всё на данных 2025-26 сезона.',
  },
  {
    q: 'Можно ли использовать с другими букмекерами?',
    a: 'Анализаторы выдают прогнозы и expected value — используй где хочешь. Бесплатный доступ требует только аккаунт 1win как подтверждение реферала. Твои ставки — твой выбор где играть.',
  },
  {
    q: 'Как часто переобучаются модели?',
    a: 'Мы подтягиваем обновления upstream репозиториев еженедельно и ре-бэктестим ежемесячно. Если модель перестаёт работать — ты увидишь это на equity curve до того, как мы сами заметим.',
  },
];

Object.assign(window, { MODELS, PICKS, FAQ });
