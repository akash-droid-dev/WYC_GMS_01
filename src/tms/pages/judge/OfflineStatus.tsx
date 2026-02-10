import { useTMSStore } from '../../store/tmsStore';

export default function JudgeOfflineStatus() {
  const offlineMode = useTMSStore((s) => s.offlineMode);
  const pendingSync = useTMSStore((s) => s.pendingSync);
  const toggleOffline = useTMSStore((s) => s.toggleOffline);

  return (
    <div>
      <h1 className="tms-page-title">Offline Sync Status</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-046 · IndexedDB cache + background sync when connectivity restores
      </p>

      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span className={`tms-badge ${offlineMode ? 'tms-badge-live' : 'tms-badge-confirmed'}`}>
            {offlineMode ? 'OFFLINE MODE · Syncing...' : 'Online'}
          </span>
          <button className="tms-btn tms-btn-outline" onClick={toggleOffline}>
            {offlineMode ? 'Go Online' : 'Simulate Offline'}
          </button>
        </div>

        <h3 className="tms-section-header">Pending Sync Queue ({pendingSync.length} items)</h3>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 12 }}>
          These scores will auto-upload when connection restores
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pendingSync.map((item) => (
            <li
              key={item.id}
              style={{
                padding: 12,
                background: '#f8fafc',
                borderRadius: 6,
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>Score: {item.athlete} · {item.event}</strong>
                <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>
                  {item.status} · {item.score} pts · Cached at 09:32:14
                </div>
              </div>
              <span className="tms-badge tms-badge-pending">Pending</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="tms-content-card">
        <h3 className="tms-section-header">Cached Data (IndexedDB)</h3>
        <table className="tms-table">
          <tbody>
            <tr>
              <td>Event Schedule</td>
              <td>Day 2-3 events</td>
              <td>48 KB</td>
            </tr>
            <tr>
              <td>Athlete Roster</td>
              <td>18 athletes (current event)</td>
              <td>12 KB</td>
            </tr>
            <tr>
              <td>Scoring Templates</td>
              <td>5 component configs</td>
              <td>4 KB</td>
            </tr>
            <tr>
              <td>My Draft Scores</td>
              <td>2 pending submissions</td>
              <td>2 KB</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 16 }}>
          Auto-sync runs every 30 seconds. All submissions are encrypted and queue-ordered. Last successful sync: 09:28:44 UTC.
        </p>
      </div>
    </div>
  );
}
