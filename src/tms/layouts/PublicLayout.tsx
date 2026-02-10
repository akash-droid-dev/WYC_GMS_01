import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TMSLogo from '../components/TMSLogo';

export default function PublicLayout() {
  return (
    <div>
      <header style={{
        background: 'linear-gradient(90deg, var(--tms-saffron) 0%, var(--tms-white) 35%, var(--tms-green) 100%)',
        color: 'var(--tms-navy)',
        padding: '1rem 2rem 1rem 2rem',
        paddingRight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(10, 22, 40, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <TMSLogo size={48} showLabel />
          <span style={{ opacity: 0.9, fontSize: 13, color: 'var(--tms-navy)' }}>
            World Yogasana Championship · Ahmedabad
          </span>
        </div>
        <nav style={{
          display: 'flex',
          gap: 8,
        }}>
          {[
            { to: '/tms/schedule', label: 'Schedule' },
            { to: '/tms/results', label: 'Live Results' },
            { to: '/tms/medals', label: 'Medal Table' },
            { to: '/tms/event/trad-ind-subjr-M', label: 'Events' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                color: 'var(--tms-navy)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main style={{ padding: '2rem 2rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
