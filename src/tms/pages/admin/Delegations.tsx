import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';
import AddDelegationModal from '../../components/AddDelegationModal';

export default function AdminDelegations() {
  const [showAddDelegation, setShowAddDelegation] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [athleteCountFilter, setAthleteCountFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const delegationsRaw = useTMSStore((s) => s.delegations);
  const athletes = useTMSStore((s) => s.athletes);

  const totalAthletes = athletes.length;
  const maleCount = athletes.filter((a) => a.gender === 'M').length;
  const femaleCount = athletes.filter((a) => a.gender === 'F').length;

  const delegations = useMemo(() => {
    return delegationsRaw.filter((d) => {
      if (countryFilter && d.id !== countryFilter) return false;
      if (statusFilter && d.status !== statusFilter) return false;
      if (athleteCountFilter) {
        const parts = athleteCountFilter.split('-');
        const min = Number(parts[0]);
        const max = parts[1] ? Number(parts[1]) : undefined;
        if (max !== undefined && (d.athleteCount < min || d.athleteCount > max)) return false;
        if (max === undefined && d.athleteCount < min) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.code.toLowerCase().includes(q) && !d.headOfDelegation.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [delegationsRaw, countryFilter, statusFilter, athleteCountFilter, searchQuery]);

  const uniqueStatuses = useMemo(() => [...new Set(delegationsRaw.map((d) => d.status))].sort(), [delegationsRaw]);

  return (
    <div>
      <h1 className="tms-page-title">Delegation Management</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-010→014 · Country/State delegations, athlete rostering
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="tms-stat-card">
          <div className="stat-value">{delegations.length}</div>
          <div className="stat-label">DELEGATIONS · 40 countries + 2 host states</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{totalAthletes}</div>
          <div className="stat-label">ATHLETES · {maleCount} M · {femaleCount} F</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">PENDING IMPORTS · From registration portal</div>
        </div>
      </div>

      <div className="tms-filter-bar">
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
          <option value="">All Countries</option>
          {delegationsRaw.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {uniqueStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={athleteCountFilter} onChange={(e) => setAthleteCountFilter(e.target.value)}>
          <option value="">All Sizes</option>
          <option value="0-10">0-10 athletes</option>
          <option value="11-25">11-25 athletes</option>
          <option value="26-50">26-50 athletes</option>
          <option value="51-">51+ athletes</option>
        </select>
        <input type="search" placeholder="Search by name, code, HoD..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Delegation Name</th>
              <th>Head of Del.</th>
              <th>Athletes</th>
              <th>Entries</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {delegations.map((d) => (
              <tr key={d.id}>
                <td>{d.code}</td>
                <td>{d.name}</td>
                <td>{d.headOfDelegation}</td>
                <td>{d.athleteCount}</td>
                <td>{d.entryCount}</td>
                <td><span className={`tms-badge tms-badge-${d.status.toLowerCase()}`}>{d.status}</span></td>
                <td>
                  <Link to={`/tms/admin/delegations/${d.id}`} style={{ marginRight: 8, color: 'var(--tms-teal)' }}>Edit</Link>
                  <Link to={`/tms/admin/delegations/${d.id}`} style={{ color: 'var(--tms-teal)' }}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAddDelegation(true)}>＋ Add Delegation</button>
        <button className="tms-btn tms-btn-outline" style={{ marginTop: 16, marginLeft: 8 }}>Import from Reg.</button>
      </div>
      <AddDelegationModal isOpen={showAddDelegation} onClose={() => setShowAddDelegation(false)} />
    </div>
  );
}
