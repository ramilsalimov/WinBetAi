// Admin panel — users table + detail

const USERS = [
  { id: 81724, email: 'arif@winbet.ai',       aff: '81724', status: 'verified', country: 'ID', registered: 'Apr 18, 2026 · 09:32', last: '12 min ago', downloads: 12 },
  { id: 81723, email: 'suthep.k@gmail.com',   aff: '81723', status: 'verified', country: 'TH', registered: 'Apr 18, 2026 · 06:11', last: '1 hr ago', downloads: 8 },
  { id: 81722, email: 'chukwuebuka@proton.me', aff: '81722', status: 'pending',  country: 'NG', registered: 'Apr 18, 2026 · 04:47', last: '4 hr ago', downloads: 0 },
  { id: 81721, email: 'luana.s@outlook.com',   aff: '81721', status: 'verified', country: 'BR', registered: 'Apr 17, 2026 · 22:10', last: 'Yesterday', downloads: 4 },
  { id: 81720, email: 'amir.f@yahoo.com',      aff: '—',     status: 'rejected', country: 'MY', registered: 'Apr 17, 2026 · 18:55', last: 'Yesterday', downloads: 0 },
  { id: 81719, email: 'dinh.n@gmail.com',      aff: '81719', status: 'pending',  country: 'VN', registered: 'Apr 17, 2026 · 14:03', last: '2 days ago', downloads: 0 },
  { id: 81718, email: 'mwangi.j@gmail.com',    aff: '81718', status: 'verified', country: 'KE', registered: 'Apr 17, 2026 · 11:29', last: '2 days ago', downloads: 6 },
  { id: 81717, email: 'rafael.d@gmail.com',    aff: '81717', status: 'verified', country: 'PH', registered: 'Apr 17, 2026 · 08:14', last: '3 days ago', downloads: 11 },
  { id: 81716, email: 'bambang@mail.id',       aff: '—',     status: 'pending',  country: 'ID', registered: 'Apr 16, 2026 · 23:41', last: '3 days ago', downloads: 0 },
  { id: 81715, email: 'carlos.p@hotmail.com',  aff: '81715', status: 'verified', country: 'BR', registered: 'Apr 16, 2026 · 19:20', last: '3 days ago', downloads: 9 },
];

const STATUS_STYLES = {
  verified: { color: '#00E28A', bg: 'rgba(0,226,138,0.08)', bd: 'rgba(0,226,138,0.25)' },
  pending: { color: '#C9A24B', bg: 'rgba(201,162,75,0.08)', bd: 'rgba(201,162,75,0.25)' },
  rejected: { color: '#FF5D5D', bg: 'rgba(255,93,93,0.08)', bd: 'rgba(255,93,93,0.25)' },
};

