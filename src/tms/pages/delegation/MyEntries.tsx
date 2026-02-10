import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';
import AddEntryModal from '../../components/AddEntryModal';
import EntryDetailModal from '../../components/EntryDetailModal';
import type { Entry } from '../../types';

export default function DelegationEntries() {
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [viewEntry, setViewEntry] = useState<Entry | null>(null);
  const [eventFilter, setEventFilter] = useState<string>('');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [athleteFilter, setAthleteFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const entries = useTMSStore((s) => s.entries);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getEventById = useTMSStore((s) => s.getEventById);
  const teams = useTMSStore((s) => s.teams);

  const indiaEntriesBase = useMemo(() => entries.filter((e) => e.delegationId === 'IND'), [entries]);

  const getEntryDisplay = (e: Entry) => {
    if (e.athleteId) return getAthleteById(e.athleteId)?.fullName || e.athleteId;
    if (e.teamId) return teams.find((t) => t.id === e.teamId)?.name || 'Team';
    return '—';
  };

  const getEntryDiscipline = (e: Entry) => {
    const ev = getEventById(e.eventId);
    if (!ev?.disciplineId) return '—';
    if (ev.disciplineId.includes('trad')) return 'Traditional';
    if (ev.disciplineId.includes('art')) return 'Artistic';
    if (ev.disciplineId.includes('rhythm')) return 'Rhythmic';
    if (ev.disciplineId.includes('free')) return 'Free Flow';
    return ev.disciplineId;
  };

  const uniqueEvents = useMemo(() => {
    const evIds = new Set(indiaEntriesBase.map((e) => e.eventId));
    return Array.from(evIds).map((id) => ({ id, name: getEventById(id)?.name || id })).sort((a, b) => a.name.localeCompare(b.name));
  }, [indiaEntriesBase, getEventById]);

  const uniqueDisciplines = useMemo(() => {
    const set = new Set<string>();
    indiaEntriesBase.forEach((e) => {
      const d = getEventById(e.eventId)?.disciplineId;
      if (d?.includes('trad')) set.add('Traditional');
      else if (d?.includes('art')) set.add('Artistic');
      else if (d?.includes('rhythm')) set.add('Rhythmic');
      else if (d?.includes('free')) set.add('Free Flow');
    });
    return Array.from(set).sort();
  }, [indiaEntriesBase, getEventById]);

  const uniqueAthletes = useMemo(() => {
    const names: { id: string; name: string }[] = [];
    const seen = new Set<string>();
    indiaEntriesBase.forEach((e) => {
      const name = getEntryDisplay(e);
      if (name !== '—' && !seen.has(name)) {
        seen.add(name);
        names.push({ id: e.athleteId || e.teamId || '', name });
      }
    });
    return names.sort((a, b) => a.name.localeCompare(b.name));
  }, [indiaEntriesBase, getAthleteById, teams]);

  const indiaEntries = useMemo(() => {
    return indiaEntriesBase.filter((e) => {
      if (eventFilter && e.eventId !== eventFilter) return false;
      if (disciplineFilter && getEntryDiscipline(e) !== disciplineFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      if (athleteFilter) {
        const display = getEntryDisplay(e);
        if (display !== athleteFilter) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const display = getEntryDisplay(e).toLowerCase();
        const ev = getEventById(e.eventId)?.name?.toLowerCase() || '';
        if (!display.includes(q) && !ev.includes(q) && !e.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [indiaEntriesBase, eventFilter, disciplineFilter, statusFilter, athleteFilter, searchQuery, getEventById]);

  return (
    <div>
      <h1 className="tms-page-title">My Entries</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        India delegation · {indiaEntries.length} entries across 18 events
      </p>
      <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-020 Rules: Max 2 individual entries per athlete per discipline · Team entries require min 3 members · Deadline locks in 48h
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <span className="tms-badge tms-badge-draft">Draft</span>
        <span className="tms-badge tms-badge-confirmed">Confirmed</span>
        <span className="tms-badge tms-badge-locked">Locked</span>
        <span className="tms-badge tms-badge-withdrawn">Withdrawn</span>
      </div>

      <div className="tms-filter-bar">
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All Events</option>
          {uniqueEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
        <select value={disciplineFilter} onChange={(e) => setDisciplineFilter(e.target.value)}>
          <option value="">All Disciplines</option>
          {uniqueDisciplines.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All States</option>
          <option value="Draft">Draft</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Locked">Locked</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
        <select value={athleteFilter} onChange={(e) => setAthleteFilter(e.target.value)}>
          <option value="">All Athletes</option>
          {uniqueAthletes.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </select>
        <input type="search" placeholder="Search by name, event, ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Event</th>
              <th>Athlete(s)</th>
              <th>Discipline</th>
              <th>Age/Gender</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {indiaEntries.map((e) => {
              const ev = getEventById(e.eventId);
              return (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{ev?.name || e.eventId}</td>
                  <td>{getEntryDisplay(e)}</td>
                  <td>{getEntryDiscipline(e)}</td>
                  <td>Sub-Jr / {e.type === 'Pair' || e.type === 'Group' ? 'F' : 'M'}</td>
                  <td><span className={`tms-badge tms-badge-${e.status.toLowerCase()}`}>{e.status}</span></td>
                  <td>
                    {e.status !== 'Withdrawn' ? (
                      <>
                        <button className="tms-btn tms-btn-outline" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setViewEntry(e)}>View</button>
                        {e.status === 'Draft' && <button className="tms-btn tms-btn-outline" style={{ padding: '4px 8px', fontSize: 12, marginLeft: 4 }}>Edit</button>}
                      </>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAddEntry(true)}>+ New Entry</button>
      </div>
      <AddEntryModal isOpen={showAddEntry} onClose={() => setShowAddEntry(false)} delegationId="IND" />
      <EntryDetailModal isOpen={!!viewEntry} onClose={() => setViewEntry(null)} entry={viewEntry} />
    </div>
  );
}
