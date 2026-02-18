import { Link } from 'react-router-dom';
import { useCloudStore } from '../../cloud/store';

export default function SuperAdminDashboard() {
  const cloud = useCloudStore.getState();
  const { participants, delegations, accreditationRecords, auditLogs, syncLogs } = cloud;
  const approved = participants.filter((p) => p.applicationStatus === 'Approved');
  const pendingSync = syncLogs.filter((s) => s.status === 'Failed');

  return (
    <div>
      <h1 className="tms-page-title">Super Admin Dashboard</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        System-wide configuration. Changes here reflect across Registration, TMS, Accreditation (FRD 5 – Super Admin)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{delegations.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Delegations</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{participants.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Participants</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tms-green)' }}>{approved.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>WYC IDs issued</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{accreditationRecords.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Accreditation records</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{auditLogs.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Audit log entries</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: pendingSync.length ? 'var(--tms-red)' : 'var(--tms-green)' }}>{pendingSync.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Sync failures</div>
        </div>
      </div>
      <div className="tms-content-card">
        <h3 className="tms-section-header">Quick links</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/super-admin/config" className="tms-btn tms-btn-primary">System config</Link>
          <Link to="/super-admin/masters" className="tms-btn tms-btn-primary">Masters (age, events, eligibility)</Link>
          <Link to="/super-admin/users" className="tms-btn tms-btn-primary">Users & RBAC</Link>
          <Link to="/super-admin/audit" className="tms-btn tms-btn-primary">Audit logs</Link>
          <Link to="/tms/admin/verification" className="tms-btn tms-btn-secondary">Verification queue</Link>
          <Link to="/tms/admin/sync" className="tms-btn tms-btn-secondary">Sync monitoring</Link>
        </div>
      </div>
    </div>
  );
}
