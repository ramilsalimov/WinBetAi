// Shared primitives for WinBetAi

// ---------- Animated counter ----------
function AnimatedNumber({ value, duration = 1400, decimals = 0, prefix = '', suffix = '' }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let start = null;
    const from = 0;
    const to = value;
    let raf;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const formatted = decimals === 0
    ? Math.round(display).toLocaleString()
    : display.toFixed(decimals);
  return <span className="mono">{prefix}{formatted}{suffix}</span>;
}

// ---------- Sparkline ----------
function Sparkline({ data, width = 96, height = 28, color = '#00E28A', fill = true, strokeWidth = 1.5 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  const area = `${d} L${width},${height} L0,${height} Z`;
  const id = React.useMemo(() => 'sp' + Math.random().toString(36).slice(2, 8), []);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id})`} />
        </>
      )}
      <path d={d} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- Confidence gauge ----------
function ConfidenceGauge({ value = 72, size = 120 }) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / 1100);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const circ = Math.PI * r;
  const dash = (v / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size / 2 + 18 }}>
      <svg width={size} height={size / 2 + 18} viewBox={`0 0 ${size} ${size / 2 + 18}`}>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="#222826"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="#00E28A"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 0,
      }}>
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: '#F5F5F5', lineHeight: 1 }}>
          {v.toFixed(0)}<span style={{ fontSize: 14, color: '#9CA3AF' }}>%</span>
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
          confidence
        </div>
      </div>
    </div>
  );
}

// ---------- Tab switcher ----------
function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex',
      padding: 3,
      background: '#151817',
      border: '1px solid #222826',
      borderRadius: 8,
      gap: 2,
    }}>
      {tabs.map(t => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 500,
            color: value === t.value ? '#F5F5F5' : '#9CA3AF',
            background: value === t.value ? '#1B1F1E' : 'transparent',
            border: value === t.value ? '1px solid #2C3330' : '1px solid transparent',
            transition: 'all 0.15s',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Equity curve chart ----------
function EquityChart({ series, height = 320, animateKey = 0 }) {
  // series: [{ name, color, data:[{x,y}] }]
  const width = 880;
  const pad = { l: 48, r: 16, t: 16, b: 32 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  const allY = series.flatMap(s => s.data.map(d => d.y));
  const minY = Math.min(...allY, 0);
  const maxY = Math.max(...allY);
  const yRange = maxY - minY || 1;
  const xMax = series[0].data.length - 1;

  const xFor = i => pad.l + (i / xMax) * w;
  const yFor = y => pad.t + h - ((y - minY) / yRange) * h;

  const yTicks = 5;
  const yStep = yRange / (yTicks - 1);

  const xLabels = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];

  const [hover, setHover] = React.useState(null);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        {/* y grid lines */}
        {Array.from({ length: yTicks }).map((_, i) => {
          const yVal = minY + i * yStep;
          const y = yFor(yVal);
          return (
            <g key={i}>
              <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="#1B1F1E" strokeWidth="1" />
              <text x={pad.l - 8} y={y + 3.5} fill="#6B7280" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                {yVal >= 0 ? '+' : ''}{yVal.toFixed(0)}%
              </text>
            </g>
          );
        })}
        {/* zero line */}
        <line
          x1={pad.l} x2={width - pad.r}
          y1={yFor(0)} y2={yFor(0)}
          stroke="#2C3330" strokeWidth="1" strokeDasharray="2 3"
        />
        {/* x labels */}
        {xLabels.map((lbl, i) => {
          const x = pad.l + (i / (xLabels.length - 1)) * w;
          return (
            <text key={i} x={x} y={height - 10} fill="#6B7280" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              {lbl}
            </text>
          );
        })}
        {/* series lines */}
        {series.map((s, si) => {
          const d = s.data.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i).toFixed(2)},${yFor(p.y).toFixed(2)}`).join(' ');
          const pathLength = 3000;
          return (
            <path
              key={`${s.name}-${animateKey}`}
              d={d}
              stroke={s.color}
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
                animation: `draw 1400ms ${si * 120}ms cubic-bezier(0.33,1,0.68,1) forwards`,
              }}
            />
          );
        })}
        {/* hover vertical */}
        {hover !== null && (
          <line
            x1={xFor(hover)} x2={xFor(hover)}
            y1={pad.t} y2={pad.t + h}
            stroke="#2C3330" strokeWidth="1"
          />
        )}
        {/* hover dots */}
        {hover !== null && series.map(s => (
          <circle
            key={s.name}
            cx={xFor(hover)}
            cy={yFor(s.data[hover].y)}
            r="3"
            fill={s.color}
            stroke="#0B0F0E"
            strokeWidth="1.5"
          />
        ))}
        {/* overlay */}
        <rect
          x={pad.l} y={pad.t} width={w} height={h}
          fill="transparent"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const i = Math.round((relX / rect.width) * xMax);
            setHover(Math.max(0, Math.min(xMax, i)));
          }}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      {/* Tooltip */}
      {hover !== null && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 16,
          background: '#0F1413',
          border: '1px solid #222826',
          borderRadius: 8,
          padding: '10px 12px',
          minWidth: 180,
          fontSize: 11.5,
          pointerEvents: 'none',
        }}>
          <div className="mono" style={{ color: '#9CA3AF', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Day {hover + 1} / 365
          </div>
          {series.map(s => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, padding: '2px 0' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 2, background: s.color, display: 'inline-block' }} />
                <span style={{ color: '#F5F5F5' }}>{s.name}</span>
              </span>
              <span className="mono" style={{ color: s.data[hover].y >= 0 ? '#00E28A' : '#FF5D5D' }}>
                {s.data[hover].y >= 0 ? '+' : ''}{s.data[hover].y.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}

// ---------- Seeded equity curve generator ----------
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function makeEquityCurve({ seed, days = 365, finalROI, volatility = 1 }) {
  const rng = mulberry32(seed);
  const out = [];
  // we want last point ~ finalROI, with noisy walk
  const drift = finalROI / days;
  let v = 0;
  for (let i = 0; i < days; i++) {
    const noise = (rng() - 0.5) * 2 * volatility;
    v += drift + noise * 0.6;
    // occasional drawdowns
    if (rng() > 0.97) v -= rng() * 2.5;
    out.push({ x: i, y: v });
  }
  // anchor end to target
  const last = out[out.length - 1].y;
  const adj = finalROI - last;
  for (let i = 0; i < days; i++) {
    out[i].y += adj * (i / (days - 1));
  }
  return out;
}

Object.assign(window, {
  AnimatedNumber,
  Sparkline,
  ConfidenceGauge,
  Tabs,
  EquityChart,
  makeEquityCurve,
});
