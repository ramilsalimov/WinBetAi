// Tweaks panel — hero layout variant switcher

function TweaksPanel({ variant, setVariant }) {
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setOn(true);
      if (e.data?.type === '__deactivate_edit_mode') setOn(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const set = (v) => {
    setVariant(v);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { heroVariant: v } }, '*');
  };

  if (!on) return null;

  const opts = [
    { v: 'pick', label: 'Pick card', desc: 'AI Pick of the Day on the right' },
    { v: 'chart', label: 'Chart bg', desc: 'Equity curve behind text' },
    { v: 'tickers', label: 'Ticker grid', desc: 'Big numbers on the right' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 280,
      background: '#0F1413',
      border: '1px solid #222826',
      borderRadius: 12,
      padding: 16,
      zIndex: 200,
      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00E28A' }}>Tweaks</div>
        <span className="mono" style={{ fontSize: 10, color: '#6B7280' }}>HERO LAYOUT</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {opts.map(o => (
          <button key={o.v} onClick={() => set(o.v)} style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${variant === o.v ? 'rgba(0,226,138,0.4)' : '#222826'}`,
            background: variant === o.v ? 'rgba(0,226,138,0.06)' : '#151817',
            color: '#F5F5F5',
            gap: 2,
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: variant === o.v ? '#00E28A' : '#F5F5F5' }}>{o.label}</span>
            <span style={{ fontSize: 11, color: '#6B7280' }}>{o.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TweaksPanel });
