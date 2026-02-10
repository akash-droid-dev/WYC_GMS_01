import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';
import AddEntryModal from '../../components/AddEntryModal';
import EntryDetailModal from '../../components/EntryDetailModal';
import type { Entry } from '../../types';

export default function AdminEntries() {
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [viewEntry, setViewEntry] = useState<Entry | null>(null);
  const [eventFilter, setEventFilter] = useState('');
  const [delegationFilter, setDelegationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const entriesRaw = useTMSStore((s) => s.entries);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getDelegationById = useTMSStore((s) => s.getDelegationById);
  const getEventById = useTMSStore((s) => s.getEventById);
  const teams = useTMSStore((s) => s.teams);
  const delegations = useTMSStore((s) => s.delegations);
  const confirmEntry = useTMSStore((s) => s.confirmEntry);
  const withdrawEntry = useTMSStore((s) => s.withdrawEntry);

  const getEntryDisplay = (e: Entry) => {
    if (e.athleteId) return getAthleteById(e.athleteId)?.fullName || e.athleteId;
    if (e.teamId) return teams.find((t) => t.id === e.teamId)?.name || 'Team';
    return '—';
  };

  const uniqueEvents = useMemo(() => {
    const evIds = new Set(entriesRaw.map((e) => e.eventId));
    return Array.from(evIds).map((id) => ({ id, name: getEventById(id)?.name || id })).sort((a, b) => a.name.localeCompare(b.name));
  }, [entriesRaw, getEventById]);

  const entries = useMemo(() => {
    return entriesRaw.filter((e) => {
      if (eventFilter && e.eventId !== eventFilter) return false;
      if (delegationFilter && e.delegationId !== delegationFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      if (typeFilter && e.type !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const display = getEntryDisplay(e).toLowerCase();
        const delName = getDelegationById(e.delegationId)?.name?.toLowerCase() || '';
        const evName = getEventById(e.eventId)?.name?.toLowerCase() || '';
        if (!display.includes(q) && !delName.includes(q) && !evName.includes(q) && !e.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [entriesRaw, eventFilter, delegationFilter, statusFilter, typeFilter, searchQuery, getAthleteById, getDelegationById, getEventById, teams]);

  const confirmed = entriesRaw.filter((e) => e.status === 'Confirmed' || e.status === 'Locked');
  const draft = entriesRaw.filter((e) => e.status === 'Draft');
  const withdrawn = entriesRaw.filter((e) => e.status === 'Withdrawn');

  return (
    <div>
      <h1 className="tms-page-title">Entry Management</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-020→023 · Entry lifecycle: Draft → Confirmed → Withdrawn/DQ
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="tms-stat-card">
          <div className="stat-value">{entries.length}</div>
          <div className="stat-label">TOTAL ENTRIES · Individual+Team</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{confirmed.length}</div>
          <div className="stat-label">CONFIRMED</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{draft.length}</div>
          <div className="stat-label">DRAFT · Pending confirmation</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{withdrawn.length}</div>
          <div className="stat-label">WITHDRAWN/DQ</div>
        </div>
      </div>

      <div className="tms-filter-bar">
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All Events</option>
          {uniqueEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
        <select value={delegationFilter} onChange={(e) => setDelegationFilter(e.target.value)}>
          <option value="">All Delegations</option>
          {delegations.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Locked">Locked</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="Individual">Individual</option>
          <option value="Pair">Pair</option>
          <option value="Group">Group</option>
        </select>
        <input type="search" placeholder="Search by athlete, delegation, event..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <button className="tms-btn tms-btn-primary" onClick={() => setShowAddEntry(true)}>＋ New Entry</button>
        <button className="tms-btn tms-btn-outline" style={{ marginLeft: 8 }}>Bulk Import</button>
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Event Code</th>
              <th>Athlete/Team</th>
              <th>Delegation</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.eventId}</td>
                <td>{getEntryDisplay(e)}</td>
                <td>{getDelegationById(e.delegationId)?.name || e.delegationId}</td>
                <td>{e.type}</td>
                <td><span className={`tms-badge tms-badge-${e.status.toLowerCase()}`}>{e.status}</span></td>
                <td>
                  <button className="tms-btn tms-btn-outline" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setViewEntry(e)}>View</button>
                  {e.status === 'Draft' && <button className="tms-btn tms-btn-success" style={{ padding: '4px 8px', fontSize: 12, marginLeft: 4 }} onClick={() => confirmEntry(e.id)}>Confirm</button>}
                  {e.status === 'Confirmed' && <button className="tms-btn tms-btn-danger" style={{ padding: '4px 8px', fontSize: 12, marginLeft: 4 }} onClick={() => withdrawEntry(e.id)}>Withdraw</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 10, color: 'var(--tms-slate)', marginTop: 12 }}>
          FR-020: Entry limits per athlete per event · FR-021: Eligibility blocking · FR-022: Bulk import · FR-023: Withdrawal/replacement
        </p>
      </div>
      <AddEntryModal isOpen={showAddEntry} onClose={() => setShowAddEntry(false)} />
      <EntryDetailModal isOpen={!!viewEntry} onClose={() => setViewEntry(null)} entry={viewEntry} />
    </div>
  );
}
