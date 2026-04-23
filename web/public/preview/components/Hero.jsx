// Hero — rotating AI Pick card, 3 layout variants

const HERO_COPY = {
  RU: { eye: 'AI + OPEN SOURCE', h1a: 'AI анализаторы ставок.', h1b: 'Реальный трек-рекорд.', sub: 'Четыре open-source модели. Бэктест на год реальных closing odds. Выбери ту, что подходит под твою игру.' },
  EN: { eye: 'AI + OPEN SOURCE', h1a: 'AI bet analyzers.', h1b: 'Real track record.', sub: 'Four open-source models. Backtested on a full year of real closing odds. Pick the one that fits your game.' },
  ID: { eye: 'AI + OPEN SOURCE', h1a: 'Analis taruhan AI.', h1b: 'Rekam jejak nyata.', sub: 'Empat model open-source. Di-backtest pada satu tahun penuh closing odds. Pilih yang cocok dengan gaya main Anda.' },
  PT: { eye: 'AI + OPEN SOURCE', h1a: 'Analisadores de aposta.', h1b: 'Histórico real.', sub: 'Quatro modelos open-source. Testados em um ano inteiro de closing odds reais. Escolha o que combina com seu jogo.' },
  TH: { eye: 'AI + OPEN SOURCE', h1a: 'ตัววิเคราะห์ AI.', h1b: 'ผลงานจริง.', sub: 'สี่โมเดลโอเพนซอร์ส ทดสอบย้อนหลังกับอัตราต่อรองปิดตลอดทั้งปี เลือกโมเดลที่เหมาะกับสไตล์ของคุณ' },
  VI: { eye: 'AI + OPEN SOURCE', h1a: 'Phân tích cược AI.', h1b: 'Thành tích thực.', sub: 'Bốn mô hình mã nguồn mở. Kiểm tra lại trên một năm closing odds thực. Chọn mô hình phù hợp với bạn.' },
};

function useLivePicks() {
  const [picks, setPicks] = React.useState(PICKS);
  React.useEffect(() => {
    fetch('/picks.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || !data.products) return;
        const out = [];
        for (const prod of Object.values(data.products)) {
          for (const p of prod.picks || []) {
            out.push({
              league: `${prod.name} · ${p.league_name || ''}`.trim(),
              kickoff: (p.date || '').slice(0, 16).replace('T', ' ') + (p.date?.includes('T') ? ' UTC' : ''),
              home: { name: p.home, tag: (p.home || '').slice(0, 3).toUpperCase(), elo: null, form: '' },
              away: { name: p.away, tag: (p.away || '').slice(0, 3).toUpperCase(), elo: null, form: '' },
              prediction: p.pick_ru || p.pick,
              odds: p.odds,
              confidence: Math.round(p.confidence || p.model_prob * 100),
              model: prod.name,
              edge: `+${((p.edge || 0) * 100).toFixed(1)}%`,
              live: true,
            });
          }
        }
        if (out.length > 0) setPicks(out);
      })
      .catch(() => {});
  }, []);
  return picks;
}

function usePickRotator(count) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setI(v => (v + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);
  return [i, setI];
}

// ---------- AI Pick card (shared) ----------
function PickCard({ pick, pickIndex }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #151817 0%, #0F1413 100%)',
      border: '1px solid #222826',
      borderRadius: 14,
      padding: 22,
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,226,138,0.04)',
    }}>
      {/* corner glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(0,226,138,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div className="eyebrow" style={{ color: '#00E28A', marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="pulse-dot" /> AI PICK OF THE DAY
          </div>
          <div className="mono muted" style={{ fontSize: 11 }}>{pick.league} · {pick.kickoff}</div>
        </div>
        <div className="chip chip-mint mono" style={{ fontSize: 10 }}>
          {pick.model}
        </div>
      </div>

      {/* teams */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #1B1F1E', borderBottom: '1px solid #1B1F1E' }}>
        <TeamBlock team={pick.home} side="home" />
        <div style={{ textAlign: 'center', padding: '0 12px' }}>
          <div className="mono dim" style={{ fontSize: 10, letterSpacing: '0.12em' }}>VS</div>
        </div>
        <TeamBlock team={pick.away} side="away" />
      </div>

      {/* prediction */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center', marginTop: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Model prediction</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>{pick.prediction}</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 13 }}>
              <span className="muted">odds </span>
              <span style={{ color: '#F5F5F5', fontWeight: 700 }}>{pick.odds.toFixed(2)}</span>
            </span>
            <span className="mono pos" style={{ fontSize: 13, fontWeight: 700 }}>
              edge {pick.edge}
            </span>
          </div>
        </div>
        <ConfidenceGauge key={`gauge-${pickIndex}`} value={pick.confidence} size={106} />
      </div>

      {/* footer sparkline + CLV */}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #1B1F1E', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'center' }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            30d ROI
          </div>
          <div className="mono pos" style={{ fontSize: 16, fontWeight: 700 }}>+6.8%</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9.5, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            CLV
          </div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: '#C9A24B' }}>+2.4%</div>
        </div>
        <Sparkline
          data={[0, 1.2, 0.8, 2.1, 1.5, 2.8, 2.3, 3.6, 3.1, 4.4, 5.2, 4.7, 5.9, 5.4, 6.2, 6.8]}
          width={110} height={36} strokeWidth={1.8}
        />
      </div>
    </div>
  );
}

