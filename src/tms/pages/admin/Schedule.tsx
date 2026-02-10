import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

const DAY_LABELS: Record<string, string> = { d1: 'Jun 4', d2: 'Jun 6', d3: 'Jun 8' };

export default function AdminSchedule() {
  const sessions = useTMSStore((s) => s.sessions);
  const getEventById = useTMSStore((s) => s.getEventById);
  const dayIds = useMemo(() => [...new Set(sessions.map((s) => s.dayId))].sort(), [sessions]);
  const [day, setDay] = useState(dayIds[0] || 'd1');

  return (
    <div>
      <h1 className="tms-page-title">Schedule Builder</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-030→033 · Day/Session/Venue scheduling, start list generation
      </p>

      <div className="tms-tabs">
        {dayIds.map((d, i) => (
          <button
            key={d}
            className={`tms-tab ${day === d ? 'active' : ''}`}
            onClick={() => setDay(d)}
          >
            Day {i + 1} · {DAY_LABELS[d] || d}
          </button>
        ))}
      </div>

      <div className="tms-content-card" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(3, 1fr)', gap: 8, minWidth: 600 }}>
          <div style={{ fontWeight: 600 }}>Time</div>
          <div style={{ fontWeight: 600 }}>Mat 1</div>
          <div style={{ fontWeight: 600 }}>Mat 2</div>
          <div style={{ fontWeight: 600 }}>Mat 3</div>

          {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => {
            const mat1 = sessions.find((s) => s.dayId === day && s.startTime.startsWith(time.slice(0, 2)) && s.matId === 'Mat 1');
            const mat2 = sessions.find((s) => s.dayId === day && s.startTime.startsWith(time.slice(0, 2)) && s.matId === 'Mat 2');
            const mat3 = sessions.find((s) => s.dayId === day && s.startTime.startsWith(time.slice(0, 2)) && s.matId === 'Mat 3');
            return (
              <div key={time} style={{ display: 'contents' }}>
                <div style={{ padding: 8 }}>{time}</div>
                <div style={{ padding: 8, background: '#f8fafc', borderRadius: 4, minHeight: 60 }}>
                  {mat1 && (
                    <Link to={`/tms/event/${mat1.eventId}`} style={{ fontSize: 12, color: 'var(--tms-green)', textDecoration: 'none' }}>
                      {getEventById(mat1.eventId)?.name || mat1.eventId} · {mat1.startList?.length || 0} athletes
                    </Link>
                  )}
                </div>
                <div style={{ padding: 8, background: '#f8fafc', borderRadius: 4, minHeight: 60 }}>
                  {mat2 && (
                    <Link to={`/tms/event/${mat2.eventId}`} style={{ fontSize: 12, color: 'var(--tms-green)', textDecoration: 'none' }}>
                      {getEventById(mat2.eventId)?.name || mat2.eventId} · {mat2.startList?.length || 0} athletes
                    </Link>
                  )}
                </div>
                <div style={{ padding: 8, background: '#f8fafc', borderRadius: 4, minHeight: 60 }}>
                  {mat3 && (
                    <Link to={`/tms/event/${mat3.eventId}`} style={{ fontSize: 12, color: 'var(--tms-green)', textDecoration: 'none' }}>
                      {getEventById(mat3.eventId)?.name || mat3.eventId} · {mat3.startList?.length || 0} athletes
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, padding: 12, background: '#fef3c7', borderRadius: 6 }}>
          ⚠ 1 Conflict: Athlete A-142 scheduled in 2 events at 09:00 (Mat 1 & Mat 2) · Click to resolve
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="tms-btn tms-btn-primary">Generate Start Lists</button>
          <button className="tms-btn tms-btn-success">Publish v3</button>
        </div>
      </div>
    </div>
  );
}
