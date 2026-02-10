import { Outlet, Link, useLocation } from 'react-router-dom';
import TMSLogo from '../components/TMSLogo';

const NAV = [
  { path: 'events', label: 'My Events' },
  { path: 'offline', label: 'Offline Status' },
];

export default function JudgeLayout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 220,
        background: 'linear-gradient(180deg, var(--tms-green-light) 0%, var(--tms-green-pale) 100%)',
        color: 'white',
        padding: '1.5rem 0',
      }}>
        <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <TMSLogo size={40} showLabel compact />
          <div style={{ marginTop: 12, fontWeight: 600, fontSize: 13 }}>Judge Panel</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Judge: A. Kumar</div>
        </div>
        <nav style={{ marginTop: 16 }}>
          {NAV.map((n) => {
            const isActive = location.pathname.includes(n.path) && !location.pathname.includes('scoring');
            return (
              <Link
                key={n.path}
                to={`/tms/judge/${n.path}`}
                style={{
                  display: 'block',
                  padding: '0.5rem 1rem',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: 14,
                  borderLeft: isActive ? '4px solid var(--tms-saffron)' : '4px solid transparent',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: 'var(--tms-canvas)' }}>
        <Outlet />
      </main>
    </div>
  );
}
