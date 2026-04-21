// Dashboard pages (Overview, Analyzers, Account)

function DashOverview() {
  const activity = [
    { type: 'download', text: 'Downloaded ProphitBet v2.4.1', time: '12 minutes ago', icon: 'dl' },
    { type: 'pick', text: 'NBA XGB+NN issued 3 picks for today\'s slate', time: '2 hours ago', icon: 'bolt' },
    { type: 'update', text: 'Soccer Stacker re-trained on Week 34 data', time: 'Yesterday · 21:04', icon: 'cycle' },
    { type: 'verify', text: 'Account verified via 1win ID #81724', time: 'Apr 18 · 09:32', icon: 'check' },
    { type: 'login', text: 'Signed in from Jakarta, ID · 182.1.110.*', time: 'Apr 18 · 09:29', icon: 'lock' },
  ];

  return (
    <>
      <DashHeader
        title="Welcome back, Arif."
        subtitle="Your analyzers surfaced 14 new picks since you last checked in."
        right={<button className="btn btn-ghost btn-sm">View all picks <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>}
      />
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Status bar */}
        <Card pad={18} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(0,226,138,0.06), rgba(0,226,138,0.02) 40%, #0F1413)',
          border: '1px solid rgba(0,226,138,0.25)',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(0,226,138,0.1)',
              border: '1px solid rgba(0,226,138,0.3)',
              display: 'grid', placeItems: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#00E28A"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
                Account verified <span className="mono" style={{ color: '#00E28A', marginLeft: 6, fontSize: 12 }}>✓</span>
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                1win affiliate ID <span className="mono" style={{ color: '#F5F5F5' }}>81724</span> · verified Apr 18, 2026 · all four analyzers unlocked
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-sm">Download all (4)</button>
        </Card>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <StatCard
            label="Active models"
            value="4 / 4"
            sub="All unlocked"
            spark={[1, 1, 2, 2, 3, 3, 4, 4]}
            color="#00E28A"
          />
          <StatCard
            label="Total downloads"
            value="12"
            delta="+3 this week"
            spark={[2,3,3,5,6,7,9,10,11,12]}
          />
          <StatCard
            label="Picks received"
            value="187"
            delta="+14 today"
            spark={makeEquityCurve({ seed: 99, finalROI: 187, vol: 2 }).map(p=>p.y).filter((_,i)=>i%20===0)}
          />
          <StatCard
            label="Member since"
            value="Apr 18"
            sub="2026 · 3 days ago"
          />
        </div>

        {/* Two-col: activity + CLI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
          <Card pad={0}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #1B1F1E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Activity</div>
                <div className="muted mono" style={{ fontSize: 11, marginTop: 2, letterSpacing: '0.08em' }}>Last 5 events</div>
              </div>
              <button className="btn btn-ghost btn-sm">View all</button>
            </div>
            <div>
              {activity.map((a, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: 14,
                  padding: '14px 22px',
                  borderBottom: i < activity.length - 1 ? '1px solid #1B1F1E' : 'none',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: '#151817',
                    border: '1px solid #222826',
                    display: 'grid', placeItems: 'center',
                    color: a.type === 'pick' ? '#00E28A' : a.type === 'verify' ? '#00E28A' : '#9CA3AF',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {a.icon === 'dl' && <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>}
                      {a.icon === 'bolt' && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>}
                      {a.icon === 'cycle' && <><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></>}
                      {a.icon === 'check' && <><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></>}
                      {a.icon === 'lock' && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#F5F5F5' }}>{a.text}</div>
                    <div className="mono muted" style={{ fontSize: 11, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={0} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #1B1F1E' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Quick run</div>
              <div className="muted mono" style={{ fontSize: 11, marginTop: 2, letterSpacing: '0.08em' }}>Fetch today's picks</div>
            </div>
            <div style={{
              flex: 1,
              padding: 20,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              lineHeight: 1.7,
              background: '#0B0F0E',
              borderRadius: '0 0 12px 12px',
            }}>
              <div><span style={{ color: '#00E28A' }}>$</span> <span style={{ color: '#F5F5F5' }}>wb run nba-xgbnn --date today</span></div>
              <div style={{ color: '#6B7280' }}>&gt; loading model checkpoint...</div>
              <div style={{ color: '#6B7280' }}>&gt; fetching closing odds from 3 books</div>
              <div style={{ color: '#6B7280' }}>&gt; scoring 8 slate games...</div>
              <div style={{ color: '#00E28A', marginTop: 8 }}>✓ 3 picks with edge &gt; 3%</div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #1B1F1E' }}>
                <div style={{ color: '#F5F5F5' }}>BOS -4.5   <span className="pos">+5.2%</span></div>
                <div style={{ color: '#F5F5F5' }}>DEN ML    <span className="pos">+4.1%</span></div>
                <div style={{ color: '#F5F5F5' }}>Under 225.5 <span className="pos">+3.4%</span></div>
              </div>
              <div style={{ marginTop: 14, color: '#6B7280' }}>
                <span style={{ color: '#00E28A' }}>$</span> <span style={{ borderRight: '1.5px solid #00E28A', paddingRight: 1, animation: 'blink 1s infinite' }}>&nbsp;</span>
              </div>
              <style>{`@keyframes blink{50%{border-color:transparent}}`}</style>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function DashAnalyzers() {
  return (
    <>
      <DashHeader
        title="Analyzers"
        subtitle="Four models, all unlocked. Download, update, or grab the run command."
        right={
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/></svg>
              Check for updates
            </button>
            <button className="btn btn-primary btn-sm">Download all</button>
          </div>
        }
      />
      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {MODELS.map((m, i) => <AnalyzerCard key={m.id} model={m} index={i} />)}
      </div>
    </>
  );
}

function AnalyzerCard({ model, index }) {
  const color = ['#00E28A', '#C9A24B', '#4FA3FF', '#9b59b6'][index];
  const versions = ['v3.1.2', 'v2.4.8', 'v2.4.1', 'v1.9.0'];
  const sizes = ['48 MB', '112 MB', '64 MB', '22 MB'];
  return (
    <Card pad={22}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#151817',
            border: `1px solid ${color}33`,
            display: 'grid', placeItems: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, fontWeight: 700,
            color: color,
          }}>
            {model.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{model.name}</div>
            <div className="mono muted" style={{ fontSize: 11 }}>@{model.author}</div>
          </div>
        </div>
        <span className="chip chip-mint" style={{ fontSize: 9.5 }}>UNLOCKED</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, padding: '14px 0', borderTop: '1px solid #1B1F1E', borderBottom: '1px solid #1B1F1E' }}>
        <Metric2 label="Version" v={versions[index]} mono />
        <Metric2 label="Size" v={sizes[index]} mono />
        <Metric2 label="Winrate" v={`${model.winrate.toFixed(1)}%`} mono />
        <Metric2 label="ROI" v={`+${model.roi.toFixed(1)}%`} mono color="#00E28A" />
      </div>

      <div className="mono" style={{
        background: '#0B0F0E',
        border: '1px solid #1B1F1E',
        borderRadius: 8,
        padding: '9px 12px',
        fontSize: 11.5,
        color: '#9CA3AF',
        margin: '14px 0',
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{ color: '#00E28A' }}>$</span>&nbsp;wb run {model.id}
        <button style={{ marginLeft: 'auto', color: '#6B7280', fontSize: 10 }}>COPY</button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
          Download
        </button>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Docs</button>
      </div>

      <div className="mono muted" style={{ fontSize: 10.5, marginTop: 14, textAlign: 'right' }}>
        Last updated · Apr {14 + index}, 2026
      </div>
    </Card>
  );
}

function Metric2({ label, v, mono, color }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 9.5, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div className={mono ? 'mono' : ''} style={{ fontSize: 13, fontWeight: 600, color: color || '#F5F5F5' }}>{v}</div>
    </div>
  );
}

function DashAccount() {
  return (
    <>
      <DashHeader title="Account" subtitle="Your profile, affiliate binding, and session settings." />
      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 1000 }}>
        <Card style={{ gridColumn: '1 / -1' }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 14 }}>Profile</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #00E28A, #C9A24B)',
              display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: 22, color: '#00140B',
            }}>A</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Arif Pratama</div>
              <div className="mono muted" style={{ fontSize: 12 }}>arif@winbet.ai · Member #81724</div>
            </div>
          </div>
          <FieldRow label="Email" value="arif@winbet.ai" />
          <FieldRow label="Country" value="Indonesia (ID)" />
          <FieldRow label="Language" value="English" editable />
          <FieldRow label="Timezone" value="Asia/Jakarta (UTC+7)" />
        </Card>

        <Card>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 14 }}>
            Affiliate binding
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span className="chip chip-mint"><span className="pulse-dot" /> VERIFIED</span>
            <span className="mono muted" style={{ fontSize: 11 }}>Since Apr 18, 2026</span>
          </div>
          <FieldRow label="Bookmaker" value="1win" />
          <FieldRow label="Affiliate ID" value="81724" mono />
          <FieldRow label="Tracking link" value="winbet.ai/r/arif" mono />
        </Card>

        <Card>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 14 }}>Security</div>
          <FieldRow label="Password" value="•••••••••••" editable />
          <FieldRow label="2-factor auth" value="Disabled" editable warn />
          <FieldRow label="API key" value="wb_live_sk_•••7f2a" mono editable />
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #1B1F1E' }}>
            <button className="btn btn-ghost btn-sm" style={{ color: '#FF5D5D', borderColor: 'rgba(255,93,93,0.3)' }}>Sign out all sessions</button>
          </div>
        </Card>
      </div>
    </>
  );
}
function FieldRow({ label, value, editable, mono, warn }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderTop: '1px solid #1B1F1E',
    }}>
      <span className="muted" style={{ fontSize: 12.5 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <span className={mono ? 'mono' : ''} style={{ fontSize: 13, color: warn ? '#FF5D5D' : '#F5F5F5' }}>{value}</span>
        {editable && <button className="btn btn-ghost btn-sm" style={{ padding: '3px 8px', fontSize: 11 }}>Edit</button>}
      </span>
    </div>
  );
}

Object.assign(window, { DashOverview, DashAnalyzers, DashAccount });
