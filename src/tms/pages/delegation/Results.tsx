import { useMemo } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function DelegationResults() {
  const results = useTMSStore((s) => s.results);
  const indiaResults = useMemo(
    () => results.flatMap((r) =>
      r.rankings
        .filter((rk) => rk.delegationId === 'IND')
        .map((ranking) => ({ result: r, ranking }))
    ),
    [results]
  );
  const getEventById = useTMSStore((s) => s.getEventById);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const teams = useTMSStore((s) => s.teams);

  const goldCount = indiaResults.filter((r) => r.ranking.medal === 'Gold').length;
  const silverCount = indiaResults.filter((r) => r.ranking.medal === 'Silver').length;
  const bronzeCount = indiaResults.filter((r) => r.ranking.medal === 'Bronze').length;

  const getDisplayName = (r: typeof indiaResults[0]) => {
    if (r.ranking.athleteId) return getAthleteById(r.ranking.athleteId)?.fullName;
    if (r.ranking.teamId) return teams.find((t) => t.id === r.ranking.teamId)?.name || 'Team';
    return '—';
  };

  return (
    <div>
      <h1 className="tms-page-title">Results · My Delegation</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        India results across completed events
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="tms-stat-card">
          <div className="stat-value tms-medal-gold">{goldCount}</div>
          <div className="stat-label">Gold</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value tms-medal-silver">{silverCount}</div>
          <div className="stat-label">Silver</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value tms-medal-bronze">{bronzeCount}</div>
          <div className="stat-label">Bronze</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{goldCount + silverCount + bronzeCount}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Athlete</th>
              <th>Rank</th>
              <th>Score</th>
              <th>Medal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {indiaResults.map(({ result, ranking }) => {
              const ev = getEventById(result.eventId);
              return (
                <tr key={`${result.id}-${ranking.rank}`}>
                  <td>{ev?.name || result.eventId}</td>
                  <td>{getDisplayName({ result, ranking })}</td>
                  <td>#{ranking.rank}</td>
                  <td>{ranking.totalScore}</td>
                  <td className={ranking.medal ? `tms-medal-${ranking.medal.toLowerCase()}` : ''}>{ranking.medal || '—'}</td>
                  <td><span className="tms-badge tms-badge-final">{result.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--tms-saffron)', marginTop: 16 }}>
          Protest Window Open · Group Rhythmic Jr-B results are provisional. Protest deadline: 17:00 UTC today. File via Protests tab.
        </p>
        <p style={{ fontSize: 10, color: 'var(--tms-slate)', marginTop: 4 }}>FR-054</p>
      </div>
    </div>
  );
}
