import { useCloudStore } from '../../cloud/store';

export default function AccreditationQueue() {
  const { accreditationRecords } = useCloudStore();
  const pending = accreditationRecords.filter((a) => a.status === 'Pending' || a.status === 'Needs Correction');
  const ready = accreditationRecords.filter((a) => a.status === 'Ready');
  const printed = accreditationRecords.filter((a) => a.status === 'Printed');
  const issued = accreditationRecords.filter((a) => a.status === 'Issued' || a.status === 'Active');

  return (
    <div>
      <h1 className="tms-page-title">Accreditation queue</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Records keyed by WYC ID from Registration (FRD FR-ACC-001, FR-ACC-002)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{pending.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Pending</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tms-gold)' }}>{ready.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Ready</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{printed.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Printed</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tms-green)' }}>{issued.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Issued</div>
        </div>
      </div>
      <div className="tms-content-card">
        <h3 className="tms-section-header">All records</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>WYC ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accreditationRecords.map((a) => (
              <tr key={a.id}>
                <td>{a.wycId}</td>
                <td>{a.fullName}</td>
                <td>{a.role}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {accreditationRecords.length === 0 && (
          <p style={{ color: 'var(--tms-slate)' }}>No records. Approve participants in Registration to push to Accreditation.</p>
        )}
      </div>
    </div>
  );
}
