import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTMSStore } from '../store/tmsStore';
import TMSLogo from '../components/TMSLogo';

const SIDEBAR = [
  { path: '', label: 'Dashboard' },
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {offlineMode && (
        <div className="tms-offline-banner" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
          OFFLINE MODE · Syncing...
        </div>
      )}
      <aside style={{
        width: 260,
        background: 'linear-gradient(180deg, var(--tms-green-light) 0%, var(--tms-green-pale) 100%)',
        color: 'white',
        padding: '1.5rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <TMSLogo size={40} showLabel compact />
          <div style={{ marginTop: 12, fontWeight: 700, fontSize: 14 }}>Tournament Management</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Super Admin · AK</div>
        </div>
        <nav style={{ marginTop: 16 }}>
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
                style={{
                  display: 'block',
                  padding: '0.5rem 1rem',
                  color: active ? 'white' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: 14,
                  borderLeft: active ? '4px solid var(--tms-saffron)' : '4px solid transparent',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main style={{ flex: 1, marginLeft: 260, padding: '2rem', background: 'var(--tms-canvas)', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
