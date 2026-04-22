// Backtest section, Products, How it works, FAQ

function BacktestSection() {
  const [sport, setSport] = React.useState('combined');

  const series = React.useMemo(() => {
    const all = MODELS.map(m => ({
      name: m.name,
      color: m.id === 'nba-xgbnn' ? '#00E28A'
           : m.id === 'soccer-stacker' ? '#C9A24B'
           : m.id === 'prophitbet' ? '#4FA3FF'
           : '#9b59b6',
      sport: m.sport,
      data: makeEquityCurve({ seed: m.seedCurve, finalROI: m.finalROI, vol: m.vol }),
    }));
    if (sport === 'soccer') return all.filter(s => s.sport === 'Soccer' || s.sport === 'EPL');
    if (sport === 'nba') return all.filter(s => s.sport === 'NBA');
    return all;
  }, [sport]);

  return (
    <section id="backtest" style={{ padding: '120px 32px', borderTop: '1px solid #1B1F1E', background: '#0B0F0E' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>ЧЕСТНЫЙ БЭКТЕСТ</div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 720,
            }}>
              Год. Реальные коэффициенты.<br />
              <span style={{ color: '#9CA3AF' }}>Без черри-пика.</span>
            </h2>
            <p className="muted" style={{ marginTop: 20, fontSize: 15, maxWidth: 560, lineHeight: 1.55 }}>
              Каждый пик прогнан по closing line. Плоская ставка $100. Без шорткатов, без ретроспективных фильтров.
            </p>
          </div>
          <Tabs
            value={sport}
            onChange={setSport}
            tabs={[
              { value: 'combined', label: 'Все' },
              { value: 'soccer', label: 'Футбол' },
              { value: 'nba', label: 'NBA' },
            ]}
          />
        </div>

        {/* chart panel */}
        <div style={{
          background: '#0F1413',
          border: '1px solid #1B1F1E',
          borderRadius: 14,
          padding: 24,
        }}>
          {/* panel header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 4 }}>
                Equity curve · плоская ставка $100 · сезон 2025-26
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  +$1,197
                </span>
                <span className="mono pos" style={{ fontSize: 13, fontWeight: 700 }}>+9.0% ROI</span>
                <span className="mono muted" style={{ fontSize: 12 }}>среднее по {series.length} моделям</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {series.map(s => (
                <div key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                  <span style={{ width: 10, height: 2, background: s.color, display: 'inline-block' }} />
                  <span style={{ color: '#F5F5F5' }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <EquityChart series={series} height={360} animateKey={sport} />

          {/* table */}
          <div style={{
            marginTop: 20,
            borderTop: '1px solid #1B1F1E',
            paddingTop: 4,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr',
              padding: '12px 4px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#6B7280',
              borderBottom: '1px solid #1B1F1E',
            }}>
              <span>Model</span><span>Sport</span><span>Winrate</span><span>ROI</span><span>CLV</span><span>Picks/yr</span><span style={{ textAlign: 'right' }}>Source</span>
            </div>
            {MODELS.map((m, idx) => (
              <div key={m.id} style={{
                display: 'grid',
                gridTemplateColumns: '1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr',
                padding: '14px 4px',
                alignItems: 'center',
                borderBottom: '1px solid #1B1F1E',
                fontSize: 13,
              }}>
                <span style={{ fontWeight: 500 }}>{m.name}<span className="mono muted" style={{ marginLeft: 8, fontSize: 11 }}>@{m.author}</span></span>
                <span><span className="chip" style={{ fontSize: 10 }}>{m.sport}</span></span>
                <span className="mono">{m.winrate.toFixed(1)}%</span>
                <span className="mono pos" style={{ fontWeight: 700 }}>+{m.roi.toFixed(1)}%</span>
                <span className="mono" style={{ color: '#C9A24B', fontWeight: 600 }}>+{[2.4, 1.8, 2.1, 1.6][idx].toFixed(1)}%</span>
                <span className="mono muted">{m.metrics.picks365.toLocaleString()}</span>
                <a href="#" style={{ textAlign: 'right', color: '#9CA3AF', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  GitHub
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Products ----------
function ProductsSection() {
  return (
    <section id="products" style={{ padding: '120px 32px', background: '#0B0F0E' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>ПРОДУКТЫ</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
            Четыре модели.<br />
            <span style={{ color: '#9CA3AF' }}>Выбери свою игру.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {MODELS.map((m, i) => <ProductCard key={m.id} model={m} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ model, index }) {
  const [hover, setHover] = React.useState(false);
  const spark = React.useMemo(() =>
    makeEquityCurve({ seed: model.seedCurve + 3, finalROI: model.roi, vol: model.vol }).map(p => p.y).filter((_, i) => i % 8 === 0),
    [model]);

  const color = ['#00E28A', '#C9A24B', '#4FA3FF', '#9b59b6'][index];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: '#0F1413',
        border: `1px solid ${hover ? 'rgba(0,226,138,0.4)' : '#222826'}`,
        borderRadius: 14,
        padding: 28,
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? '0 20px 60px -20px rgba(0,226,138,0.25)' : 'none',
        transition: 'all 0.25s',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: hover ? 1 : 0.4,
        transition: 'opacity 0.25s',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#151817',
              border: `1px solid ${color}33`,
              display: 'grid', placeItems: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11, fontWeight: 700,
              color: color,
              letterSpacing: '0.05em',
            }}>
              {model.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{model.name}</div>
              <div className="mono muted" style={{ fontSize: 11 }}>@{model.author} · {model.repo}</div>
            </div>
          </div>
        </div>
        <span className="chip" style={{ fontSize: 10, color: color, borderColor: `${color}33`, background: `${color}10` }}>{model.sport}</span>
      </div>

      <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.55, margin: '6px 0 22px' }}>{model.desc}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end', paddingTop: 16, borderTop: '1px solid #1B1F1E' }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Winrate</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {model.winrate.toFixed(1)}<span className="muted" style={{ fontSize: 14 }}>%</span>
          </div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>ROI · 1yr</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color: '#00E28A', letterSpacing: '-0.02em' }}>
            +{model.roi.toFixed(1)}<span style={{ fontSize: 14 }}>%</span>
          </div>
        </div>
        <Sparkline data={spark} width={100} height={36} color={color} strokeWidth={1.8} />
      </div>

      {/* hover metrics */}
      <div style={{
        maxHeight: hover ? 80 : 0,
        opacity: hover ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s',
        marginTop: hover ? 16 : 0,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, padding: '14px 0 0', borderTop: '1px solid #1B1F1E' }}>
          <Metric label="Picks / yr" v={model.metrics.picks365.toLocaleString()} />
          <Metric label="Sharpe" v={model.metrics.sharpe.toFixed(2)} />
          <Metric label="Avg odds" v={model.metrics.avgOdds.toFixed(2)} />
        </div>
      </div>

      <a href="#" style={{
        marginTop: 18,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12.5,
        color: hover ? '#00E28A' : '#9CA3AF',
        transition: 'color 0.15s',
      }}>
        GitHub repo
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg>
      </a>
    </div>
  );
}
function Metric({ label, v }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 9.5, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
      <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>{v}</div>
    </div>
  );
}

// ---------- How it works ----------
function HowItWorks() {
  const steps = [
    { n: '01', h: 'Регистрация в 1win', d: 'Открой счёт у нашего партнёр-букмекера по ссылке в кабинете. Занимает ~90 секунд.', cmd: 'wb open-partner' },
    { n: '02', h: 'Подтверди ID', d: 'Вставь свой 1win user ID. Система проверит реферал в течение часа, чаще — моментально.', cmd: 'wb verify --id 81724' },
    { n: '03', h: 'Запусти анализаторы', d: 'Скачай все 4 модели из кабинета. CLI одной командой, Docker-образ или чистый Python — на выбор.', cmd: 'wb run soccer-premium' },
  ];
  return (
    <section id="how" style={{ padding: '120px 32px', borderTop: '1px solid #1B1F1E' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>ТРИ ШАГА</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
            От нуля до первого пика<br />
            <span style={{ color: '#9CA3AF' }}>меньше 10 минут.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, position: 'relative' }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ position: 'relative' }}>
              <div style={{
                background: '#0F1413',
                border: '1px solid #1B1F1E',
                borderRadius: 14,
                padding: 26,
                height: '100%',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div className="mono" style={{ fontSize: 11, color: '#00E28A', letterSpacing: '0.15em' }}>ШАГ {s.n}</div>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: '#151817',
                    border: '1px solid #222826',
                    display: 'grid', placeItems: 'center',
                    color: '#00E28A',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {i === 0 ? <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>
                        : i === 1 ? <><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.39 0 4.68.94 6.36 2.64"/></>
                        : <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>}
                    </svg>
                  </div>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 10px' }}>{s.h}</h3>
                <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.55, margin: '0 0 20px' }}>{s.d}</p>

                <div style={{
                  background: '#0B0F0E',
                  border: '1px solid #1B1F1E',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ color: '#00E28A' }}>$</span>
                  <span>{s.cmd}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6B7280' }}>↵</span>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: -14,
                  width: 28,
                  height: 1,
                  background: 'transparent',
                  borderTop: '1px dashed rgba(0,226,138,0.35)',
                  zIndex: 1,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
function FAQSection() {
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" style={{ padding: '120px 32px', borderTop: '1px solid #1B1F1E' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>ВОПРОСЫ</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
            Неудобные — с ответами.
          </h2>
        </div>
        <div style={{ borderTop: '1px solid #1B1F1E' }}>
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid #1B1F1E' }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '22px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.005em' }}>{f.q}</span>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: '1px solid #222826',
                    display: 'grid', placeItems: 'center',
                    background: isOpen ? '#00E28A' : 'transparent',
                    color: isOpen ? '#00140B' : '#9CA3AF',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}>
                  <p style={{ paddingBottom: 24, color: '#9CA3AF', fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 680 }}>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { BacktestSection, ProductsSection, HowItWorks, FAQSection });
