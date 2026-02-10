import { useParams, Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

export default function PublicLiveResults() {
  const { eventId } = useParams<{ eventId?: string }>();
  const sessions = useTMSStore((s) => s.sessions);
  const getEventById = useTMSStore((s) => s.getEventById);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getDelegationById = useTMSStore((s) => s.getDelegationById);
  const getResultByEvent = useTMSStore((s) => s.getResultByEvent);

  const activeEventId = eventId || 'trad-ind-subjr-M';
  const result = getResultByEvent(activeEventId);
  const ev = getEventById(activeEventId);
  const liveSession = sessions.find((s) => s.eventId === activeEventId);

  return (
    <div>
      <h1 className="tms-page-title">Live Results</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 16 }}>{ev?.name || activeEventId}</p>
      <p style={{ fontSize: 14, marginBottom: 24 }}>
        Mat 1 · Day 2 · 18 athletes · Scoring in progress
        {liveSession?.status === 'LIVE' && <span className="tms-badge tms-badge-live" style={{ marginLeft: 8 }}>LIVE</span>}
      </p>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Athlete</th>
              <th>Country</th>
              <th>Posture</th>
              <th>Breathing</th>
              <th>Technique</th>
              <th>Presentation</th>
              <th>Difficulty</th>
              <th>Deductions</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {result?.rankings.slice(0, 6).map((r) => {
              const athlete = r.athleteId ? getAthleteById(r.athleteId) : null;
              const del = getDelegationById(r.delegationId);
              return (
                <tr key={r.rank}>
                  <td><strong>#{r.rank}</strong></td>
                  <td>{athlete?.fullName || `Team ${r.delegationId}`}</td>
                  <td>{del?.name || r.delegationId}</td>
                  <td>8.5</td>
                  <td>7.8</td>
                  <td>8.2</td>
                  <td>9.0</td>
                  <td>8.8</td>
                  <td>-0.2</td>
                  <td><strong>{r.totalScore.toFixed(1)}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 16 }}>
          Results Version: 2 (Provisional) · Last updated: 10:15:32 UTC · FR-050
        </p>
        <p style={{ fontSize: 12, color: 'var(--tms-saffron)', marginTop: 4 }}>
          Protest window: Open until 11:30 UTC · Scores subject to change · FR-054
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 className="tms-section-header">Other Events</h3>
        {sessions.slice(0, 4).map((s) => {
          const e = getEventById(s.eventId);
          return (
            <Link
              key={s.id}
              to={`/tms/results?event=${s.eventId}`}
              style={{ display: 'block', marginBottom: 8, color: 'var(--tms-teal)' }}
            >
              {e?.name || s.eventId}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
