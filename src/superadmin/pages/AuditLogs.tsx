import { useCloudStore } from '../../cloud/store';

export default function AuditLogsPage() {
  const { auditLogs } = useCloudStore();
  const recent = [...auditLogs].reverse().slice(0, 200);

  return (
    <div>
      <h1 className="tms-page-title">Audit logs</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Immutable audit trail for approvals, edits, config (FRD COM-002, ADM-004)
      </p>
      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Module</th>
              <th>Action</th>
              <th>Entity</th>
              <th>User</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.timestamp).toLocaleString()}</td>
                <td>{e.module}</td>
                <td>{e.action}</td>
                <td>{e.entityType} {e.entityId}</td>
                <td>{e.userEmail}</td>
                <td>{e.reason ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {auditLogs.length === 0 && <p style={{ color: 'var(--tms-slate)' }}>No audit entries yet.</p>}
      </div>
    </div>
  );
}
