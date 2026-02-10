import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';
import AddAthleteModal from '../../components/AddAthleteModal';
import AddTeamModal from '../../components/AddTeamModal';

export default function DelegationAthletes() {
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [ageCategoryFilter, setAgeCategoryFilter] = useState<string>('');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const athletes = useTMSStore((s) => s.athletes);
  const entries = useTMSStore((s) => s.entries);
  const teams = useTMSStore((s) => s.teams);
  const ageCategories = useTMSStore((s) => s.ageCategories);

  const indiaAthletesBase = useMemo(() => athletes.filter((a) => a.delegationId === 'IND'), [athletes]);
  const indiaEntries = useMemo(() => entries.filter((e) => e.delegationId === 'IND'), [entries]);
  const withdrawals = indiaEntries.filter((e) => e.status === 'Withdrawn');

  const indiaPairs = teams.filter((t) => t.delegationId === 'IND' && t.type === 'Pair').length;
  const indiaGroups = teams.filter((t) => t.delegationId === 'IND' && t.type === 'Group').length;

  const uniqueDisciplines = useMemo(() => {
    const set = new Set<string>();
    indiaAthletesBase.forEach((a) => a.disciplines.forEach((d) => set.add(d)));
    return Array.from(set).sort();
  }, [indiaAthletesBase]);

  const uniqueStatuses = useMemo(() => {
    const set = new Set(indiaAthletesBase.map((a) => a.status));
    return Array.from(set).sort();
  }, [indiaAthletesBase]);

  const indiaAthletes = useMemo(() => {
    return indiaAthletesBase.filter((a) => {
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
  }, [indiaAthletesBase, genderFilter, ageCategoryFilter, disciplineFilter, statusFilter, searchQuery]);

  const genderSplit = useMemo(() => {
    const m = indiaAthletesBase.filter((a) => a.gender === 'M').length;
    const f = indiaAthletesBase.filter((a) => a.gender === 'F').length;
    return `${m}M · ${f}F`;
  }, [indiaAthletesBase]);

  return (
    <div>
      <h1 className="tms-page-title">My Athletes · India</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Delegation Manager: S. Patel · {indiaAthletes.length} registered athletes
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="tms-stat-card">
          <div className="stat-value">{indiaAthletes.length}</div>
          <div className="stat-label">Athletes</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{genderSplit}</div>
          <div className="stat-label">Gender split</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{indiaEntries.filter((e) => e.status === 'Confirmed' || e.status === 'Locked').length}</div>
          <div className="stat-label">Entries Filed (confirmed)</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{indiaPairs + indiaGroups}</div>
          <div className="stat-label">Teams ({indiaPairs} Pair · {indiaGroups} Group)</div>
        </div>
        <div className="tms-stat-card">
          <div className="stat-value">{withdrawals.length}</div>
          <div className="stat-label">Withdrawals</div>
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
          {uniqueStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="search" placeholder="Search by name, ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Athlete ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Age Cat.</th>
              <th>Discipline(s)</th>
              <th>Entries</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {indiaAthletes.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.fullName}</td>
                <td>{a.gender === 'M' ? 'Male' : 'Female'}</td>
                <td>{ageCategories.find((ac) => ac.id === a.ageCategoryId)?.label || a.ageCategoryId}</td>
                <td>{a.disciplines.join(', ')}</td>
                <td>{a.entryCount}</td>
                <td><span className={`tms-badge tms-badge-${a.status.toLowerCase().replace(' ', '-')}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="tms-btn tms-btn-primary" onClick={() => setShowAddAthlete(true)}>+ Add Athlete</button>
          <button className="tms-btn tms-btn-outline" onClick={() => setShowAddTeam(true)}>+ Add Team (Pair/Group)</button>
        </div>
        <p style={{ fontSize: 10, color: 'var(--tms-slate)', marginTop: 12 }}>FR-010 · Athlete registration with passport validation. Max entries per discipline per FR-020 rules.</p>
      </div>
      <AddAthleteModal isOpen={showAddAthlete} onClose={() => setShowAddAthlete(false)} delegationId="IND" />
      <AddTeamModal isOpen={showAddTeam} onClose={() => setShowAddTeam(false)} delegationId="IND" />
    </div>
  );
}
