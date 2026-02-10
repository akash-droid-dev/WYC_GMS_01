import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminMedals() {
  const [mode, setMode] = useState<'events' | 'units'>('events');
  const [delegationFilter, setDelegationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const medalTableRaw = useTMSStore((s) => s.medalTable);
  const delegations = useTMSStore((s) => s.delegations);

  const withNames = useMemo(() => medalTableRaw.map((m) => ({
    ...m,
    name: delegations.find((d) => d.id === m.delegationId)?.name || m.delegationId,
  })), [medalTableRaw, delegations]);

  const filteredMedals = useMemo(() => {
    return withNames.filter((m) => {
      if (delegationFilter && m.delegationId !== delegationFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!m.name.toLowerCase().includes(q) && !m.delegationId.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [withNames, delegationFilter, searchQuery]);

  return (
    <div>
      <h1 className="tms-page-title">Medal Tally</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-051→052 · Medal allocation, medal-events vs medal-units toggle
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button className={`tms-btn ${mode === 'events' ? 'tms-btn-primary' : 'tms-btn-outline'}`} onClick={() => setMode('events')}>
          Medal Events
        </button>
        <button className={`tms-btn ${mode === 'units' ? 'tms-btn-primary' : 'tms-btn-outline'}`} onClick={() => setMode('units')}>
          Medal Units
        </button>
      </div>

      <div className="tms-filter-bar">
        <select value={delegationFilter} onChange={(e) => setDelegationFilter(e.target.value)}>
          <option value="">All Delegations</option>
          {delegations.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <input type="search" placeholder="Search by delegation name or code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div className="tms-content-card">
          <table className="tms-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Delegation</th>
                <th className="tms-medal-gold">Gold</th>
                <th className="tms-medal-silver">Silver</th>
                <th className="tms-medal-bronze">Bronze</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedals.map((m, i) => (
                <tr key={m.delegationId}>
                  <td>{i + 1}</td>
                  <td>{m.name}</td>
                  <td className="tms-medal-gold">{m.gold}</td>
                  <td className="tms-medal-silver">{m.silver}</td>
                  <td className="tms-medal-bronze">{m.bronze}</td>
                  <td><strong>{m.total}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="tms-btn tms-btn-outline" style={{ marginTop: 16 }}>Export Medal Report</button>
        </div>
        <div className="tms-content-card">
          <h3 className="tms-section-header">Top 5 by Gold</h3>
          {[...filteredMedals].sort((a, b) => b.gold - a.gold).slice(0, 5).map((m) => (
            <div key={m.delegationId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{m.name}</span>
              <span className="tms-medal-gold">{m.gold}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
