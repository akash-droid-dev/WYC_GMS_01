import { useCloudStore } from '../../cloud/store';

export default function SyncMonitoring() {
  const { syncLogs } = useCloudStore();
  const failed = syncLogs.filter((s) => s.status === 'Failed');
  const recent = [...syncLogs].reverse().slice(0, 100);

  return (
    <div>
      <h1 className="tms-page-title">Sync monitoring</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Registration → TMS & Accreditation. Per-record status and retry (FRD ADM-003, INT-001)
      </p>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Summary</h3>
        <p>Total sync events: {syncLogs.length}. Failed: {failed.length}.</p>
        {failed.length > 0 && (
          <p style={{ color: 'var(--tms-red)' }}>Retry failed syncs from queue (idempotent).</p>
        )}
      </div>
      <div className="tms-content-card">
        <h3 className="tms-section-header">Recent sync log</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Source</th>
              <th>Target</th>
              <th>WYC ID</th>
              <th>Status</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((s) => (
              <tr key={s.id}>
                <td>{new Date(s.syncedAt).toLocaleString()}</td>
                <td>{s.source}</td>
                <td>{s.target}</td>
                <td>{s.wycId ?? '-'}</td>
                <td style={{ color: s.status === 'Failed' ? 'var(--tms-red)' : 'var(--tms-green)' }}>{s.status}</td>
                <td>{s.error ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {syncLogs.length === 0 && <p style={{ color: 'var(--tms-slate)' }}>No sync events yet. Approval of participants will create sync entries.</p>}
      </div>
    </div>
  );
}
