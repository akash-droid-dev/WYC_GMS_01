import { useState } from 'react';
import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';
import { calcAge } from '../store/tmsStore';
import type { Gender } from '../types';

const DISCIPLINE_OPTIONS = ['Traditional', 'Rhythmic', 'Artistic', 'Free Flow', 'Artistic Pair', 'Rhythmic Pair', 'Group'];

interface AddAthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegationId: string;
}

export default function AddAthleteModal({ isOpen, onClose, delegationId }: AddAthleteModalProps) {
  const addAthlete = useTMSStore((s) => s.addAthlete);
  const ageCategories = useTMSStore((s) => s.ageCategories);

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('M');
  const [regId, setRegId] = useState('');
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [error, setError] = useState('');

  const age = dob ? calcAge(dob) : null;
  const ageCat = age !== null ? ageCategories.find((c) => age >= c.minAge && age <= c.maxAge) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!dob) {
      setError('Date of birth is required');
      return;
    }
    if (age !== null && (age < 10 || age > 55)) {
      setError('Age must be between 10 and 55 (per WYC 2026 eligibility)');
      return;
    }
    addAthlete({
      fullName: fullName.trim(),
      dob,
      gender,
      delegationId,
      regId: regId || undefined,
      disciplines: disciplines.length ? disciplines : ['Traditional'],
    });
    onClose();
    setFullName('');
    setDob('');
    setRegId('');
    setDisciplines([]);
  };

  const toggleDiscipline = (d: string) => {
    setDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="Add Athlete · FR-010/011">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 16 }}>
          Validate: ID, Name, DOB, Gender. Age auto-calculated as of cut-off 2026-01-01.
        </p>
        {error && (
          <div style={{ padding: 8, background: '#fee', color: 'var(--tms-red)', borderRadius: 6, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Registration ID</label>
            <input
              type="text"
              placeholder="R-0XXX (optional)"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="Athlete full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Date of Birth *</label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
          {age !== null && (
            <p style={{ fontSize: 12, color: 'var(--tms-slate)' }}>
              Age: {age} years · Age Category: {ageCat?.label || 'N/A'}
            </p>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Disciplines</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DISCIPLINE_OPTIONS.map((d) => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="checkbox"
                    checked={disciplines.includes(d)}
                    onChange={() => toggleDiscipline(d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" className="tms-btn tms-btn-primary">Submit</button>
          <button type="button" className="tms-btn tms-btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </TMSModal>
  );
}