function TeamBlock({ team, side }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: side === 'away' ? 'flex-end' : 'flex-start', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: side === 'away' ? 'row-reverse' : 'row' }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: 8,
          background: '#1B1F1E',
          border: '1px solid #222826',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          fontWeight: 700,
          color: '#9CA3AF',
          letterSpacing: '0.05em',
        }}>{team.tag}</div>
        <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{team.name}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 10.5, flexDirection: side === 'away' ? 'row-reverse' : 'row' }}>
        <span className="mono muted">ELO {team.elo}</span>
        <span className="mono" style={{ letterSpacing: '0.05em' }}>
          {team.form.split(' ').map((r, i) => (
            <span key={i} style={{
              color: r === 'W' ? '#00E28A' : r === 'L' ? '#FF5D5D' : '#9CA3AF',
              marginRight: 2,
            }}>{r}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

// ---------- Hero variants ----------
function Hero({ variant = 'pick' }) {
  const livePicks = useLivePicks();
  const [pickIndex, setPickIndex] = usePickRotator(livePicks.length);
  const [lang, setLang] = React.useState('RU');

  React.useEffect(() => {
    const h = (e) => setLang(e.detail);
    window.addEventListener('wb-lang', h);
    return () => window.removeEventListener('wb-lang', h);
  }, []);

  const copy = HERO_COPY[lang] || HERO_COPY.EN;
  const pick = livePicks[Math.min(pickIndex, livePicks.length - 1)] || PICKS[0];

  return (
    <section id="hero" style={{
      position: 'relative',
      paddingTop: 120,
      paddingBottom: 80,
      overflow: 'hidden',
    }}>
      {/* grid bg */}
      <div className="grid-bg grid-bg-fade" style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.5,
        pointerEvents: 'none',
      }} />
      {/* mint wash */}
      <div style={{
        position: 'absolute',
        top: '-10%', left: '30%',
        width: '70%', height: '70%',
        background: 'radial-gradient(ellipse at center, rgba(0,226,138,0.08), transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        <HeroLayout variant={variant} copy={copy} lang={lang} pick={pick} pickIndex={pickIndex} setPickIndex={setPickIndex} picksCount={livePicks.length} />
      </div>

      {/* Ticker row */}
      <div style={{ maxWidth: 1280, margin: '80px auto 0', padding: '0 32px', position: 'relative' }}>
        <TickerRow />
      </div>
    </section>
  );
}

function HeroLayout({ variant, copy, lang, pick, pickIndex, setPickIndex, picksCount }) {
  if (variant === 'pick') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 72, alignItems: 'center' }}>
        <HeroText copy={copy} lang={lang} />
        <div style={{ position: 'relative' }}>
          <PickCard key={pickIndex} pick={pick} pickIndex={pickIndex} />
          <PickDots count={picksCount} active={pickIndex} onSelect={setPickIndex} />
        </div>
      </div>
    );
  }
  if (variant === 'chart') {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5) 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5) 70%, transparent)',
          opacity: 0.6,
        }}>
          <MiniEquityBackdrop />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820 }}>
          <HeroText copy={copy} lang={lang} />
        </div>
      </div>
    );
  }
  // tickers
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 72, alignItems: 'center' }}>
      <HeroText copy={copy} lang={lang} />
      <BigTickerGrid />
    </div>
  );
}

