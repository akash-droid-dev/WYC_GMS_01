import { useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminLiveOps() {
  const [sessionFilter, setSessionFilter] = useState('');

  const sessions = useTMSStore((s) => s.sessions);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getDelegationById = useTMSStore((s) => s.getDelegationById);
  const getEventById = useTMSStore((s) => s.getEventById);
  const checkIn = useTMSStore((s) => s.checkIn);

  const activeSessions = sessions.filter((s) => s.status === 'LIVE' || s.status === 'Upcoming');
  const liveSession = sessionFilter
    ? sessions.find((s) => s.id === sessionFilter)
    : sessions.find((s) => s.status === 'LIVE') || activeSessions[0];

  return (
    <div>
      <h1 className="tms-page-title">Live Operations Dashboard</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-040 · Check-in, live session monitoring, grace periods
      </p>

      {activeSessions.length > 0 && (
        <div className="tms-filter-bar">
          <select value={sessionFilter || liveSession?.id} onChange={(e) => setSessionFilter(e.target.value)}>
            {activeSessions.map((s) => (
              <option key={s.id} value={s.id}>{getEventById(s.eventId)?.name || s.eventId} · {s.matId} · {s.status}</option>
            ))}
          </select>
        </div>
      )}

      {liveSession && (
        <div className="tms-content-card" style={{ marginBottom: 24 }}>
          <h3 className="tms-section-header">
            LIVE · {liveSession.eventId} · {liveSession.matId}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--tms-slate)' }}>
            Started: 09:00 · Estimated end: 10:30
          </p>
          <table className="tms-table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Athlete ID</th>
                <th>Name</th>
                <th>Country</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveSession.startList?.slice(0, 6).map((slot) => {
                const athlete = slot.athleteId ? getAthleteById(slot.athleteId) : null;
                const del = athlete ? getDelegationById(athlete.delegationId) : null;
                return (
                  <tr key={slot.id}>
                    <td>{slot.order}</td>
                    <td>{athlete?.id || '—'}</td>
                    <td>{athlete?.fullName || '—'}</td>
                    <td>{del?.code || '—'}</td>
                    <td><span className={`tms-badge tms-badge-${slot.checkInStatus.toLowerCase().replace('-', '-')}`}>{slot.checkInStatus}</span></td>
                    <td>
                      {slot.checkInStatus === 'Pending' && (
                        <>
                          <button className="tms-btn tms-btn-success" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => checkIn(slot.id, liveSession.id, 'Checked-in')}>✓ Check-In</button>
                          <button className="tms-btn tms-btn-danger" style={{ padding: '4px 8px', fontSize: 12, marginLeft: 4 }} onClick={() => checkIn(slot.id, liveSession.id, 'No-show')}>✗ No-Show</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="tms-btn tms-btn-success">✓ Check-In Selected</button>
            <button className="tms-btn tms-btn-danger">✗ Mark No-Show</button>
            <button className="tms-btn tms-btn-outline">Skip to Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
