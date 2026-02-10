import { useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function PublicMedalTable() {
  const [view, setView] = useState<'country' | 'athlete'>('country');
  const medalTable = useTMSStore((s) => s.medalTable);
  const delegations = useTMSStore((s) => s.delegations);

  const withNames = medalTable.map((m) => ({
    ...m,
    name: delegations.find((d) => d.id === m.delegationId)?.name || m.delegationId,
  }));

  return (
    <div>
      <h1 className="tms-page-title">Medal Table</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>WYC 2026 · All disciplines combined</p>

      <div className="tms-tabs">
        <button
          className={`tms-tab ${view === 'country' ? 'active' : ''}`}
          onClick={() => setView('country')}
        >
          By Country
        </button>
        <button
          className={`tms-tab ${view === 'athlete' ? 'active' : ''}`}
          onClick={() => setView('athlete')}
        >
          By Athlete
        </button>
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Country</th>
              <th className="tms-medal-gold">Gold</th>
              <th className="tms-medal-silver">Silver</th>
              <th className="tms-medal-bronze">Bronze</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {withNames.map((m, i) => (
              <tr key={m.delegationId}>
                <td><strong>{i + 1}</strong></td>
                <td>{m.name}</td>
                <td className="tms-medal-gold">{m.gold}</td>
                <td className="tms-medal-silver">{m.silver}</td>
                <td className="tms-medal-bronze">{m.bronze}</td>
                <td><strong>{m.total}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 16 }}>
          FR-051/052 · Medal table auto-updates as results are finalized. Last updated: 16:45 UTC.
        </p>
      </div>
    </div>
  );
}
