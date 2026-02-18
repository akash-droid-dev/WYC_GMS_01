import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTMSStore } from '../store/tmsStore';
import TMSLogo from '../components/TMSLogo';

const SIDEBAR = [
  { path: '', label: 'Dashboard' },
  { path: 'search', label: 'Global Search' },
  { path: 'verification', label: 'Verification Queue' },
  { path: 'sync', label: 'Sync Monitoring' },
  { path: 'setup', label: 'Master Setup' },
  { path: 'delegations', label: 'Delegations' },
  { path: 'athletes', label: 'Athletes' },
  { path: 'entries', label: 'Entries' },
  { path: 'schedule', label: 'Schedule' },
  { path: 'live', label: 'Live Ops' },
  { path: 'scoring', label: 'Scoring' },
  { path: 'results', label: 'Results' },
  { path: 'medals', label: 'Medals' },
  { path: 'protests', label: 'Protests' },
  { path: 'reports', label: 'Reports' },
  { path: 'users', label: 'Users' },
];

export default function AdminLayout() {
  const location = useLocation();
  const offlineMode = useTMSStore((s) => s.offlineMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="tms-sidebar-layout">
      {offlineMode && (
        <div className="tms-offline-banner" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
          OFFLINE MODE · Syncing...
        </div>
      )}
      <button
        type="button"
        className="tms-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
        aria-expanded={sidebarOpen}
      >
        ☰
      </button>
      {sidebarOpen && (
        <div
          className="tms-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}
      <aside className={`tms-sidebar tms-sidebar-admin ${sidebarOpen ? 'open' : ''}`}>
        <div className="tms-sidebar-header">
          <TMSLogo size={40} showLabel compact />
          <div className="tms-sidebar-title">Unified Admin</div>
          <div className="tms-sidebar-subtitle">Registration · TMS · Accreditation</div>
        </div>
        <div style={{ padding: '0 12px 12px' }}>
          <Link to="/super-admin" className="tms-btn tms-btn-secondary" style={{ width: '100%', fontSize: 12 }}>→ Super Admin</Link>
          <Link to="/accreditation" className="tms-btn tms-btn-secondary" style={{ width: '100%', fontSize: 12, marginTop: 6 }}>→ Accreditation</Link>
        </div>
        <nav className="tms-sidebar-nav">
          {SIDEBAR.map((n) => {
            const path = n.path || 'admin';
            const isActive = path === 'admin'
              ? location.pathname === '/tms/admin' || location.pathname === '/tms/admin/'
              : location.pathname.includes(n.path) && (n.path === 'delegations' ? !location.pathname.match(/\/delegations\/[A-Z]+/) || location.pathname.endsWith(n.path) : true);
            const isDetailPage = n.path === 'delegations' && location.pathname.match(/\/delegations\/[A-Z]+/);
            const active = isActive || (n.path === 'delegations' && isDetailPage);
            return (
              <Link
                key={n.path || 'dashboard'}
                to={`/tms/admin/${n.path}`}
                className={`tms-sidebar-link ${active ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="tms-sidebar-main">
        <Outlet />
      </main>
    </div>
  );
}
