import { useState, useMemo } from 'react';
import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';
import type { Gender } from '../types';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegationId?: string;
}

export default function AddEntryModal({ isOpen, onClose, delegationId: propDelegationId }: AddEntryModalProps) {
  const addEntry = useTMSStore((s) => s.addEntry);
  const delegations = useTMSStore((s) => s.delegations);
  const medalEvents = useTMSStore((s) => s.medalEvents);
  const athletes = useTMSStore((s) => s.athletes);
  const teams = useTMSStore((s) => s.teams);
  const entries = useTMSStore((s) => s.entries);

  const [delegationId, setDelegationId] = useState(propDelegationId || delegations[0]?.id || 'IND');
  const effectiveDelegationId = propDelegationId || delegationId || 'IND';
  const [eventId, setEventId] = useState('');
  const [athleteId, setAthleteId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');

  const selectedEvent = medalEvents.find((e) => e.id === eventId);
  const delegationAthletes = useMemo(
    () => athletes.filter((a) => a.delegationId === effectiveDelegationId && a.status !== 'Withdrawn'),
    [athletes, effectiveDelegationId]
  );
  const delegationTeams = useMemo(
    () => teams.filter((t) => t.delegationId === effectiveDelegationId),
    [teams, effectiveDelegationId]
  );

  const eligibleAthletes = useMemo(() => {
    if (!selectedEvent) return delegationAthletes;
    return delegationAthletes.filter(
      (a) => a.gender === selectedEvent.gender && a.ageCategoryId === selectedEvent.ageCategoryId
    );
  }, [delegationAthletes, selectedEvent]);

  const eligibleTeams = useMemo(() => {
    if (!selectedEvent) return delegationTeams;
    return delegationTeams.filter(
      (t) =>
        t.disciplineId === selectedEvent.disciplineId &&
        t.type === selectedEvent.type
    );
  }, [delegationTeams, selectedEvent]);

  const checkEntryLimit = (aid?: string, tid?: string) => {
    const id = aid || tid;
    if (!id || !eventId) return null;
    const count = entries.filter(
      (e) => e.eventId === eventId && (e.athleteId === id || e.teamId === id) && e.status !== 'Withdrawn'
    ).length;
    return count;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!eventId) {
      setError('Select an event');
      return;
    }
    if (!selectedEvent) return;

    if (selectedEvent.type === 'Individual') {
      if (!athleteId) {
        setError('Select an athlete');
        return;
      }
      const limit = checkEntryLimit(athleteId);
      if (limit !== null && limit >= 2) {
        setError('Max 2 entries per athlete per discipline (FR-020)');
        return;
      }
      addEntry({
        eventId,
        athleteId,
        delegationId: effectiveDelegationId,
        type: 'Individual',
      });
    } else {
      if (!teamId) {
        setError('Select a team');
        return;
      }
      addEntry({
        eventId,
        teamId,
        delegationId: effectiveDelegationId,
        type: selectedEvent.type,
      });
    }
    onClose();
    setEventId('');
    setAthleteId('');
    setTeamId('');
  };

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="New Entry · FR-020/021">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 16 }}>
          Max 2 individual entries per athlete per discipline · Team entries require min 3 members (Group).
        </p>
        {error && (
          <div style={{ padding: 8, background: '#fee', color: 'var(--tms-red)', borderRadius: 6, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!propDelegationId && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Delegation *</label>
              <select
                required
                value={delegationId}
                onChange={(e) => setDelegationId(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
              >
                {delegations.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Medal Event *</label>
            <select
              required
              value={eventId}
              onChange={(e) => {
                setEventId(e.target.value);
                setAthleteId('');
                setTeamId('');
              }}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            >
              <option value="">Select event...</option>
              {medalEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
          {selectedEvent?.type === 'Individual' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Athlete *</label>
              <select
                required
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
              >
                <option value="">Select athlete...</option>
                {eligibleAthletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.fullName} ({a.ageCategoryId})
                  </option>
                ))}
                {eligibleAthletes.length === 0 && <option disabled>No eligible athletes</option>}
              </select>
            </div>
          )}
          {(selectedEvent?.type === 'Pair' || selectedEvent?.type === 'Group') && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                {selectedEvent.type} Team *
              </label>
              <select
                required
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
              >
                <option value="">Select team...</option>
                {eligibleTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
                {eligibleTeams.length === 0 && <option disabled>No eligible teams (create team first)</option>}
              </select>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" className="tms-btn tms-btn-primary">Create Draft Entry</button>
          <button type="button" className="tms-btn tms-btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </TMSModal>
  );
}
