import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminAthletes() {
  const [delegationFilter, setDelegationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [ageCategoryFilter, setAgeCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const athletesRaw = useTMSStore((s) => s.athletes);
  const delegations = useTMSStore((s) => s.delegations);
  const ageCategories = useTMSStore((s) => s.ageCategories);

  const athletes = useMemo(() => {
    return athletesRaw.filter((a) => {
      if (delegationFilter && a.delegationId !== delegationFilter) return false;
      if (genderFilter && a.gender !== genderFilter) return false;
      if (ageCategoryFilter && a.ageCategoryId !== ageCategoryFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!a.fullName.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q) && !a.regId.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [athletesRaw, delegationFilter, genderFilter, ageCategoryFilter, statusFilter, searchQuery]);

  const ageVerifiedCount = athletesRaw.filter((a) => a.status !== 'Pending Doc').length;
  const ageVerifiedPct = athletesRaw.length ? Math.round((ageVerifiedCount / athletesRaw.length) * 1000) / 10 : 0;
  const ageConflicts = athletesRaw.filter((a) => a.status === 'Pending Doc').length;

  const getDelName = (id: string) => delegations.find((d) => d.id === id)?.name || id;
  const getAgeCat = (id: string) => ageCategories.find((ac) => ac.id === id)?.label || id;

  return (
    <div>
      <h1 className="tms-page-title">Athlete Registry</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-011→012 · Imported from Registration Portal
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="tms-stat-card">
          <div className="stat-value">{athletesRaw.length}</div>
          <div className="stat-label">TOTAL ATHLETES · {delegations.length} delegations</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{ageVerifiedPct}%</div>
          <div className="stat-label">AGE VERIFIED · compliance</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{ageConflicts}</div>
          <div className="stat-label">AGE CONFLICTS · Manual review needed</div>
        </div>
      </div>

      <div className="tms-filter-bar">
        <select value={delegationFilter} onChange={(e) => setDelegationFilter(e.target.value)}>
          <option value="">All Delegations</option>
          {delegations.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">All Genders</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <select value={ageCategoryFilter} onChange={(e) => setAgeCategoryFilter(e.target.value)}>
          <option value="">All Age Categories</option>
          {ageCategories.map((ac) => (
            <option key={ac.id} value={ac.id}>{ac.label}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {[...new Set(athletesRaw.map((a) => a.status))].sort().map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="search" placeholder="Search by name, ID, Reg ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <button className="tms-btn tms-btn-outline">Bulk Import (Excel)</button>
        <button className="tms-btn tms-btn-outline" style={{ marginLeft: 8 }}>Validation Report</button>
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Reg ID</th>
              <th>Full Name</th>
              <th>Delegation</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Age</th>
              <th>Age Cat (Auto)</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((a) => (
              <tr key={a.id}>
                <td>{a.regId}</td>
                <td>{a.fullName}</td>
                <td>{getDelName(a.delegationId)}</td>
                <td>{a.gender}</td>
                <td>{a.dob}</td>
                <td>{a.age}</td>
                <td>{getAgeCat(a.ageCategoryId)}</td>
                <td>{a.status === 'Pending Doc' ? 'Review' : '✓ OK'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginTop: 16 }}>
          Age calculated as of Cut-off Date: 2026-01-01 · Auto-assigned age category based on DOB · Conflicts flagged for manual review
        </p>
        <p style={{ fontSize: 10, color: 'var(--tms-slate)', marginTop: 4 }}>FR-012: Age verification algorithm applied</p>
      </div>
    </div>
  );
}
