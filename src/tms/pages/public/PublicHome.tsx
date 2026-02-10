import { Link } from 'react-router-dom';

const CARDS = [
  { to: '/tms/schedule', title: 'Schedule', desc: '3-day program · 56 events', icon: '📅' },
  { to: '/tms/results', title: 'Live Results', desc: 'Real-time scoring updates', icon: '📊' },
  { to: '/tms/medals', title: 'Medal Table', desc: 'By country · By athlete', icon: '🏅' },
  { to: '/tms/event/trad-ind-subjr-M', title: 'Event Info', desc: 'Details & start lists', icon: '📋' },
];

export default function PublicHome() {
  return (
    <div>
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem 3rem',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
      }}>
        <h1 className="tms-hero-title" style={{ marginBottom: 16 }}>
          World Yogasana Championship 2026
        </h1>
        <p style={{
          background: 'linear-gradient(135deg, var(--tms-saffron) 0%, #e68a2e 100%)',
          color: 'white',
          fontSize: 16,
          padding: '0.75rem 2rem',
          borderRadius: 12,
          display: 'inline-block',
          margin: 0,
          fontWeight: 700,
          boxShadow: '0 4px 16px rgba(255, 153, 51, 0.35)',
          letterSpacing: '0.02em',
        }}>
          Ahmedabad · June 4 to June 8
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="tms-link-card">
            <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.9 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: 'var(--tms-navy)' }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--tms-slate)' }}>{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
