import { useState } from 'react';
import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';

interface AddDelegationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDelegationModal({ isOpen, onClose }: AddDelegationModalProps) {
  const addDelegation = useTMSStore((s) => s.addDelegation);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [headOfDelegation, setHeadOfDelegation] = useState('');
  const [type, setType] = useState<'Country' | 'State'>('Country');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim() || !name.trim()) {
      setError('Code and name are required');
      return;
    }
    addDelegation({ id: code.trim().toUpperCase(), code: code.trim().toUpperCase(), name: name.trim(), headOfDelegation, type, status: 'Active' });
    onClose();
    setCode('');
    setName('');
    setHeadOfDelegation('');
  };

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="Add Delegation · FR-010">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: 8, background: '#fee', color: 'var(--tms-red)', borderRadius: 6, marginBottom: 16 }}>{error}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Code *</label>
            <input type="text" required placeholder="e.g. IND" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} maxLength={3} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Name *</label>
            <input type="text" required placeholder="e.g. India" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Head of Delegation</label>
            <input type="text" placeholder="Name" value={headOfDelegation} onChange={(e) => setHeadOfDelegation(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as 'Country' | 'State')} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}>
              <option value="Country">Country</option>
              <option value="State">State/UT</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" className="tms-btn tms-btn-primary">Add Delegation</button>
          <button type="button" className="tms-btn tms-btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </TMSModal>
  );
}
