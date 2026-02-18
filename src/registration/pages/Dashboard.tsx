import { Link } from 'react-router-dom';
import { useCloudStore } from '../../cloud/store';

export default function RegistrationDashboard() {
  const delegations = useCloudStore((s) => s.delegations);
  const participants = useCloudStore((s) => s.participants);
  const systemConfig = useCloudStore((s) => s.systemConfig);
  const pending = participants.filter((p) => p.applicationStatus === 'Pending Verification');
  const approved = participants.filter((p) => p.applicationStatus === 'Approved');
  const draft = participants.filter((p) => p.applicationStatus === 'Draft');

  return (
    <div>
      <h1 className="tms-page-title">Registration Dashboard</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Home Dashboard · KPIs, alerts, pending queues (FRD 9.2)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tms-green)' }}>{delegations.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Delegations</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{participants.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Participants</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tms-gold)' }}>{pending.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Pending Verification</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tms-teal)' }}>{approved.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Approved (WYC ID)</div>
        </div>
        <div className="tms-content-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{draft.length}</div>
          <div style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Draft</div>
        </div>
      </div>
      <div className="tms-content-card">
        <h3 className="tms-section-header">Quick actions</h3>
        <p style={{ color: 'var(--tms-slate)', marginBottom: 16 }}>Registration deadline: {systemConfig.registrationDeadline}. Max events per athlete: {systemConfig.maxEventsPerAthlete}.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/registration/delegation" className="tms-btn tms-btn-primary">Create / Edit Delegation</Link>
          <Link to="/registration/participants" className="tms-btn tms-btn-primary">Add Participants</Link>
          <Link to="/registration/entries" className="tms-btn tms-btn-primary">Event Entries</Link>
          <Link to="/registration/submit" className="tms-btn tms-btn-primary">Submit Application</Link>
        </div>
      </div>
    </div>
  );
}
