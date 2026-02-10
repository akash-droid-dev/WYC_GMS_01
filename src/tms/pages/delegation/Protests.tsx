import { useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';
import FileProtestModal from '../../components/FileProtestModal';

export default function DelegationProtests() {
  const [showFileProtest, setShowFileProtest] = useState(false);
  const protests = useTMSStore((s) => s.protests);
  const indiaProtests = protests.filter((p) => p.filedBy === 'IND');
  const getEventById = useTMSStore((s) => s.getEventById);

  return (
    <div>
      <h1 className="tms-page-title">Protests</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        File and track protests for your delegation
      </p>

      {indiaProtests.length === 0 ? (
        <div className="tms-content-card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ marginBottom: 16 }}>No protests filed by India</p>
          <button className="tms-btn tms-btn-primary" onClick={() => setShowFileProtest(true)}>File Protest</button>
        </div>
      ) : (
        <div className="tms-content-card">
          <table className="tms-table">
            <thead>
              <tr>
                <th>Protest ID</th>
                <th>Event</th>
                <th>Subject</th>
                <th>Filed At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {indiaProtests.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{getEventById(p.eventId)?.name || p.eventId}</td>
                  <td>{p.subject}</td>
                  <td>{new Date(p.filedAt).toLocaleString()}</td>
                  <td><span className={`tms-badge tms-badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                  <td><button className="tms-btn tms-btn-outline" style={{ padding: '4px 8px', fontSize: 12 }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={() => setShowFileProtest(true)}>File Protest</button>
        </div>
      )}
      <FileProtestModal isOpen={showFileProtest} onClose={() => setShowFileProtest(false)} />

      <div style={{ marginTop: 24 }}>
        <h3 className="tms-section-header">How to file a protest</h3>
        <p style={{ fontSize: 14, color: 'var(--tms-slate)' }}>
          FR-054 · Select the event and performance slot. Provide reason (structured + free text) and attach evidence (documents, photos, video). 
          The decision authority (Chief Judge / Jury) will review. If upheld, results will be re-versioned automatically.
        </p>
      </div>
    </div>
  );
}
