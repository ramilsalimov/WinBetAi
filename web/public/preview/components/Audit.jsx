// Trust layer: resolved picks track record, feature importances, CSV download

// ---------- Resolved picks track record ----------
function TrackRecord() {
  const picks = [
    { date: 'Apr 20', league: 'EPL', match: 'Liverpool vs Tottenham', pick: 'Over 2.5', odds: 1.72, stake: 100, result: 'win', payout: 172, actual: '3-1', clv: '+2.1%', model: 'ProphitBet' },
    { date: 'Apr 20', league: 'NBA', match: 'Nuggets vs Suns', pick: 'DEN -3.5', odds: 1.91, stake: 100, result: 'win', payout: 191, actual: 'DEN 118-104', clv: '+3.4%', model: 'NBA XGB+NN' },
    { date: 'Apr 19', league: 'La Liga', match: 'Barcelona vs Sevilla', pick: 'BTTS Yes', odds: 1.83, stake: 100, result: 'win', payout: 183, actual: '3-2', clv: '+1.8%', model: 'Soccer Stacker' },
    { date: 'Apr 19', league: 'NBA', match: 'Bucks vs Heat', pick: 'Over 218.5', odds: 1.88, stake: 100, result: 'loss', payout: 0, actual: '108-101', clv: '-0.4%', model: 'NBA XGB+NN' },
    { date: 'Apr 18', league: 'Serie A', match: 'Inter vs Juventus', pick: 'Under 2.5', odds: 1.95, stake: 100, result: 'win', payout: 195, actual: '1-0', clv: '+4.2%', model: 'Soccer Stacker' },
    { date: 'Apr 18', league: 'EPL', match: 'Chelsea vs West Ham', pick: 'CHE -1.5', odds: 2.05, stake: 100, result: 'loss', payout: 0, actual: '2-1', clv: '+0.9%', model: 'EPL LogReg' },
    { date: 'Apr 17', league: 'NBA', match: 'Celtics vs 76ers', pick: 'BOS ML', odds: 1.55, stake: 100, result: 'win', payout: 155, actual: 'BOS 124-111', clv: '+1.2%', model: 'NBA XGB+NN' },
    { date: 'Apr 17', league: 'Bundesliga', match: 'Bayern vs Leverkusen', pick: 'Over 2.5', odds: 1.65, stake: 100, result: 'win', payout: 165, actual: '3-2', clv: '+2.7%', model: 'ProphitBet' },
  ];
  const wins = picks.filter(p => p.result === 'win').length;
  const pl = picks.reduce((s, p) => s + (p.payout - p.stake), 0);
  const avgCLV = (picks.reduce((s, p) => s + parseFloat(p.clv), 0) / picks.length).toFixed(2);

  return (
    <section id="track" style={{ padding: '120px 32px', borderTop: '1px solid #1B1F1E' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>ДОКАЗАТЕЛЬСТВА, НЕ ОБЕЩАНИЯ</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0, maxWidth: 720 }}>
              Последние 14 дней, каждый пик.<br />
              <span style={{ color: '#9CA3AF' }}>Результат + CLV + P/L.</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
              Скачать CSV
            </button>
            <button className="btn btn-ghost btn-sm">Все 365 дней →</button>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid #1B1F1E', borderRadius: 12, marginBottom: 20, background: '#0F1413' }}>
          <SumCell label="Пиков" v={picks.length} />
          <SumCell label="Рекорд" v={`${wins}-${picks.length - wins}`} sub={`${((wins / picks.length) * 100).toFixed(1)}% winrate`} />
          <SumCell label="P/L · $100 flat" v={`+$${pl}`} color="#00E28A" sub={`+${((pl / (picks.length * 100)) * 100).toFixed(1)}% ROI`} />
          <SumCell label="Средний CLV" v={`+${avgCLV}%`} color="#C9A24B" sub="closing line value" last />
        </div>

        <div style={{ background: '#0F1413', border: '1px solid #1B1F1E', borderRadius: 12, overflowX: 'auto' }}>
          <div style={{ minWidth: 1020 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '70px 80px minmax(200px,1.6fr) 1fr 75px 70px 85px 80px 80px 90px',
              gap: 14,
              padding: '12px 22px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280',
              borderBottom: '1px solid #1B1F1E', alignItems: 'center',
            }}>
              <span>Дата</span><span>Лига</span><span>Матч</span><span>Ставка</span><span>Кэф</span><span>Сумма</span><span>Итог</span><span>P/L</span><span>CLV</span><span>Модель</span>
            </div>
            {picks.map((p, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '70px 80px minmax(200px,1.6fr) 1fr 75px 70px 85px 80px 80px 90px',
                gap: 14, padding: '13px 22px', fontSize: 12.5, alignItems: 'center',
                borderBottom: i < picks.length - 1 ? '1px solid #1B1F1E' : 'none',
              }}>
                <span className="mono muted">{p.date}</span>
                <span><span className="chip" style={{ fontSize: 9.5 }}>{p.league}</span></span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.match}</span>
                <span style={{ color: '#F5F5F5', fontWeight: 500 }}>{p.pick}</span>
                <span className="mono">{p.odds.toFixed(2)}</span>
                <span className="mono muted">${p.stake}</span>
                <span className="mono" style={{ fontSize: 11 }}>
                  <span style={{ color: p.result === 'win' ? '#00E28A' : '#FF5D5D', fontWeight: 700, letterSpacing: '0.08em' }}>{p.result.toUpperCase()}</span>
                  <span className="muted" style={{ marginLeft: 6 }}>{p.actual}</span>
                </span>
                <span className="mono" style={{ color: p.payout > p.stake ? '#00E28A' : '#FF5D5D', fontWeight: 700 }}>
                  {p.payout > p.stake ? '+' : ''}${p.payout - p.stake}
                </span>
                <span className="mono" style={{ color: parseFloat(p.clv) >= 0 ? '#C9A24B' : '#6B7280' }}>{p.clv}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{p.model}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mono muted" style={{ fontSize: 11, marginTop: 14, textAlign: 'center', letterSpacing: '0.05em' }}>
          CLV измеряется vs closing line на момент начала матча. Ставки по $100 flat. Коэффициенты — медиана из 3 букмекеров на момент пика.
        </div>
      </div>
    </section>
  );
}
function SumCell({ label, v, sub, color, last }) {
  return (
    <div style={{ padding: '20px 24px', borderRight: last ? 'none' : '1px solid #1B1F1E' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 26, fontWeight: 700, color: color || '#F5F5F5', letterSpacing: '-0.02em', lineHeight: 1 }}>{v}</div>
      {sub && <div className="mono muted" style={{ fontSize: 11, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ---------- Pricing ----------
function Pricing() {
  const tiers = [
    {
      name: 'Free',
      desc: 'Все 4 анализатора, доступ через реферал 1win.',
      price: '$0',
      sub: 'навсегда · без карты',
      cta: 'Начать',
      highlight: false,
      features: ['Все 4 open-source модели', 'Бэктест CSV скачать', 'Пики ежедневно (до 3/день)', 'Telegram + WhatsApp доставка', 'Community support'],
    },
    {
      name: 'Pro',
      desc: 'Набор для серьёзного беттера. Без гейта.',
      price: '$29',
      sub: 'в месяц · отмена в любой момент',
      cta: 'Пробный 7 дней',
      highlight: true,
      features: ['Всё из Free, без гейта', 'Безлимитные пики по всем спортам', 'CLV трекинг на каждый пик', 'Сравнение коэф. (5+ букмекеров)', 'Feature importances по каждой модели', 'Приоритетная доставка (+30 мин edge)'],
    },
    {
      name: 'Enterprise',
      desc: 'API, кастомные модели, white-label.',
      price: 'По запросу',
      sub: 'от $499/мес',
      cta: 'Связаться',
      highlight: false,
      features: ['Всё из Pro', 'REST + WebSocket API', 'Обучение кастомных моделей', 'Выделенная инфра', 'SSO + audit log', 'Priority support (SLA 2ч)'],
    },
  ];
  return (
    <section id="pricing" style={{ padding: '120px 32px', borderTop: '1px solid #1B1F1E' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 16, display: 'inline-block' }}>ТАРИФЫ</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
            Три плана. Без ступенек.
          </h2>
          <p className="muted" style={{ marginTop: 18, fontSize: 15.5, maxWidth: 540, margin: '18px auto 0' }}>
            Free навсегда по реферу 1win. Апгрейд — когда нужны безлимитные пики, CLV трекинг и мульти-букмекерские коэффициенты.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {tiers.map(t => (
            <div key={t.name} style={{
              position: 'relative',
              background: t.highlight ? 'linear-gradient(180deg, rgba(0,226,138,0.05), #0F1413 40%)' : '#0F1413',
              border: t.highlight ? '1px solid rgba(0,226,138,0.4)' : '1px solid #1B1F1E',
              borderRadius: 14,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              transform: t.highlight ? 'translateY(-8px)' : 'none',
              boxShadow: t.highlight ? '0 20px 60px -20px rgba(0,226,138,0.25)' : 'none',
            }}>
              {t.highlight && (
                <div style={{
                  position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                  padding: '3px 12px', background: '#00E28A', color: '#00140B',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', borderRadius: 4, textTransform: 'uppercase',
                }}>Самый популярный</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}>{t.name}</div>
              <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, margin: '6px 0 22px', minHeight: 36 }}>{t.desc}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em', color: t.highlight ? '#00E28A' : '#F5F5F5' }}>{t.price}</span>
              </div>
              <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>{t.sub}</div>
              <button className={t.highlight ? 'btn btn-primary' : 'btn btn-ghost'} style={{ marginTop: 22, justifyContent: 'center' }}>{t.cta}</button>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #1B1F1E', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 13, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.highlight ? '#00E28A' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 3, flexShrink: 0 }}><path d="M5 12l5 5L20 7"/></svg>
                    <span style={{ color: '#E5E7EB' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Delivery channels (Telegram + WhatsApp) ----------
function DeliveryChannels() {
  return (
    <section id="delivery" style={{ padding: '120px 32px', borderTop: '1px solid #1B1F1E', background: '#0B0F0E' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 48, maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>ДОСТАВКА</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
            Пики туда,<br />
            <span style={{ color: '#9CA3AF' }}>где уже живёт твой телефон.</span>
          </h2>
          <p className="muted" style={{ marginTop: 18, fontSize: 15, maxWidth: 560, lineHeight: 1.55 }}>
            Максимум 3 пика в день. Фильтр по спорту. Никакого push-спама, никаких пэйволов за уведомлениями.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ChannelCard
            name="Telegram"
            tag="Ежедневная доставка · популярно в ID/NG/BR"
            color="#4FA3FF"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.04 15.5l-.37 5.2c.53 0 .76-.22 1.03-.49l2.47-2.35 5.13 3.74c.94.52 1.6.24 1.85-.87l3.35-15.71c.32-1.38-.5-1.93-1.41-1.59L1.87 10.08c-1.34.52-1.32 1.27-.23 1.6l4.77 1.48L17.5 6.36c.52-.34.99-.15.6.18z"/></svg>}
            sample={{
              from: 'WinBetAi Bot',
              when: '14:22',
              msg: '🎯 НОВЫЙ ПИК — Байер vs Штутгарт',
              lines: ['Прогноз: Победа Байера', 'Кэф: 1.58 · Уверенность: 72%', 'Edge: +6.4% · Модель: Soccer Premium'],
            }}
            ctas={['Открыть Telegram', 'QR код']}
          />
          <ChannelCard
            name="WhatsApp"
            tag="Share-friendly · дефолт в ID/NG/BR"
            color="#00E28A"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.76.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.83a8.08 8.08 0 0 1 8.08 8.08 8.08 8.08 0 0 1-8.08 8.08 8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.07.81.82-3-.19-.31a8.04 8.04 0 0 1-1.24-4.3 8.08 8.08 0 0 1 8.11-8.05z"/></svg>}
            sample={{
              from: 'WinBetAi',
              when: '14:22',
              msg: '🎯 AI пик на сегодня',
              lines: ['Победа Байера · BAY vs STU', 'Кэф 1.58 · Edge +6.4%', 'Тапни чтобы поделиться →'],
            }}
            ctas={['Подключить WhatsApp', 'Поделиться']}
          />
        </div>
      </div>
    </section>
  );
}

function ChannelCard({ name, tag, color, icon, sample, ctas }) {
  return (
    <div style={{
      background: '#0F1413',
      border: '1px solid #1B1F1E',
      borderRadius: 14,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 180, height: 180,
        background: `radial-gradient(circle, ${color}18, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${color}15`,
            border: `1px solid ${color}33`,
            display: 'grid', placeItems: 'center',
            color,
          }}>{icon}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{name}</div>
            <div className="muted" style={{ fontSize: 11.5 }}>{tag}</div>
          </div>
        </div>
        <span className="chip mono" style={{ fontSize: 9.5 }}>МАКС 3/ДЕНЬ</span>
      </div>

      {/* Chat bubble mock */}
      <div style={{
        background: '#0B0F0E',
        border: '1px solid #1B1F1E',
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color }}>{sample.from}</span>
          <span className="mono muted" style={{ fontSize: 10 }}>{sample.when}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{sample.msg}</div>
        {sample.lines.map((l, i) => (
          <div key={i} className="mono" style={{ fontSize: 11.5, color: '#9CA3AF', lineHeight: 1.6 }}>{l}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', borderColor: `${color}33`, color }}>{ctas[0]}</button>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>{ctas[1]}</button>
      </div>
    </div>
  );
}

// ---------- Payment strip ----------
function PaymentStrip() {
  const methods = [
    { name: 'OVO', mkt: 'ID', c: '#4C3494' },
    { name: 'DANA', mkt: 'ID', c: '#118EEA' },
    { name: 'GoPay', mkt: 'ID', c: '#00AED6' },
    { name: 'PromptPay', mkt: 'TH', c: '#1E5CB3' },
    { name: 'Paystack', mkt: 'NG', c: '#0BA4DB' },
    { name: 'Flutterwave', mkt: 'NG', c: '#F5A623' },
    { name: 'PIX', mkt: 'BR', c: '#32BCAD' },
    { name: 'M-Pesa', mkt: 'KE', c: '#43B02A' },
    { name: 'DuitNow', mkt: 'MY', c: '#E4003A' },
    { name: 'USDT', mkt: 'GLOBAL', c: '#26A17B' },
  ];
  return (
    <section style={{ padding: '40px 32px', borderTop: '1px solid #1B1F1E', borderBottom: '1px solid #1B1F1E', background: '#0B0F0E' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', flexShrink: 0 }}>
          Выплаты через<br /><span style={{ color: '#F5F5F5', fontSize: 12 }}>10+ локальных систем</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {methods.map(m => (
            <div key={m.name} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 12px',
              background: '#0F1413',
              border: '1px solid #1B1F1E',
              borderRadius: 8,
              fontSize: 12,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: m.c, display: 'inline-block' }} />
              <span style={{ fontWeight: 500 }}>{m.name}</span>
              <span className="mono muted" style={{ fontSize: 9.5, letterSpacing: '0.08em' }}>{m.mkt}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Feature importances (expandable) — sits under Products ----------
function FeatureImportances() {
  const [open, setOpen] = React.useState('nba-xgbnn');
  const features = {
    'nba-xgbnn': [
      { name: 'Vegas line delta', w: 0.24 },
      { name: 'Rolling 10-game ORtg', w: 0.18 },
      { name: 'Rest days differential', w: 0.14 },
      { name: 'Home/road splits', w: 0.11 },
      { name: 'Pace-adjusted DRtg', w: 0.09 },
      { name: 'Injury report delta', w: 0.08 },
      { name: 'Closing line movement', w: 0.07 },
      { name: '7 more features', w: 0.09 },
    ],
    'soccer-stacker': [
      { name: 'ELO rating differential', w: 0.26 },
      { name: 'xG rolling 5-match', w: 0.19 },
      { name: 'Home advantage prior', w: 0.15 },
      { name: 'Form (W/D/L last 5)', w: 0.12 },
      { name: 'Head-to-head (3yr)', w: 0.09 },
      { name: 'Rest days', w: 0.07 },
      { name: 'League strength coeff', w: 0.06 },
      { name: '5 more features', w: 0.06 },
    ],
    'prophitbet': [
      { name: 'ELO + recent form', w: 0.22 },
      { name: 'Home/away advantage', w: 0.18 },
      { name: 'Injury-weighted strength', w: 0.16 },
      { name: 'Scoring trend (xG)', w: 0.13 },
      { name: 'Season position delta', w: 0.11 },
      { name: 'Manager tenure', w: 0.08 },
      { name: 'Other', w: 0.12 },
    ],
    'epl-logreg': [
      { name: '20-yr home win rate', w: 0.28 },
      { name: 'Current form (pts/gm)', w: 0.21 },
      { name: 'Goal difference delta', w: 0.17 },
      { name: 'H2H historical', w: 0.14 },
      { name: 'Position in table', w: 0.11 },
      { name: 'Other', w: 0.09 },
    ],
  };
  const current = features[open];
  const model = MODELS.find(m => m.id === open);

  return (
    <section style={{ padding: '0 32px 120px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          background: '#0F1413', border: '1px solid #1B1F1E', borderRadius: 14, padding: 28,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10, color: '#C9A24B' }}>БЕЗ ЧЁРНОГО ЯЩИКА</div>
              <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>
                Что на самом деле взвешивает каждая модель
              </h3>
              <p className="muted" style={{ fontSize: 13, margin: '6px 0 0', maxWidth: 560 }}>
                Топ-фичи по permutation importance. Вытащено прямо из боевого репозитория.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: '#0B0F0E', border: '1px solid #1B1F1E', borderRadius: 8 }}>
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setOpen(m.id)} style={{
                  padding: '6px 10px', borderRadius: 5, fontSize: 11.5, fontWeight: 500,
                  color: open === m.id ? '#F5F5F5' : '#9CA3AF',
                  background: open === m.id ? '#151817' : 'transparent',
                  border: open === m.id ? '1px solid #2C3330' : '1px solid transparent',
                }}>{m.name}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.map(f => (
              <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 60px', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#E5E7EB' }}>{f.name}</span>
                <div style={{ height: 8, background: '#151817', borderRadius: 4, overflow: 'hidden', border: '1px solid #1B1F1E' }}>
                  <div style={{
                    width: `${f.w * 100 / 0.28}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(0,226,138,0.3), #00E28A)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <span className="mono" style={{ fontSize: 12, color: '#00E28A', textAlign: 'right', fontWeight: 600 }}>{(f.w * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="mono muted" style={{ fontSize: 10.5, letterSpacing: '0.08em', marginTop: 18, paddingTop: 16, borderTop: '1px solid #1B1F1E' }}>
            Источник: {model?.repo} · permutation importance на 2024 holdout · полный список в репе
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- WhatsApp floating share button ----------
function WhatsShare() {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed', bottom: 24, left: 24,
        width: hover ? 'auto' : 52, height: 52,
        padding: hover ? '0 18px 0 14px' : 0,
        borderRadius: 26,
        background: '#00E28A',
        color: '#00140B',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 24px rgba(0,226,138,0.35)',
        transition: 'all 0.25s',
        zIndex: 50,
        overflow: 'hidden',
        fontSize: 13, fontWeight: 600,
      }}
      title="Поделиться пиком в WhatsApp"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.76.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/></svg>
      {hover && <span style={{ whiteSpace: 'nowrap' }}>Поделиться пиком</span>}
    </a>
  );
}

Object.assign(window, { TrackRecord, Pricing, DeliveryChannels, PaymentStrip, FeatureImportances, WhatsShare });
