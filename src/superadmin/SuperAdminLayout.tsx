import { Outlet, Link, useLocation } from 'react-router-dom';

const SA_NAV = [
  { path: '/super-admin', label: 'Dashboard' },
  { path: '/super-admin/config', label: 'System config' },
  { path: '/super-admin/masters', label: 'Masters (global)' },
  { path: '/super-admin/users', label: 'Users & roles' },
  { path: '/super-admin/audit', label: 'Audit logs' },
];

export default function SuperAdminLayout() {
  const location = useLocation();
  return (
    <div className="tms-sidebar-layout">
      <aside className="tms-sidebar tms-sidebar-superadmin">
        <div className="tms-sidebar-header">
          <span className="tms-sidebar-logo">WYC 2026</span>
          <div className="tms-sidebar-title">Super Admin</div>
          <div className="tms-sidebar-subtitle">System-wide config</div>
        </div>
        <nav className="tms-sidebar-nav">
          {SA_NAV.map((n) => (
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
          <Link to="/tms" className="tms-btn tms-btn-secondary" style={{ width: '100%', marginTop: 8 }}>
            → TMS Public
          </Link>
        </div>
      </aside>
      <main className="tms-sidebar-main">
        <Outlet />
      </main>
    </div>
  );
}
