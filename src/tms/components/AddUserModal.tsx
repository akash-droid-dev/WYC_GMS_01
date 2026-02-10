import { useState } from 'react';
import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';
import type { UserRole } from '../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES: UserRole[] = ['Super Admin', 'Comp Admin', 'Tech Admin', 'Chief Judge', 'Judge', 'Scoring Op', 'Delegation Mgr', 'Public'];

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const addUser = useTMSStore((s) => s.addUser);
  const delegations = useTMSStore((s) => s.delegations);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Judge');
  const [delegationId, setDelegationId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    addUser({
      name: name.trim(),
      email: email.trim(),
      role,
      delegationId: role === 'Delegation Mgr' ? delegationId || undefined : undefined,
    });
    onClose();
    setName('');
    setEmail('');
    setRole('Judge');
    setDelegationId('');
  };

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="Add User · FR-041 RBAC">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: 8, background: '#fee', color: 'var(--tms-red)', borderRadius: 6, marginBottom: 16 }}>{error}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Email *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {role === 'Delegation Mgr' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Delegation</label>
              <select value={delegationId} onChange={(e) => setDelegationId(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}>
                <option value="">Select...</option>
                {delegations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" className="tms-btn tms-btn-primary">Add User</button>
          <button type="button" className="tms-btn tms-btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </TMSModal>
  );
}
