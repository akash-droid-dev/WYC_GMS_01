import { Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminDashboard() {
  const delegations = useTMSStore((s) => s.delegations);
  const athletes = useTMSStore((s) => s.athletes);
  const entries = useTMSStore((s) => s.entries);
  const protests = useTMSStore((s) => s.protests);
  const sessions = useTMSStore((s) => s.sessions);
  const medalEvents = useTMSStore((s) => s.medalEvents);
  const getEventById = useTMSStore((s) => s.getEventById);

  const confirmedEntries = entries.filter((e) => e.status === 'Confirmed' || e.status === 'Locked');
  const pendingProtests = protests.filter((p) => p.status === 'Pending');

  const liveSessions = sessions.filter((s) => s.status === 'LIVE' || s.status === 'Upcoming');
  const todaySessions = sessions.slice(0, 4);

  return (
    <div>
      <h1 className="tms-page-title">Dashboard</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>WYC 2026 · Tournament Overview</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <div className="tms-stat-card">
          <div className="stat-value">{athletes.length}</div>
          <div className="stat-label">ATHLETES · {delegations.length} countries</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{medalEvents.length}</div>
          <div className="stat-label">MEDAL EVENTS · {Math.ceil(medalEvents.length / 2)} per gender</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{entries.length}</div>
          <div className="stat-label">ENTRIES · Confirmed: {confirmedEntries.length}</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{protests.length}</div>
          <div className="stat-label">PROTESTS · {pendingProtests.length} pending review</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="tms-content-card">
          <h3 className="tms-section-header">Live Sessions · Day 2 Morning</h3>
          {liveSessions.slice(0, 3).map((s) => (
            <div
              key={s.id}
              className="tms-list-item"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 1rem',
                margin: '0 -1rem',
                borderRadius: 8,
              }}
            >
              <div>
                <strong>{s.eventId}</strong>
                <div style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 4 }}>
                  {s.matId} · {s.startList?.filter((sl) => sl.checkInStatus === 'Completed').length || 0}/{s.startList?.length || 0} athletes scored
                </div>
              </div>
              <span className={`tms-badge tms-badge-${s.status.toLowerCase()}`}>{s.status}</span>
            </div>
          ))}
        </div>

        <div className="tms-content-card">
          <h3 className="tms-section-header">Today&apos;s Schedule</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 -1rem' }}>
            {todaySessions.map((s, i) => (
              <li key={s.id} className="tms-list-item" style={{ padding: '12px 1rem', borderBottom: i === todaySessions.length - 1 ? 'none' : undefined }}>
                <Link to={`/tms/event/${s.eventId}`} style={{ color: 'var(--tms-green)', textDecoration: 'none' }}>
                  {s.startTime} · {getEventById(s.eventId)?.name || s.eventId} · {s.matId} · {s.startList?.length || 0} athletes
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="tms-content-card" style={{ marginTop: 24 }}>
        <h3 className="tms-section-header">Recent Activity</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 -1rem' }}>
          <li className="tms-list-item" style={{ padding: '12px 1rem', fontSize: 14 }}>09:45:12 · Score Override · Tech Admin overrode score for Athlete #142 · Reason: Missed deduction</li>
          <li className="tms-list-item" style={{ padding: '12px 1rem', fontSize: 14 }}>09:32:00 · Result Published · Individual Sub Jr Male results v1 published</li>
          <li className="tms-list-item" style={{ padding: '12px 1rem', fontSize: 14 }}>09:15:33 · Protest Filed · Delegation IND filed protest for Event ISA-M-01 · Evidence attached</li>
          <li className="tms-list-item" style={{ padding: '12px 1rem', fontSize: 14, borderBottom: 'none' }}>08:50:00 · Schedule Update · Group Sr B session moved from Mat 2 → Mat 3 · v3 published</li>
        </ul>
      </div>
    </div>
  );
}
