import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';
import type { AdminRole } from '../../cloud/types';

export default function SuperAdminUsers() {
  const { users, addUser, updateUser } = useCloudStore();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<AdminRole>('OC Verifier');

  const add = () => {
    if (!email.trim()) return;
    addUser({
      email: email.trim(),
      displayName: displayName.trim() || email.trim(),
      role,
      permissions: [],
    });
    setEmail('');
    setDisplayName('');
  };

  return (
    <div>
      <h1 className="tms-page-title">Users & roles</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        RBAC – Super Admin can manage all users (FRD COM-001, 10.2)
      </p>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Add user</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label className="tms-label">Email</label>
            <input type="email" className="tms-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="tms-label">Display name</label>
            <input type="text" className="tms-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div>
            <label className="tms-label">Role</label>
            <select className="tms-input" value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
              <option value="Super Admin">Super Admin</option>
              <option value="OC Admin">OC Admin</option>
              <option value="OC Verifier">OC Verifier</option>
              <option value="TMS Operator">TMS Operator</option>
              <option value="Competition Director">Competition Director</option>
              <option value="Accreditation Admin">Accreditation Admin</option>
              <option value="Accreditation Operator">Accreditation Operator</option>
              <option value="Helpdesk Viewer">Helpdesk Viewer</option>
            </select>
          </div>
          <button type="button" className="tms-btn tms-btn-primary" onClick={add}>Add user</button>
        </div>
      </div>
      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Display name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.displayName}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
