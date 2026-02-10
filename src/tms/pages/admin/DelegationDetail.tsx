import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';
import AddAthleteModal from '../../components/AddAthleteModal';

export default function AdminDelegationDetail() {
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageCategoryFilter, setAgeCategoryFilter] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { delegationId } = useParams<{ delegationId: string }>();
  const delegation = useTMSStore((s) => s.delegations.find((d) => d.id === delegationId));
  const athletesRaw = useTMSStore((s) => s.athletes.filter((a) => a.delegationId === (delegationId || '')));
  const entries = useTMSStore((s) => s.entries.filter((e) => e.delegationId === delegationId));
  const teams = useTMSStore((s) => s.teams.filter((t) => t.delegationId === delegationId));
  const ageCategories = useTMSStore((s) => s.ageCategories);

  const athletes = useMemo(() => {
    return athletesRaw.filter((a) => {
      if (genderFilter && a.gender !== genderFilter) return false;
      if (ageCategoryFilter && a.ageCategoryId !== ageCategoryFilter) return false;
      if (disciplineFilter && !a.disciplines.includes(disciplineFilter)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!a.fullName.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q) && !a.regId.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [athletesRaw, genderFilter, ageCategoryFilter, disciplineFilter, statusFilter, searchQuery]);

  const uniqueDisciplines = useMemo(() => {
    const set = new Set<string>();
    athletesRaw.forEach((a) => a.disciplines.forEach((d) => set.add(d)));
    return Array.from(set).sort();
  }, [athletesRaw]);

  if (!delegation) return <div>Delegation not found</div>;

  const maleCount = athletesRaw.filter((a) => a.gender === 'M').length;
  const femaleCount = athletesRaw.filter((a) => a.gender === 'F').length;
  const pairsCount = teams.filter((t) => t.type === 'Pair').length;
  const groupsCount = teams.filter((t) => t.type === 'Group').length;
  const withdrawalsCount = entries.filter((e) => e.status === 'Withdrawn').length;

  return (
    <div>
      <Link to="/tms/admin/delegations" style={{ color: 'var(--tms-teal)', fontSize: 14 }}>← Delegations</Link>
      <h1 className="tms-page-title" style={{ marginTop: 8 }}>{delegation.name} ({delegation.code})</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Head of Delegation: {delegation.headOfDelegation} · {delegation.athleteCount} Athletes · {delegation.entryCount} Entries
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="tms-stat-card">
          <div className="stat-value">{maleCount}</div>
          <div className="stat-label">MALE ATHLETES</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{femaleCount}</div>
          <div className="stat-label">FEMALE ATHLETES</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{teams.length}</div>
          <div className="stat-label">TEAMS · {pairsCount} pairs, {groupsCount} groups</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{withdrawalsCount}</div>
          <div className="stat-label">WITHDRAWALS</div>
        </div>
      </div>

      <div className="tms-filter-bar">
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
        <select value={disciplineFilter} onChange={(e) => setDisciplineFilter(e.target.value)}>
          <option value="">All Disciplines</option>
          {uniqueDisciplines.map((d) => (
            <option key={d} value={d}>{d}</option>
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

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Athlete Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Age Cat</th>
              <th>Entries</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.fullName}</td>
                <td>{a.gender === 'M' ? 'M' : 'F'}</td>
                <td>{a.dob}</td>
                <td>{ageCategories.find((ac) => ac.id === a.ageCategoryId)?.label || a.ageCategoryId}</td>
                <td>{a.entryCount}</td>
                <td><span className={`tms-badge tms-badge-${a.status.toLowerCase().replace(' ', '-')}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAddAthlete(true)}>＋ Add Athlete</button>
        <button className="tms-btn tms-btn-outline" style={{ marginTop: 16, marginLeft: 8 }}>Replace Athlete</button>
      </div>
      {delegation && <AddAthleteModal isOpen={showAddAthlete} onClose={() => setShowAddAthlete(false)} delegationId={delegation.id} />}
    </div>
  );
}
