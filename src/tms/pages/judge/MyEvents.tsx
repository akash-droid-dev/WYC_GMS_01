import { Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

const ASSIGNED_EVENTS = [
  { id: 's1', eventId: 'trad-ind-subjr-M', name: 'Ind. Traditional Sub-Jr Male', day: 'Day 2', time: '09:00-10:30', mat: 'Mat 1', role: 'Judge 3 of 5', status: 'LIVE', components: ['Posture', 'Breathing', 'Technique', 'Presentation', 'Difficulty'] },
  { id: 's4', eventId: 'art-pair-jra-F', name: 'Pair Artistic Jr-A Female', day: 'Day 2', time: '14:00-15:30', mat: 'Mat 2', role: 'Judge 2 of 5', status: 'Upcoming', components: ['Posture', 'Breathing', 'Technique', 'Presentation', 'Difficulty'] },
  { id: 's6', eventId: 'rhythm-ind-sra-F', name: 'Ind. Rhythmic Sr-A Female', day: 'Day 3', time: '09:00-10:30', mat: 'Mat 1', role: 'Judge 4 of 5', status: 'Scheduled', components: ['Posture', 'Breathing', 'Technique', 'Presentation', 'Difficulty'] },
  { eventId: 'free-ind-subjr-F', name: 'Ind. Free Flow Sub-Jr Female', day: 'Day 3', time: '14:00-16:00', mat: 'Mat 3', role: 'Judge 1 of 5', status: 'Scheduled', components: ['Posture', 'Breathing', 'Technique', 'Presentation', 'Difficulty'], id: 's7' },
];

export default function JudgeMyEvents() {
  const offlineMode = useTMSStore((s) => s.offlineMode);

  return (
    <div>
      <h1 className="tms-page-title">My Assigned Events</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Judge: A. Kumar · Panel assignments for WYC 2026
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <span className="tms-badge tms-badge-draft">Draft</span>
        <span className="tms-badge tms-badge-confirmed">Confirmed</span>
        <span className="tms-badge tms-badge-live">LIVE</span>
        <span className="tms-badge tms-badge-completed">Completed</span>
      </div>

      {offlineMode && (
        <div className="tms-offline-banner" style={{ marginBottom: 16 }}>
          OFFLINE MODE · Syncing...
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {ASSIGNED_EVENTS.map((ev) => (
          <div key={ev.id || ev.eventId} className="tms-content-card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginBottom: 4 }}>{ev.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--tms-slate)' }}>
                  {ev.day} · {ev.time} · {ev.mat}
                </p>
                <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 4 }}>
                  Your Role: {ev.role} · Components: {ev.components.join(' · ')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`tms-badge tms-badge-${ev.status.toLowerCase()}`}>{ev.status}</span>
                {ev.status === 'LIVE' && (
                  <Link to={`/tms/judge/scoring/${ev.id}`}>
                    <button className="tms-btn tms-btn-primary">Enter Scoring</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