function HeroText({ copy, lang }) {
  return (
    <div>
      <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
        <span style={{ width: 24, height: 1, background: '#00E28A' }} />
        {copy.eye}
      </div>
      <h1 key={lang} style={{
        fontSize: 'clamp(44px, 5.4vw, 76px)',
        lineHeight: 1.02,
        letterSpacing: '-0.035em',
        fontWeight: 700,
        margin: 0,
        textWrap: 'balance',
      }}>
        {copy.h1a}<br />
        <span style={{ color: '#9CA3AF' }}>{copy.h1b}</span>
      </h1>
      <p style={{
        marginTop: 26,
        fontSize: 16.5,
        color: '#9CA3AF',
        maxWidth: 540,
        lineHeight: 1.55,
      }}>
        {copy.sub}
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 34, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="#backtest" className="btn btn-primary" style={{ padding: '12px 20px', fontSize: 14 }}>
          See backtest
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
        <a href="#how" className="btn btn-ghost" style={{ padding: '12px 20px', fontSize: 14 }}>
          How it works
        </a>
        <span className="mono muted" style={{ fontSize: 11.5, letterSpacing: '0.08em', marginLeft: 4, whiteSpace: 'nowrap' }}>
          <span style={{ color: '#00E28A' }}>●</span> 2,341 bettors joined this week
        </span>
      </div>
    </div>
  );
}

function PickDots({ count, active, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{
            width: active === i ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: active === i ? '#00E28A' : '#2C3330',
            transition: 'all 0.25s',
          }}
        />
      ))}
    </div>
  );
}

function TickerRow() {
  const stats = [
    { label: 'Open-source models', value: 4, suffix: '' },
    { label: 'Days of backtest', value: 365, suffix: '' },
    { label: 'Avg ROI across models', value: 15.1, suffix: '%', decimals: 1, prefix: '+', color: '#00E28A' },
    { label: 'Code transparency', value: 100, suffix: '%', color: '#C9A24B' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      border: '1px solid #1B1F1E',
      borderRadius: 12,
      background: 'rgba(21,24,23,0.4)',
      backdropFilter: 'blur(8px)',
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '22px 26px',
          borderRight: i < 3 ? '1px solid #1B1F1E' : 'none',
        }}>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            color: s.color || '#F5F5F5',
            lineHeight: 1,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '-0.02em',
          }}>
            <AnimatedNumber value={s.value} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix} />
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function BigTickerGrid() {
  const items = [
    { label: 'Models', v: 4, c: '#F5F5F5' },
    { label: 'Backtest days', v: 365, c: '#F5F5F5' },
    { label: 'Avg ROI', v: 15.1, suf: '%', pre: '+', c: '#00E28A', dec: 1 },
    { label: 'Open-source', v: 100, suf: '%', c: '#C9A24B' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 1,
      background: '#1B1F1E',
      border: '1px solid #222826',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: '32px 28px', background: '#0F1413' }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 14 }}>{it.label}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 48, fontWeight: 700, color: it.c, letterSpacing: '-0.03em', lineHeight: 1 }}>
            <AnimatedNumber value={it.v} prefix={it.pre || ''} suffix={it.suf || ''} decimals={it.dec || 0} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniEquityBackdrop() {
  const series = React.useMemo(() => [
    { name: 'NBA XGB+NN', color: 'rgba(0,226,138,0.4)', data: makeEquityCurve({ seed: 7, finalROI: 18.2, vol: 1.2 }) },
    { name: 'Soccer Stacker', color: 'rgba(201,162,75,0.3)', data: makeEquityCurve({ seed: 13, finalROI: 12.7, vol: 0.9 }) },
    { name: 'ProphitBet', color: 'rgba(245,245,245,0.18)', data: makeEquityCurve({ seed: 21, finalROI: 15.4, vol: 1.0 }) },
    { name: 'EPL LogReg', color: 'rgba(155,89,182,0.3)', data: makeEquityCurve({ seed: 31, finalROI: 14.1, vol: 0.85 }) },
  ], []);
  return (
    <div style={{ width: '100%', height: 520 }}>
      <EquityChart series={series} height={520} />
    </div>
  );
}

Object.assign(window, { Hero, PickCard, TickerRow });
