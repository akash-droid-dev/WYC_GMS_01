import { useMemo, useState } from 'react';
import { useCloudStore } from '../../cloud/store';
import { isEventEligibleForAge } from '../../cloud/constants';

export default function EventEntriesPage() {
  const { delegations, participants, eventEntries, teams, eventTypes, ageCategories, eligibilityRules, addEventEntry, addTeam } = useCloudStore();
  const delegationId = delegations[0]?.id;
  const athletes = useMemo(() => participants.filter((p) => p.delegationId === delegationId && p.role === 'Athlete'), [participants, delegationId]);

  const [selectedEventTypeId, setSelectedEventTypeId] = useState('');
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [pairAthlete2Id, setPairAthlete2Id] = useState('');
  const [groupAthleteIds, setGroupAthleteIds] = useState<string[]>([]);
  const [entryType, setEntryType] = useState<'Individual' | 'Pair' | 'Group'>('Individual');

  const eligibleEvents = useMemo(() => {
    return eventTypes.filter((et) => {
      const ac = ageCategories[0];
      return ac && isEventEligibleForAge(et.id, ac.id, eligibilityRules);
    });
  }, [eventTypes, ageCategories, eligibilityRules]);

  const addIndividual = () => {
    if (!delegationId || !selectedAthleteId || !selectedEventTypeId) return;
    const athlete = participants.find((p) => p.id === selectedAthleteId);
    if (!athlete?.ageCategoryId) return;
    addEventEntry({
      delegationId,
      participantId: selectedAthleteId,
      eventTypeId: selectedEventTypeId,
      ageCategoryId: athlete.ageCategoryId,
      gender: athlete.gender,
      type: 'Individual',
      status: 'Draft',
    });
    setSelectedAthleteId('');
    setSelectedEventTypeId('');
  };

  const addPair = () => {
    if (!delegationId || !selectedAthleteId || !pairAthlete2Id || !selectedEventTypeId) return;
    const a1 = participants.find((p) => p.id === selectedAthleteId);
    const a2 = participants.find((p) => p.id === pairAthlete2Id);
    if (!a1 || !a2 || a1.gender !== a2.gender) {
      alert('Both athletes must be same delegation and same gender.');
      return;
    }
    const teamId = addTeam({
      delegationId,
      name: `Pair ${a1.fullName} + ${a2.fullName}`,
      type: 'Pair',
      eventTypeId: selectedEventTypeId,
      memberParticipantIds: [selectedAthleteId, pairAthlete2Id],
      status: 'Draft',
    });
    addEventEntry({
      delegationId,
      teamId,
      eventTypeId: selectedEventTypeId,
      ageCategoryId: a1.ageCategoryId ?? 'SEN',
      gender: a1.gender,
      type: 'Pair',
      memberParticipantIds: [selectedAthleteId, pairAthlete2Id],
      status: 'Draft',
    });
    setSelectedAthleteId('');
    setPairAthlete2Id('');
    setSelectedEventTypeId('');
  };

  const list = eventEntries.filter((e) => e.delegationId === delegationId);

  if (!delegationId) {
    return (
      <div>
        <h1 className="tms-page-title">Event Entries</h1>
        <p className="tms-content-card">Create a delegation first.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="tms-page-title">Event Entries</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Individual, Pair, Group — eligibility matrix enforced (FRD REG-012, REG-020 to REG-022)
      </p>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Add entry</h3>
        <div style={{ marginBottom: 12 }}>
          <label className="tms-label">Entry type</label>
          <select className="tms-input" value={entryType} onChange={(e) => setEntryType(e.target.value as 'Individual' | 'Pair' | 'Group')}>
            <option value="Individual">Individual</option>
            <option value="Pair">Pair</option>
            <option value="Group">Group</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="tms-label">Event type</label>
          <select className="tms-input" value={selectedEventTypeId} onChange={(e) => setSelectedEventTypeId(e.target.value)}>
            <option value="">Select event</option>
            {eventTypes.map((et) => (
              <option key={et.id} value={et.id}>{et.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="tms-label">Athlete 1</label>
          <select className="tms-input" value={selectedAthleteId} onChange={(e) => setSelectedAthleteId(e.target.value)}>
            <option value="">Select</option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>{a.fullName} ({a.gender})</option>
            ))}
          </select>
        </div>
        {entryType === 'Pair' && (
          <div style={{ marginBottom: 12 }}>
            <label className="tms-label">Athlete 2 (same gender)</label>
            <select className="tms-input" value={pairAthlete2Id} onChange={(e) => setPairAthlete2Id(e.target.value)}>
              <option value="">Select</option>
              {athletes.filter((a) => a.id !== selectedAthleteId).map((a) => (
                <option key={a.id} value={a.id}>{a.fullName}</option>
              ))}
            </select>
          </div>
        )}
        {entryType === 'Individual' && (
          <button type="button" className="tms-btn tms-btn-primary" onClick={addIndividual}>Add individual entry</button>
        )}
        {entryType === 'Pair' && (
          <button type="button" className="tms-btn tms-btn-primary" onClick={addPair}>Add pair entry</button>
        )}
        {entryType === 'Group' && (
          <p style={{ color: 'var(--tms-slate)', fontSize: 14 }}>Group: add team then link roster (same delegation, same gender).</p>
        )}
      </div>
      <div className="tms-content-card">
        <h3 className="tms-section-header">Entries ({list.length})</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>Event type</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td>{eventTypes.find((et) => et.id === e.eventTypeId)?.name ?? e.eventTypeId}</td>
                <td>{e.type}</td>
                <td>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
