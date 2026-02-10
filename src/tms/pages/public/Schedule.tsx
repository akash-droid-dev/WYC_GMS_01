import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

const DAYS = [
  { id: 'd1', label: 'Day 1', date: 'Jun 4' },
  { id: 'd2', label: 'Day 2', date: 'Jun 6' },
  { id: 'd3', label: 'Day 3', date: 'Jun 8' },
];

export default function PublicSchedule() {
  const [day, setDay] = useState('d1');
  const sessions = useTMSStore((s) => s.sessions);
  const getEventById = useTMSStore((s) => s.getEventById);
  const daySessions = sessions.filter((s) => s.dayId === day);

  return (
    <div>
      <h1 className="tms-page-title">Competition Schedule</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>3-day program · 56 events · 4 venues</p>

      <div className="tms-tabs">
        {DAYS.map((d) => (
          <button
            key={d.id}
            className={`tms-tab ${day === d.id ? 'active' : ''}`}
            onClick={() => setDay(d.id)}
          >
            {d.label} · {d.date}
          </button>
        ))}
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Mat</th>
              <th>Event</th>
              <th>Category</th>
              <th>Participants</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {daySessions.map((s) => {
              const ev = getEventById(s.eventId) || { name: s.eventId, type: 'Individual' };
              const participants = s.startList?.length || 0;
              return (
                <tr key={s.id}>
                  <td>{s.startTime} – {s.endTime}</td>
                  <td>{s.matId}</td>
                  <td><Link to={`/tms/event/${s.eventId}`} style={{ color: 'var(--tms-teal)' }}>{ev.name}</Link></td>
                  <td>{ev.type}</td>
                  <td>{participants}</td>
                  <td>
                    <span className={`tms-badge tms-badge-${s.status.toLowerCase().replace(' ', '-')}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 16 }}>
          Schedule v3 · Published 2026-06-14 08:00 UTC · FR-030
        </p>
      </div>
    </div>
  );
}
