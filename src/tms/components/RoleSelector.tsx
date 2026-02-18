/* Role selector for demo - switch between Admin, Judge, Delegation Mgr, Public */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTMSStore } from '../store/tmsStore';
import type { User, UserRole } from '../types';

const ROLES: { role: UserRole; path: string; label: string }[] = [
  { role: 'Public', path: '', label: 'Public' },
  { role: 'Delegation Mgr', path: '/delegation', label: 'Delegation' },
  { role: 'Judge', path: '/judge', label: 'Judge' },
  { role: 'Super Admin', path: '/admin', label: 'Admin' },
];

export default function RoleSelector() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;
  const isRegistration = pathname.includes('/registration');
  const isSuperAdmin = pathname.includes('/super-admin');
  const isAccreditation = pathname.includes('/accreditation');
  const currentPath = pathname.replace('/tms', '') || '/';
  const currentRole = currentPath.startsWith('/admin') ? 'Admin' :
    currentPath.startsWith('/judge') ? 'Judge' :
    currentPath.startsWith('/delegation') ? 'Delegation' : 'Public';

  const selectRole = (r: typeof ROLES[0]) => {
    const mockUser: User = {
      id: 'U-demo',
      name: r.role === 'Super Admin' ? 'Admin User' : r.role === 'Judge' ? 'A. Kumar' : r.role === 'Delegation Mgr' ? 'S. Patel' : 'Guest',
      email: 'demo@wyc2026.org',
      role: r.role,
      delegationId: r.role === 'Delegation Mgr' ? 'IND' : undefined,
      assignedEvents: r.role === 'Judge' ? ['trad-ind-subjr-M'] : undefined,
    };
    useTMSStore.getState().setCurrentUser(r.role === 'Public' ? null : mockUser);
    setOpen(false);
  };

  return (
    <div className="tms-role-selector">
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--tms-navy)',
          background: 'white',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
          e.currentTarget.style.borderColor = 'var(--tms-saffron)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
        }}
      >
        <span style={{ opacity: 0.8 }}>View as</span>
        <span style={{ fontWeight: 600, color: 'var(--tms-green)' }}>{currentRole}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 8,
          background: 'white',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 200,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--tms-slate)', borderBottom: '1px solid #f1f5f9' }}>Modules</div>
          <Link to="/registration" style={{ display: 'block', padding: '8px 16px', fontSize: 13, color: 'var(--tms-navy)', textDecoration: 'none', background: isRegistration ? 'rgba(19,136,8,0.08)' : 'transparent' }}>Registration</Link>
          <Link to="/tms" style={{ display: 'block', padding: '8px 16px', fontSize: 13, color: 'var(--tms-navy)', textDecoration: 'none', background: !isRegistration && !isSuperAdmin && !isAccreditation ? 'rgba(19,136,8,0.08)' : 'transparent' }}>TMS</Link>
          <Link to="/super-admin" style={{ display: 'block', padding: '8px 16px', fontSize: 13, color: 'var(--tms-navy)', textDecoration: 'none', background: isSuperAdmin ? 'rgba(19,136,8,0.08)' : 'transparent' }}>Super Admin</Link>
          <Link to="/accreditation" style={{ display: 'block', padding: '8px 16px', fontSize: 13, color: 'var(--tms-navy)', textDecoration: 'none', background: isAccreditation ? 'rgba(19,136,8,0.08)' : 'transparent' }}>Accreditation</Link>
          {pathname.includes('/tms') && (
            <>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--tms-slate)', borderBottom: '1px solid #f1f5f9' }}>View as (TMS)</div>
              {ROLES.map((r, i) => (
                <Link
                  key={r.role}
                  to={r.path ? `/tms${r.path}` : '/tms'}
                  onClick={() => selectRole(r)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: 'var(--tms-navy)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: r.label === currentRole ? 600 : 400,
                    background: r.label === currentRole ? 'rgba(19, 136, 8, 0.08)' : 'transparent',
                    borderBottom: i < ROLES.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (r.label !== currentRole) e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = r.label === currentRole ? 'rgba(19, 136, 8, 0.08)' : 'transparent';
                  }}
                >
                  {r.label}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
