import { Outlet, Link, useLocation } from 'react-router-dom';

const ACC_NAV = [
  { path: '/accreditation', label: 'Queue' },
  { path: '/accreditation/print', label: 'Print / Issue' },
  { path: '/accreditation/scan', label: 'Scan validation' },
  { path: '/accreditation/reports', label: 'Reports' },
];

export default function AccreditationLayout() {
  const location = useLocation();
  return (
    <div className="tms-sidebar-layout">
      <aside className="tms-sidebar tms-sidebar-acc">
        <div className="tms-sidebar-header">
          <span className="tms-sidebar-logo">WYC 2026</span>
          <div className="tms-sidebar-title">Accreditation</div>
          <div className="tms-sidebar-subtitle">Badge & access</div>
        </div>
        <nav className="tms-sidebar-nav">
          {ACC_NAV.map((n) => (
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
          <Link to="/tms/admin" className="tms-btn tms-btn-secondary" style={{ width: '100%' }}>
            → Unified Admin
          </Link>
        </div>
      </aside>
      <main className="tms-sidebar-main">
        <Outlet />
      </main>
    </div>
  );
}
