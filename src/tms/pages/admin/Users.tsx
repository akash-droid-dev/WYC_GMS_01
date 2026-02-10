import { useMemo, useState } from 'react';
import { useTMSStore } from '../../store/tmsStore';
import AddUserModal from '../../components/AddUserModal';

export default function AdminUsers() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const usersRaw = useTMSStore((s) => s.users);

  const users = useMemo(() => {
    return usersRaw.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.role.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [usersRaw, roleFilter, searchQuery]);

  const uniqueRoles = useMemo(() => [...new Set(usersRaw.map((u) => u.role))].sort(), [usersRaw]);

  return (
    <div>
      <h1 className="tms-page-title">User & Role Management</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        RBAC · Role-Based Access Control
      </p>

      <div className="tms-filter-bar">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {uniqueRoles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input type="search" placeholder="Search by name, email, role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <button className="tms-btn tms-btn-primary" style={{ marginBottom: 24 }} onClick={() => setShowAddUser(true)}>＋ Add User</button>

      <AddUserModal isOpen={showAddUser} onClose={() => setShowAddUser(false)} />

      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Events</th>
              <th>Status</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.assignedEvents?.join(', ') || (u.delegationId ? u.delegationId : 'All')}</td>
                <td><span className="tms-badge tms-badge-confirmed">Active</span></td>
                <td>15 min ago</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 24 }}>
          <h3 className="tms-section-header">Role Permissions Matrix (FR-041 RBAC)</h3>
          <table className="tms-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Super Admin</td><td>Full CRUD</td></tr>
              <tr><td>Comp Admin</td><td>Events+Results</td></tr>
              <tr><td>Tech Admin</td><td>Score Override</td></tr>
              <tr><td>Chief Judge</td><td>Score Approve</td></tr>
              <tr><td>Judge</td><td>Score Entry</td></tr>
              <tr><td>Scoring Op</td><td>Score Input</td></tr>
              <tr><td>Delegation Mgr</td><td>View Own</td></tr>
              <tr><td>Public</td><td>View Published</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
