import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTMSStore } from '../store/tmsStore';
import TMSLogo from '../components/TMSLogo';

const NAV = [
  { path: 'athletes', label: 'My Athletes' },
  { path: 'entries', label: 'My Entries' },
  { path: 'schedule', label: 'Schedule' },
  { path: 'results', label: 'Results' },
  { path: 'protests', label: 'Protests' },
];

export default function DelegationLayout() {
  const location = useLocation();
  const delegations = useTMSStore((s) => s.delegations);
  const delegation = delegations.find((d) => d.id === 'IND');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 240,
        background: 'linear-gradient(180deg, var(--tms-green-light) 0%, var(--tms-green-pale) 100%)',
        color: 'white',
        padding: '1.5rem 0',
      }}>
        <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <TMSLogo size={40} showLabel compact />
          <div style={{ marginTop: 12, fontWeight: 600, fontSize: 13 }}>Delegation Manager</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>My Athletes · India</div>
        </div>
        <nav style={{ marginTop: 16 }}>
          {NAV.map((n) => {
            const isActive = location.pathname.includes(n.path);
            return (
              <Link
                key={n.path}
                to={`/tms/delegation/${n.path}`}
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
        <div style={{ padding: '1rem', marginTop: 'auto', fontSize: 12, opacity: 0.7 }}>
          Delegation: {delegation?.name} ({delegation?.code})<br />
          Manager: S. Patel
        </div>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: 'var(--tms-canvas)' }}>
        <Outlet />
      </main>
    </div>
  );
}
