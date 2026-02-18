import { useCloudStore } from '../../cloud/store';

export default function AccreditationReports() {
  const { accreditationRecords, scanLogs } = useCloudStore();

  return (
    <div>
      <h1 className="tms-page-title">Accreditation reports</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Exports for status, issuance logs, scan logs (FRD FR-ACC-024)
      </p>
      <div className="tms-content-card">
        <h3 className="tms-section-header">Status summary</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>WYC ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Issued at</th>
            </tr>
          </thead>
          <tbody>
            {accreditationRecords.map((a) => (
              <tr key={a.id}>
                <td>{a.wycId}</td>
                <td>{a.fullName}</td>
                <td>{a.role}</td>
                <td>{a.status}</td>
                <td>{a.issuedAt ? new Date(a.issuedAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--tms-slate)' }}>Export to CSV/PDF (implement download).</p>
      </div>
      <div className="tms-content-card" style={{ marginTop: 24 }}>
        <h3 className="tms-section-header">Scan logs (last 50)</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>WYC ID</th>
              <th>Result</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {[...scanLogs].reverse().slice(0, 50).map((s) => (
              <tr key={s.id}>
                <td>{new Date(s.scannedAt).toLocaleString()}</td>
                <td>{s.wycId}</td>
                <td>{s.result}</td>
                <td>{s.reasonCode ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
