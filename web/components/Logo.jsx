// Logo mark — geometric square outline + mint dot
function Logo({ size = 22, showWord = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" stroke="#F5F5F5" strokeWidth="1.8" />
        <circle cx="21.5" cy="2.5" r="2.8" fill="#00E28A" />
      </svg>
      {showWord && (
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-0.01em',
          color: '#F5F5F5',
        }}>
          WinBet<span style={{ color: '#00E28A' }}>Ai</span>
        </span>
      )}
    </div>
  );
}

Object.assign(window, { Logo });
