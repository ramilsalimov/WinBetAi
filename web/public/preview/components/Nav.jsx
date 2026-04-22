// Sticky nav with transparent → solid transition on scroll
function Nav({ currentPath = '/' }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [lang, setLang] = React.useState('EN');
  const [langOpen, setLangOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    // Propagate language change to hero
    window.dispatchEvent(new CustomEvent('wb-lang', { detail: lang }));
  }, [lang]);

  const langs = ['EN', 'ID', 'PT', 'TH', 'VI'];

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      background: scrolled ? 'rgba(11,15,14,0.82)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'none',
      borderBottom: scrolled ? '1px solid #1B1F1E' : '1px solid transparent',
      transition: 'background 0.25s ease, border-color 0.25s ease',
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <Logo />
        <span className="chip chip-mint" style={{ marginLeft: 4 }}>
          <span className="pulse-dot" /> LIVE
        </span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22, flex: 1, justifyContent: 'center', minWidth: 0 }}>
        {[
          { label: 'Бэктест', href: '#backtest' },
          { label: 'Трек-рекорд', href: '#track' },
          { label: 'Модели', href: '#products' },
          { label: 'Тарифы', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ].map(l => (
          <a key={l.label} href={l.href} style={{
            fontSize: 13,
            color: '#9CA3AF',
            fontWeight: 500,
            transition: 'color 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#F5F5F5'}
          onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Lang */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(v => !v)}
            className="mono"
            style={{
              padding: '7px 10px',
              fontSize: 11,
              color: '#9CA3AF',
              border: '1px solid #222826',
              borderRadius: 6,
              background: scrolled ? '#151817' : 'transparent',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
            </svg>
            {lang}
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              background: '#151817',
              border: '1px solid #222826',
              borderRadius: 8,
              padding: 4,
              minWidth: 80,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}>
              {langs.map(l => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setLangOpen(false); }}
                  className="mono"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '7px 10px',
                    fontSize: 11,
                    color: lang === l ? '#00E28A' : '#9CA3AF',
                    background: lang === l ? '#1B1F1E' : 'transparent',
                    borderRadius: 4,
                    letterSpacing: '0.08em',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        <a href="dashboard.html" style={{
          fontSize: 13,
          color: '#F5F5F5',
          padding: '8px 12px',
          fontWeight: 500,
        }}>Войти</a>

        <a href="#hero" className="btn btn-primary">
          Начать
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>
    </nav>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #1B1F1E',
      padding: '56px 32px 32px',
      background: '#0B0F0E',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 48,
          marginBottom: 48,
        }}>
          <div>
            <Logo />
            <p className="muted" style={{ marginTop: 16, fontSize: 13, maxWidth: 320, lineHeight: 1.6 }}>
              Четыре open-source AI анализатора ставок с честным бэктестом на год реальных closing odds. Для тех, кто читает код, а не рекламу.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {['GitHub', 'Telegram', 'X'].map(s => (
                <a key={s} href="#" className="chip" style={{ textTransform: 'none', fontSize: 11, letterSpacing: 0 }}>{s}</a>
              ))}
            </div>
          </div>
          {[
            { h: 'Продукт', items: ['Бэктест', 'Модели', 'Как работает', 'История версий'] },
            { h: 'Компания', items: ['О нас', 'Блог', 'Партнёры', 'Контакты'] },
            { h: 'Юридическое', items: ['Условия', 'Приватность', 'Ответственная игра', 'Оговорки'] },
          ].map(col => (
            <div key={col.h}>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 14 }}>{col.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(i => (
                  <a key={i} href="#" style={{ fontSize: 13, color: '#9CA3AF' }}>{i}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid #1B1F1E',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11.5,
          color: '#6B7280',
        }}>
          <span className="mono">© 2026 WinBetAi · Not a bookmaker. Not financial advice.</span>
          <span style={{ display: 'inline-flex', gap: 12, alignItems: 'center' }}>
            <span className="chip" style={{ background: 'transparent', color: '#C9A24B', borderColor: 'rgba(201,162,75,0.3)' }}>18+ only</span>
            <span>Gambling can be addictive. Play responsibly.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer });
