import { useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

const DAYS = [
  { id: 'd1', label: 'Day 1', date: 'Jun 14' },
  { id: 'd2', label: 'Day 2', date: 'Jun 15' },
  { id: 'd3', label: 'Day 3', date: 'Jun 16' },
];

export default function DelegationSchedule() {
  const [day, setDay] = useState('d1');
  const sessions = useTMSStore((s) => s.sessions);
  const getEventById = useTMSStore((s) => s.getEventById);
  const entries = useTMSStore((s) => s.entries);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const teams = useTMSStore((s) => s.teams);

  const daySessions = sessions.filter((s) => s.dayId === day);

  const getIndiaAthletesInSession = (sessionId: string, eventId: string) => {
    const eventEntries = entries.filter((e) => e.eventId === eventId && e.delegationId === 'IND' && e.status !== 'Withdrawn');
    const session = sessions.find((s) => s.id === sessionId);
    return eventEntries.map((e) => {
      if (e.athleteId) {
        const athlete = getAthleteById(e.athleteId);
        const slot = session?.startList?.find((sl) => sl.athleteId === e.athleteId);
        return { name: athlete?.fullName, order: slot?.order };
      }
      const team = teams.find((t) => t.id === e.teamId);
      const slot = session?.startList?.find((sl) => sl.teamId === e.teamId);
      return { name: team?.name || 'Team', order: slot?.order };
    });
  };

  return (
    <div>
      <h1 className="tms-page-title">Schedule · My Delegation</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Filtered to India entries · 3-day competition
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {DAYS.map((d) => (
          <button
            key={d.id}
            className={`tms-btn ${day === d.id ? 'tms-btn-primary' : 'tms-btn-outline'}`}
            onClick={() => setDay(d.id)}
          >
            {d.label} · {d.date}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {daySessions.map((s) => {
          const ev = getEventById(s.eventId);
          const indiaAthletes = getIndiaAthletesInSession(s.id, s.eventId);
          return (
            <div key={s.id} className="tms-content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <strong>{s.startTime} – {s.endTime}</strong>
                  <span style={{ marginLeft: 12 }}>{s.matId}</span>
                  <span style={{ marginLeft: 12, color: 'var(--tms-slate)' }}>· {ev?.name || s.eventId}</span>
                </div>
                <span className={`tms-badge tms-badge-${s.status.toLowerCase().replace(' ', '-')}`}>{s.status}</span>
              </div>
              <div style={{ fontSize: 14, color: 'var(--tms-slate)' }}>
                India Athletes: {indiaAthletes.length > 0
                  ? indiaAthletes.map((a) => `${a.name} (Order: ${a.order})`).join(', ')
                  : 'No India entries'}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 24 }}>FR-030 · Schedule published, version 3</p>
    </div>
  );
}
