import { useState, useMemo } from 'react';
import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';
import type { Gender } from '../types';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegationId: string;
}

export default function AddTeamModal({ isOpen, onClose, delegationId }: AddTeamModalProps) {
  const addTeam = useTMSStore((s) => s.addTeam);
  const athletes = useTMSStore((s) => s.athletes);
  const disciplines = useTMSStore((s) => s.disciplines);

  const [teamName, setTeamName] = useState('');
  const [teamType, setTeamType] = useState<'Pair' | 'Group'>('Pair');
  const [disciplineId, setDisciplineId] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [coach, setCoach] = useState('');
  const [error, setError] = useState('');

  const pairDisciplines = disciplines.filter((d) => d.type === 'Pair');
  const groupDisciplines = disciplines.filter((d) => d.type === 'Group');
  const eventDisciplines = teamType === 'Pair' ? pairDisciplines : groupDisciplines;

  const delegationAthletes = useMemo(
    () => athletes.filter((a) => a.delegationId === delegationId && a.status !== 'Withdrawn'),
    [athletes, delegationId]
  );

  const minMembers = teamType === 'Pair' ? 2 : 3;
  const maxMembers = teamType === 'Pair' ? 2 : 5;
  const isValidCount = memberIds.length >= minMembers && memberIds.length <= maxMembers;

  const handleToggleMember = (id: string) => {
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= maxMembers ? prev : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
    if (!disciplineId) {
      setError('Select a discipline');
      return;
    }
    if (!isValidCount) {
      setError(`${teamType} requires ${minMembers}-${maxMembers} members (FR-013)`);
      return;
    }
    const members = delegationAthletes.filter((a) => memberIds.includes(a.id));
    const sameGender = members.every((m) => m.gender === members[0].gender);
    if (!sameGender) {
      setError('All members must be same gender (FR-013)');
      return;
    }
    addTeam({
      name: teamName.trim(),
      delegationId,
      type: teamType,
      memberIds,
      disciplineId,
      coach: coach || undefined,
    });
    onClose();
    setTeamName('');
    setMemberIds([]);
    setDisciplineId('');
    setCoach('');
  };

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="Add Team (Pair/Group) · FR-013">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 16 }}>
          Same delegation, same gender. Pair=2, Group=3-5 members.
        </p>
        {error && (
          <div style={{ padding: 8, background: '#fee', color: 'var(--tms-red)', borderRadius: 6, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Team Type</label>
            <select
              value={teamType}
              onChange={(e) => {
                setTeamType(e.target.value as 'Pair' | 'Group');
                setDisciplineId('');
                setMemberIds([]);
              }}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            >
              <option value="Pair">Pair (2 athletes)</option>
              <option value="Group">Group (3-5 athletes)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Team Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gupta + Nair"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Discipline *</label>
            <select
              required
              value={disciplineId}
              onChange={(e) => setDisciplineId(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            >
              <option value="">Select...</option>
              {eventDisciplines.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Members * ({memberIds.length}/{maxMembers})
            </label>
            <div style={{ maxHeight: 150, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8 }}>
              {delegationAthletes.map((a) => (
                <label key={a.id} style={{ display: 'block', marginBottom: 4 }}>
                  <input
                    type="checkbox"
                    checked={memberIds.includes(a.id)}
                    onChange={() => handleToggleMember(a.id)}
                    disabled={!memberIds.includes(a.id) && memberIds.length >= maxMembers}
                  />
                  {' '}{a.fullName} ({a.gender === 'M' ? 'M' : 'F'})
                </label>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Coach (optional)</label>
            <input
              type="text"
              placeholder="Coach name"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" className="tms-btn tms-btn-primary" disabled={!isValidCount}>Create Team</button>
          <button type="button" className="tms-btn tms-btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </TMSModal>
  );
}
