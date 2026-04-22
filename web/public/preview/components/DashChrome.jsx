// Dashboard sidebar + shared dashboard chrome

function DashSidebar({ active, onNav }) {
  const items = [
    { id: 'overview', label: 'Главная', icon: 'home' },
    { id: 'analyzers', label: 'Анализаторы', icon: 'cpu' },
    { id: 'downloads', label: 'Загрузки', icon: 'download' },
    { id: 'account', label: 'Аккаунт', icon: 'user' },
  ];

  const icon = (k) => {
    const p = {
      home: <><path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" /></>,
      cpu: <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
      download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>,
      user: <><circle cx="12" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /></>,
    };
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {p[k]}
      </svg>
    );
  };

  return (
    <aside style={{
      width: 260,
      background: '#0B0F0E',
      borderRight: '1px solid #1B1F1E',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      <div style={{ padding: '6px 10px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="Landing.html"><Logo /></a>
        <span className="chip chip-mint" style={{ fontSize: 9 }}>BETA</span>
      </div>

      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', padding: '8px 10px 6px' }}>
        Workspace
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(i => (
          <button key={i.id} onClick={() => onNav(i.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px',
            borderRadius: 7,
            textAlign: 'left',
            color: active === i.id ? '#F5F5F5' : '#9CA3AF',
            background: active === i.id ? '#151817' : 'transparent',
            border: active === i.id ? '1px solid #222826' : '1px solid transparent',
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 0.12s',
          }}>
            <span style={{ color: active === i.id ? '#00E28A' : '#6B7280' }}>{icon(i.icon)}</span>
            {i.label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Verification banner */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(0,226,138,0.06), rgba(0,226,138,0.02))',
        border: '1px solid rgba(0,226,138,0.2)',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#00E28A"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: '#00E28A' }}>VERIFIED</span>
        </div>
        <div style={{ fontSize: 12, color: '#F5F5F5', lineHeight: 1.45 }}>
          All four analyzers unlocked.
        </div>
      </div>

      {/* user */}
      <div style={{
        padding: 10,
        borderRadius: 10,
        background: '#0F1413',
        border: '1px solid #1B1F1E',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #00E28A, #C9A24B)',
          display: 'grid', placeItems: 'center',
          color: '#00140B',
          fontWeight: 700,
          fontSize: 13,
        }}>A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>arif@winbet.ai</div>
          <div className="mono muted" style={{ fontSize: 10 }}>участник #81724</div>
        </div>
        <button title="Выйти" style={{ color: '#6B7280' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </div>
    </aside>
  );
}

function DashHeader({ title, subtitle, right }) {
  return (
    <div style={{
      padding: '26px 32px 22px',
      borderBottom: '1px solid #1B1F1E',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 24,
      flexWrap: 'wrap',
    }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{title}</h1>
        {subtitle && <p className="muted" style={{ margin: '6px 0 0', fontSize: 13.5 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function Card({ children, style, pad = 22, ...rest }) {
  return (
    <div {...rest} style={{
      background: '#0F1413',
      border: '1px solid #1B1F1E',
      borderRadius: 12,
      padding: pad,
      ...style,
    }}>{children}</div>
  );
}

function StatCard({ label, value, delta, sub, spark, color }) {
  return (
    <Card>
      <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 12 }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 700, color: color || '#F5F5F5', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {value}
          </div>
          {sub && <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>{sub}</div>}
          {delta && (
            <div className={delta.startsWith('-') ? 'mono neg' : 'mono pos'} style={{ fontSize: 11.5, marginTop: 8, fontWeight: 600 }}>
              {delta}
            </div>
          )}
        </div>
        {spark && <Sparkline data={spark} width={110} height={40} color={color || '#00E28A'} strokeWidth={1.6} />}
      </div>
    </Card>
  );
}

Object.assign(window, { DashSidebar, DashHeader, Card, StatCard });
