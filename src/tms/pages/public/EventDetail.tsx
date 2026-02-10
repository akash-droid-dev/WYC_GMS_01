import { useParams } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

export default function PublicEventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const getEventById = useTMSStore((s) => s.getEventById);
  const sessions = useTMSStore((s) => s.sessions);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getDelegationById = useTMSStore((s) => s.getDelegationById);
  const entries = useTMSStore((s) => s.entries);

  const ev = eventId ? getEventById(eventId) : null;
  const session = sessions.find((s) => s.eventId === eventId);
  const eventEntries = entries.filter((e) => e.eventId === eventId && e.status !== 'Withdrawn');

  if (!ev) return <div>Event not found</div>;

  return (
    <div>
      <h1 className="tms-page-title">Event Detail · {ev.name}</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Individual Traditional Yogasana · Sub-Junior · Male
      </p>

      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Event Details</h3>
        <p><strong>Discipline:</strong> Traditional Yogasana</p>
        <p><strong>Category:</strong> Sub-Junior · Gender: Male</p>
        <p><strong>Date:</strong> Day 2 · June 15, 2026 · 09:00 – 10:30 UTC</p>
        <p><strong>Venue:</strong> Mat 1 · Main Hall, Indira Gandhi Stadium</p>
        <p><strong>Participants:</strong> {eventEntries.length} athletes from 12 countries</p>
      </div>

      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Scoring Components</h3>
        <p>Posture (10) · Breathing (10) · Technique (10) · Presentation (10) · Difficulty (10)</p>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 4 }}>
          Total possible: 50.0 pts · 5 judges per panel · FR-042
        </p>
      </div>

      <div className="tms-content-card">
        <h3 className="tms-section-header">Start List ({eventEntries.length} athletes)</h3>
        <ol style={{ paddingLeft: 20 }}>
          {session?.startList?.slice(0, 6).map((slot) => {
            const athlete = slot.athleteId ? getAthleteById(slot.athleteId) : null;
            const del = athlete ? getDelegationById(athlete.delegationId) : null;
            return (
              <li key={slot.id} style={{ marginBottom: 4 }}>
                {athlete?.fullName} · {del?.name}
              </li>
            );
          })}
        </ol>
        {eventEntries.length > 6 && (
          <p style={{ marginTop: 8, color: 'var(--tms-teal)', fontSize: 14 }}>
            + {eventEntries.length - 6} more athletes · View full start list →
          </p>
        )}
      </div>
    </div>
  );
}
