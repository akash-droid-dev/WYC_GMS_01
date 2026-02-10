import { useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminScoring() {
  const [sessionFilter, setSessionFilter] = useState('');

  const sessions = useTMSStore((s) => s.sessions);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getEventById = useTMSStore((s) => s.getEventById);

  const scoredSessions = sessions.filter((s) => s.startList?.some((sl) => sl.finalScore != null) || s.status === 'LIVE');
  const liveSession = sessionFilter
    ? sessions.find((s) => s.id === sessionFilter)
    : sessions.find((s) => s.status === 'LIVE') || scoredSessions[0];

  return (
    <div>
      <h1 className="tms-page-title">Scoring Administration</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-042→044 · Score monitoring, approval workflow, overrides
      </p>

      {sessions.length > 0 && (
        <div className="tms-filter-bar">
          <select value={sessionFilter || liveSession?.id} onChange={(e) => setSessionFilter(e.target.value)}>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{getEventById(s.eventId)?.name || s.eventId} · {s.matId} · {s.status}</option>
            ))}
          </select>
        </div>
      )}

      {liveSession && (
        <div className="tms-content-card">
          <h3 className="tms-section-header">{liveSession.eventId} · Score Summary</h3>
          <table className="tms-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Athlete</th>
                <th>J1</th>
                <th>J2</th>
                <th>J3</th>
                <th>J4</th>
                <th>J5</th>
                <th>Avg</th>
                <th>Deductions</th>
                <th>Final</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {liveSession.startList?.slice(0, 5).map((slot, i) => {
                const athlete = slot.athleteId ? getAthleteById(slot.athleteId) : null;
                return (
                  <tr key={slot.id}>
                    <td>{slot.order}</td>
                    <td>{athlete?.fullName || '—'}</td>
                    <td>8.5</td>
                    <td>8.3</td>
                    <td>8.7</td>
                    <td>8.4</td>
                    <td>8.6</td>
                    <td>8.50</td>
                    <td>-0.3</td>
                    <td>{slot.finalScore?.toFixed(2) || '—'}</td>
                    <td><span className={`tms-badge tms-badge-${i === 0 ? 'confirmed' : i === 1 ? 'pending' : 'draft'}`}>{i === 0 ? 'Approved' : i === 1 ? 'Scoring...' : 'Pending'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginTop: 16, padding: 12, background: '#f0fdf4', borderRadius: 6, fontSize: 14 }}>
            Score Override Applied: Arjun Yadav · J3 original 8.7 → 8.5 · Reason: "Incorrect posture assessment" · By: Tech Admin · 09:34 UTC
          </div>
          <p style={{ marginTop: 16 }}>Approval Workflow: Entered → Submitted → Chief Approved → Locked</p>
          <button className="tms-btn tms-btn-outline" style={{ marginTop: 16 }}>Audit Trail</button>
        </div>
      )}
    </div>
  );
}