function StatusPill({ s }) {
  const st = STATUS_STYLES[s];
  return (
    <span className="mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px',
      borderRadius: 4,
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: st.color,
      background: st.bg,
      border: `1px solid ${st.bd}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.color }} />
      {s}
    </span>
  );
}

function AdminApp() {
  const [filter, setFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState(null);

  const filtered = USERS.filter(u => {
    if (filter !== 'all' && u.status !== filter) return false;
    if (query && !u.email.toLowerCase().includes(query.toLowerCase()) && !String(u.id).includes(query)) return false;
    return true;
  });

  const counts = {
    all: USERS.length,
    pending: USERS.filter(u => u.status === 'pending').length,
    verified: USERS.filter(u => u.status === 'verified').length,
    rejected: USERS.filter(u => u.status === 'rejected').length,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F0E' }}>
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          padding: '10px 32px',
          borderBottom: '1px solid #1B1F1E',
          display: 'flex', gap: 16, alignItems: 'center',
          fontSize: 12, color: '#6B7280',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em',
        }}>
          <span>/ admin</span>
          <span>/</span>
          <span style={{ color: '#F5F5F5' }}>users</span>
          {selected && <><span>/</span><span style={{ color: '#00E28A' }}>#{selected.id}</span></>}
          <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 14 }}>
            <a href="Landing.html" style={{ color: '#9CA3AF' }}>← Site</a>
            <a href="Dashboard.html" style={{ color: '#9CA3AF' }}>Dashboard</a>
          </span>
        </div>

        <DashHeader
          title="Users"
          subtitle={`${counts.all} total · ${counts.pending} pending verification · ${counts.verified} verified`}
          right={
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                position: 'relative',
                display: 'flex', alignItems: 'center',
                border: '1px solid #1B1F1E',
                background: '#0F1413',
                borderRadius: 8,
                padding: '0 10px',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search email or ID"
                  style={{
                    background: 'transparent', border: 0, outline: 'none',
                    padding: '8px 10px', color: '#F5F5F5',
                    fontFamily: 'Inter, sans-serif', fontSize: 12.5, width: 200,
                  }}
                />
              </div>
              <button className="btn btn-ghost btn-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
                Export CSV
              </button>
            </div>
          }
        />

        <div style={{ padding: 32 }}>
          {/* filter tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, alignItems: 'center' }}>
            {[
              { v: 'all', label: 'All' },
              { v: 'pending', label: 'Pending' },
              { v: 'verified', label: 'Verified' },
              { v: 'rejected', label: 'Rejected' },
            ].map(t => (
              <button key={t.v} onClick={() => setFilter(t.v)} style={{
                padding: '7px 12px',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 500,
                border: filter === t.v ? '1px solid #2C3330' : '1px solid transparent',
                background: filter === t.v ? '#151817' : 'transparent',
                color: filter === t.v ? '#F5F5F5' : '#9CA3AF',
                display: 'inline-flex', gap: 8, alignItems: 'center',
              }}>
                {t.label}
                <span className="mono" style={{
                  fontSize: 10,
                  color: filter === t.v ? '#00E28A' : '#6B7280',
                  padding: '1px 6px',
                  background: '#0B0F0E',
                  borderRadius: 3,
                }}>{counts[t.v]}</span>
              </button>
            ))}
          </div>

          <Card pad={0} style={{ overflowX: 'auto' }}>
            {/* table head */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '72px minmax(220px, 2fr) 90px 60px 150px 110px 90px 80px',
              gap: 16,
              padding: '12px 22px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#6B7280',
              borderBottom: '1px solid #1B1F1E',
              alignItems: 'center',
              minWidth: 980,
            }}>
              <span>ID</span>
              <span>Email</span>
              <span>Affiliate</span>
              <span>Country</span>
              <span>Registered</span>
              <span>Status</span>
              <span>Downloads</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </div>
            {filtered.map((u, i) => (
              <div key={u.id} onClick={() => setSelected(u)} style={{
                display: 'grid',
                gridTemplateColumns: '72px minmax(220px, 2fr) 90px 60px 150px 110px 90px 80px',
                gap: 16,
                padding: '14px 22px',
                fontSize: 13,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid #1B1F1E' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
                minWidth: 980,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#151817'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="mono muted">#{u.id}</span>
                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                <span className="mono" style={{ color: u.aff === '—' ? '#6B7280' : '#F5F5F5' }}>{u.aff}</span>
                <span className="mono muted">{u.country}</span>
                <span className="mono muted" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>{u.registered}</span>
                <span><StatusPill s={u.status} /></span>
                <span className="mono">{u.downloads}</span>
                <span style={{ textAlign: 'right' }}>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>View</button>
                </span>
              </div>
            ))}
            {/* pagination */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 22px',
              borderTop: '1px solid #1B1F1E',
              fontSize: 12, color: '#6B7280',
              minWidth: 980,
            }}>
              <span className="mono">Showing {filtered.length} of {USERS.length}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>← Prev</button>
                <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>Next →</button>
              </div>
            </div>
          </Card>
        </div>

        {selected && <UserDetail user={selected} onClose={() => setSelected(null)} />}
      </main>
    </div>
  );
}

function AdminSidebar() {
  const items = [
    { id: 'users', label: 'Users', icon: 'users', active: true, count: USERS.length },
    { id: 'verifications', label: 'Verifications', icon: 'check', count: 3 },
    { id: 'models', label: 'Models', icon: 'cpu', count: 4 },
    { id: 'referrals', label: 'Referrals', icon: 'link' },
    { id: 'logs', label: 'Logs', icon: 'logs' },
    { id: 'settings', label: 'Settings', icon: 'gear' },
  ];
  const ip = (k) => {
    const p = {
      users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
      check: <><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></>,
      cpu: <><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/></>,
      link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
      logs: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 14h6M9 18h6M9 10h2"/></>,
      gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    };
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[k]}</svg>;
  };
  return (
    <aside style={{
      width: 240, background: '#0B0F0E', borderRight: '1px solid #1B1F1E',
      padding: '20px 12px', display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{ padding: '6px 10px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="Landing.html"><Logo /></a>
        <span className="chip chip-gold" style={{ fontSize: 9 }}>ADMIN</span>
      </div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', padding: '8px 10px 6px' }}>Ops</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(i => (
          <button key={i.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 7, textAlign: 'left',
            color: i.active ? '#F5F5F5' : '#9CA3AF',
            background: i.active ? '#151817' : 'transparent',
            border: i.active ? '1px solid #222826' : '1px solid transparent',
            fontSize: 13, fontWeight: 500,
          }}>
            <span style={{ color: i.active ? '#C9A24B' : '#6B7280' }}>{ip(i.icon)}</span>
            {i.label}
            {i.count !== undefined && (
              <span className="mono" style={{ marginLeft: 'auto', fontSize: 10, color: '#6B7280', padding: '1px 6px', background: '#0F1413', borderRadius: 3 }}>{i.count}</span>
            )}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{ padding: 12, background: '#0F1413', borderRadius: 10, border: '1px solid #1B1F1E' }}>
        <div className="mono" style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>System</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse-dot" />
          <span className="mono" style={{ fontSize: 11.5, color: '#00E28A' }}>All systems operational</span>
        </div>
      </div>
    </aside>
  );
}

function UserDetail({ user, onClose }) {
  const log = [
    { t: '09:32:04', ev: 'Referral confirmed · 1win affiliate #' + user.aff, c: '#00E28A' },
    { t: '09:31:47', ev: 'Manual approval by admin@winbet.ai', c: '#F5F5F5' },
    { t: '09:28:13', ev: 'Affiliate ID submitted', c: '#9CA3AF' },
    { t: '09:27:55', ev: 'Email verified (link clicked)', c: '#9CA3AF' },
    { t: '09:25:01', ev: 'Account created from IP 182.1.110.*', c: '#9CA3AF' },
  ];
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)', zIndex: 300,
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 540, background: '#0B0F0E',
        borderLeft: '1px solid #1B1F1E',
        overflowY: 'auto',
        animation: 'slide-in 0.25s ease',
      }}>
        <div style={{
          padding: '22px 26px', borderBottom: '1px solid #1B1F1E',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', color: '#6B7280', marginBottom: 4 }}>USER · #{user.id}</div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{user.email}</div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            border: '1px solid #222826', color: '#9CA3AF',
            display: 'grid', placeItems: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatusPill s={user.status} />
            <span className="chip">{user.country}</span>
            <span className="chip mono">{user.downloads} downloads</span>
          </div>

          <Card pad={18}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 12 }}>Profile</div>
            <FieldRow label="User ID" value={`#${user.id}`} mono />
            <FieldRow label="Email" value={user.email} />
            <FieldRow label="Affiliate ID" value={user.aff} mono />
            <FieldRow label="Registered" value={user.registered} mono />
            <FieldRow label="Last active" value={user.last} />
          </Card>

          <Card pad={18}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 12 }}>Verification log</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {log.map((l, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 12, fontSize: 12, paddingLeft: 8, borderLeft: '2px solid #1B1F1E' }}>
                  <span className="mono muted">{l.t}</span>
                  <span style={{ color: l.c }}>{l.ev}</span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', gap: 10 }}>
            {user.status === 'pending' && (
              <>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                  Approve
                </button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', color: '#FF5D5D', borderColor: 'rgba(255,93,93,0.3)' }}>
                  Reject
                </button>
              </>
            )}
            {user.status === 'verified' && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Send message</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', color: '#FF5D5D', borderColor: 'rgba(255,93,93,0.3)' }}>Revoke</button>
              </>
            )}
            {user.status === 'rejected' && (
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Re-open case</button>
            )}
          </div>
        </div>
        <style>{`@keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
      </div>
    </div>
  );
}

Object.assign(window, { AdminApp });
