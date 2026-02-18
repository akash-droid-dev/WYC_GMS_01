import { Outlet, Link, useLocation } from 'react-router-dom';

const REG_NAV = [
  { path: '/registration', label: 'Dashboard' },
  { path: '/registration/delegation', label: 'My Delegation' },
  { path: '/registration/participants', label: 'Participants' },
  { path: '/registration/entries', label: 'Event Entries' },
  { path: '/registration/submit', label: 'Submit' },
];

export default function RegistrationLayout() {
  const location = useLocation();
  return (
    <div className="tms-sidebar-layout">
      <aside className="tms-sidebar tms-sidebar-reg">
        <div className="tms-sidebar-header">
          <span className="tms-sidebar-logo">WYC 2026</span>
          <div className="tms-sidebar-title">Registration</div>
          <div className="tms-sidebar-subtitle">Team Manager</div>
        </div>
        <nav className="tms-sidebar-nav">
          {REG_NAV.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className={`tms-sidebar-link ${location.pathname === n.path ? 'active' : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: 12 }}>
          <Link to="/tms" className="tms-btn tms-btn-secondary" style={{ width: '100%' }}>
            ← Back to TMS
          </Link>
        </div>
      </aside>
      <main className="tms-sidebar-main">
        <Outlet />
      </main>
    </div>
  );
}
