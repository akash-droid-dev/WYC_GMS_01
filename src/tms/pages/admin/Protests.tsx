import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminProtests() {
  const [selected, setSelected] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const protestsRaw = useTMSStore((s) => s.protests);
  const getEventById = useTMSStore((s) => s.getEventById);
  const updateProtestStatus = useTMSStore((s) => s.updateProtestStatus);

  const protests = useMemo(() => {
    return protestsRaw.filter((p) => {
      if (eventFilter && p.eventId !== eventFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const evName = getEventById(p.eventId)?.name?.toLowerCase() || '';
        if (!p.id.toLowerCase().includes(q) && !evName.includes(q) && !p.filedBy.toLowerCase().includes(q) && !p.subject.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [protestsRaw, eventFilter, statusFilter, searchQuery, getEventById]);

  const pending = protestsRaw.filter((p) => p.status === 'Pending').length;
  const upheld = protestsRaw.filter((p) => p.status === 'Upheld').length;
  const dismissed = protestsRaw.filter((p) => p.status === 'Dismissed').length;

  const selectedProtest = protestsRaw.find((p) => p.id === selected);

  const uniqueEventIds = useMemo(() => [...new Set(protestsRaw.map((p) => p.eventId))], [protestsRaw]);

  return (
    <div>
      <h1 className="tms-page-title">Protest Management</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-054 · Filing, evidence, decisions, result re-versioning
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="tms-stat-card">
          <div className="stat-value">{protests.length}</div>
          <div className="stat-label">TOTAL PROTESTS · This championship</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{pending}</div>
          <div className="stat-label">PENDING · Awaiting decision</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{upheld}</div>
          <div className="stat-label">UPHELD · Results re-versioned</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{dismissed}</div>
          <div className="stat-label">DISMISSED · No changes</div>
        </div>
      </div>

      <div className="tms-filter-bar">
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All Events</option>
          {uniqueEventIds.map((eventId) => (
            <option key={eventId} value={eventId}>{getEventById(eventId)?.name || eventId}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Upheld">Upheld</option>
          <option value="Dismissed">Dismissed</option>
          <option value="Partial">Partial</option>
        </select>
        <input type="search" placeholder="Search by ID, event, filed by, subject..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="tms-content-card">
          <table className="tms-table">
            <thead>
              <tr>
                <th>Protest ID</th>
                <th>Event</th>
                <th>Filed By</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {protests.map((p) => (
                <tr key={p.id} style={{ background: selected === p.id ? '#f0f9ff' : undefined }}>
                  <td>{p.id}</td>
                  <td>{getEventById(p.eventId)?.name || p.eventId}</td>
                  <td>{p.filedBy}</td>
                  <td>{p.subject}</td>
                  <td><span className={`tms-badge tms-badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                  <td>
                    <button className="tms-btn tms-btn-outline" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setSelected(p.id)}>
                      {p.status === 'Pending' ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedProtest && (
          <div className="tms-content-card">
            <h3 className="tms-section-header">{selectedProtest.id} · Score Dispute Detail</h3>
            <p><strong>Event:</strong> {getEventById(selectedProtest.eventId)?.name || selectedProtest.eventId}</p>
            <p><strong>Filed by:</strong> {selectedProtest.filedBy} · {new Date(selectedProtest.filedAt).toLocaleString()}</p>
            <p><strong>Subject:</strong> {selectedProtest.subject}</p>
            <p style={{ marginTop: 12 }}><strong>Evidence Attached:</strong></p>
            <ul>{selectedProtest.evidence.map((e, i) => <li key={i}>{e}</li>)}</ul>
            <p><strong>Decision Authority:</strong> Chief Judge · J. Singh</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="tms-btn tms-btn-success" onClick={() => selectedProtest && updateProtestStatus(selectedProtest.id, 'Upheld')}>Upheld</button>
              <button className="tms-btn tms-btn-danger" onClick={() => selectedProtest && updateProtestStatus(selectedProtest.id, 'Dismissed')}>Dismissed</button>
              <button className="tms-btn tms-btn-warning" onClick={() => selectedProtest && updateProtestStatus(selectedProtest.id, 'Partial')}>Partial</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 12 }}>
              If upheld: Results will be re-versioned automatically · Audit trail recorded
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
