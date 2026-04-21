// Shared data for WinBetAi

const MODELS = [
  {
    id: 'nba-xgbnn',
    name: 'NBA XGB+NN',
    author: 'kyleskom',
    repo: 'NBA-Machine-Learning-Sports-Betting',
    sport: 'NBA',
    sportColor: '#E67E22',
    winrate: 64.8,
    roi: 18.2,
    desc: 'Gradient-boosted trees stacked with a dense neural net on 12 seasons of box-score + Vegas line deltas.',
    metrics: { picks365: 1240, sharpe: 1.42, avgOdds: 1.91 },
    seedCurve: 7,
    finalROI: 18.2,
    vol: 1.2,
  },
  {
    id: 'soccer-stacker',
    name: 'Soccer Stacker',
    author: 'georgedouzas',
    repo: 'sports-betting',
    sport: 'Soccer',
    sportColor: '#00E28A',
    winrate: 58.4,
    roi: 12.7,
    desc: 'Scikit-learn stack (LogReg + RF + LGBM) across 9 top European leagues, trained on ELO + form features.',
    metrics: { picks365: 2180, sharpe: 0.96, avgOdds: 2.14 },
    seedCurve: 13,
    finalROI: 12.7,
    vol: 0.9,
  },
  {
    id: 'prophitbet',
    name: 'ProphitBet',
    author: 'kochlisGit',
    repo: 'ProphitBet-Soccer-Bets-Predictor',
    sport: 'Soccer',
    sportColor: '#00E28A',
    winrate: 61.2,
    roi: 15.4,
    desc: 'Ensemble classifier (CatBoost + Random Forest) with home/away advantage priors and injury-weighted features.',
    metrics: { picks365: 1920, sharpe: 1.18, avgOdds: 2.02 },
    seedCurve: 21,
    finalROI: 15.4,
    vol: 1.0,
  },
  {
    id: 'epl-logreg',
    name: 'EPL LogReg',
    author: 'mhaythornthwaite',
    repo: 'Football_Prediction_Project',
    sport: 'EPL',
    sportColor: '#9b59b6',
    winrate: 59.9,
    roi: 14.1,
    desc: 'Regularised logistic regression on 20 years of Premier League fixtures — simple, fast, interpretable.',
    metrics: { picks365: 860, sharpe: 1.06, avgOdds: 2.21 },
    seedCurve: 31,
    finalROI: 14.1,
    vol: 0.85,
  },
];

const PICKS = [
  {
    league: 'EPL · Matchweek 34',
    kickoff: 'Apr 22 · 15:00 UTC',
    home: { name: 'Man City', tag: 'MCI', elo: 2041, form: 'W W W D L' },
    away: { name: 'Arsenal', tag: 'ARS', elo: 2018, form: 'W D W W W' },
    prediction: 'Over 2.5 Goals',
    odds: 1.78,
    confidence: 72,
    model: 'ProphitBet',
    edge: '+6.4%',
  },
  {
    league: 'NBA · Regular Season',
    kickoff: 'Apr 22 · 01:30 UTC',
    home: { name: 'LA Lakers', tag: 'LAL', elo: 1612, form: 'W L W W W' },
    away: { name: 'Boston Celtics', tag: 'BOS', elo: 1698, form: 'W W W W L' },
    prediction: 'Celtics −4.5',
    odds: 1.92,
    confidence: 68,
    model: 'NBA XGB+NN',
    edge: '+4.9%',
  },
  {
    league: 'La Liga · Jornada 33',
    kickoff: 'Apr 22 · 19:00 UTC',
    home: { name: 'Real Madrid', tag: 'RMA', elo: 2058, form: 'W W W W D' },
    away: { name: 'Villarreal', tag: 'VIL', elo: 1842, form: 'D L W W L' },
    prediction: 'BTTS — Yes',
    odds: 1.83,
    confidence: 65,
    model: 'Soccer Stacker',
    edge: '+3.7%',
  },
];

const FAQ = [
  {
    q: 'Is this really free?',
    a: 'Yes. You register at our partner bookmaker (1win) through our link and confirm your account in the dashboard. We get a referral fee from them — not from you. You get all four analyzers, forever.',
  },
  {
    q: 'Why open-source models? Why not your own?',
    a: 'Because transparency is the whole point. Every model we ship is a real public GitHub repo you can audit, fork, and run yourself. No black box. We just backtested them honestly and packaged the runtime.',
  },
  {
    q: 'What does "backtested on closing odds" mean?',
    a: 'We replayed each model against 365 days of real closing lines (the final odds before the market closes). Closing odds are the market consensus — beating them consistently is what separates signal from luck.',
  },
  {
    q: 'Why the 58–68% winrate range? Other sites promise 90%+.',
    a: 'Because 90% is a lie. At typical odds (1.85–2.10), a 56% winrate is already profitable. 65% with +15% ROI is exceptional. Anyone promising more is selling you something.',
  },
  {
    q: 'Which sports are covered?',
    a: 'Soccer (EPL, La Liga, Serie A, Bundesliga, Ligue 1, plus four others), NBA regular season + playoffs, and EPL-specific models for deeper league coverage.',
  },
  {
    q: 'Can I use these with bookmakers other than 1win?',
    a: 'The analyzers output predictions and expected value — you can use them anywhere. The free tier just requires a 1win account as proof of referral. Your bets, your choice.',
  },
  {
    q: 'How often are the models re-trained?',
    a: 'We pull upstream repo updates weekly and re-backtest monthly. If a model stops performing, you see it on the equity curve before anyone tells you.',
  },
];

Object.assign(window, { MODELS, PICKS, FAQ });
