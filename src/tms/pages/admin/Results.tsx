import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminResults() {
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const resultsRaw = useTMSStore((s) => s.results);
  const medalEvents = useTMSStore((s) => s.medalEvents);
  const getEventById = useTMSStore((s) => s.getEventById);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getDelegationById = useTMSStore((s) => s.getDelegationById);

  const results = useMemo(() => {
    return resultsRaw.filter((r) => {
      if (eventFilter && r.eventId !== eventFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const evName = getEventById(r.eventId)?.name?.toLowerCase() || '';
        const matchRanking = r.rankings.some((rk) => {
          const athlete = rk.athleteId ? getAthleteById(rk.athleteId) : null;
          const del = getDelegationById(rk.delegationId);
          return athlete?.fullName.toLowerCase().includes(q) || del?.name?.toLowerCase().includes(q);
        });
        if (!evName.includes(q) && !matchRanking) return false;
      }
      return true;
    });
  }, [resultsRaw, eventFilter, statusFilter, searchQuery, getEventById, getAthleteById, getDelegationById]);

  const firstResult = results[0];

  return (
    <div>
      <h1 className="tms-page-title">Results Management</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-045, FR-050 · Rankings, tie-breaks, version control, publishing
      </p>

      <div className="tms-filter-bar">
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All Events</option>
          {[...new Set(resultsRaw.map((r) => r.eventId))].map((eventId) => {
            const ev = getEventById(eventId);
            return <option key={eventId} value={eventId}>{ev?.name || eventId}</option>;
          })}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Provisional">Provisional</option>
          <option value="Official">Official</option>
          <option value="Under Protest">Under Protest</option>
          <option value="Revised">Revised</option>
        </select>
        <input type="search" placeholder="Search by event, athlete, delegation..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {results.length === 0 && (
        <div className="tms-content-card">
          <p style={{ color: 'var(--tms-slate)' }}>No results match your filters.</p>
        </div>
      )}
      {firstResult && (
        <div className="tms-content-card">
          <h3 className="tms-section-header">
            {getEventById(firstResult.eventId)?.name || firstResult.eventId} · Results v{firstResult.version} (Published)
          </h3>
          <span className="tms-badge tms-badge-confirmed" style={{ marginLeft: 8 }}>PUBLISHED</span>
          <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 4 }}>Published: {new Date(firstResult.publishedAt).toLocaleString()}</p>
          <table className="tms-table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Athlete</th>
                <th>Delegation</th>
                <th>Final</th>
                <th>Avg</th>
                <th>Ded</th>
                <th>Tie-break</th>
              </tr>
            </thead>
            <tbody>
              {firstResult.rankings.map((r) => {
                const athlete = r.athleteId ? getAthleteById(r.athleteId) : null;
                const del = getDelegationById(r.delegationId);
                return (
                  <tr key={r.rank}>
                    <td>{r.rank}</td>
                    <td>{athlete?.fullName || 'Team'}</td>
                    <td>{del?.code || r.delegationId}</td>
                    <td>{r.totalScore.toFixed(2)}</td>
                    <td>8.50</td>
                    <td>-0.30</td>
                    <td>{r.tieBreakReason || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 16 }}>
            Version History: v1 · 10:15 UTC (Initial) → v2 · 10:22 UTC (Override applied, re-ranked)
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="tms-btn tms-btn-primary">Publish v3</button>
            <button className="tms-btn tms-btn-outline">Export PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}
