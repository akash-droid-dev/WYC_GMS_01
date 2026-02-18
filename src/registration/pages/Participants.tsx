import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';
import type { ParticipantRole, Gender } from '../../cloud/types';

export default function ParticipantsPage() {
  const { delegations, participants, countries, ageCategories, addParticipant } = useCloudStore();
  const [role, setRole] = useState<ParticipantRole>('Athlete');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('M');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const delegationId = delegations[0]?.id;

  const add = () => {
    if (!delegationId || !fullName.trim() || !dob || !email.trim()) {
      alert('Fill mandatory fields: Name, DOB, Email.');
      return;
    }
    addParticipant({
      delegationId,
      role,
      fullName: fullName.trim(),
      gender,
      dob,
      nationality: (nationality.trim() || countries[0]?.name) ?? '',
      email: email.trim(),
      phone: phone.trim() || undefined,
      applicationStatus: 'Draft',
    });
    setFullName('');
    setDob('');
    setEmail('');
    setPhone('');
  };

  if (!delegationId) {
    return (
      <div>
        <h1 className="tms-page-title">Participants</h1>
        <p className="tms-content-card">Create a delegation first (Delegation tab).</p>
      </div>
    );
  }

  const list = participants.filter((p) => p.delegationId === delegationId);

  return (
    <div>
      <h1 className="tms-page-title">Participants</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Add athletes, coaches, judges. Age category derived from DOB (cut-off 1 Jan) — FRD REG-010
      </p>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Add participant</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <div>
            <label className="tms-label">Role *</label>
            <select className="tms-input" value={role} onChange={(e) => setRole(e.target.value as ParticipantRole)}>
              <option value="Athlete">Athlete</option>
              <option value="Coach">Coach</option>
              <option value="Judge">Judge</option>
              <option value="Technical Official">Technical Official</option>
            </select>
          </div>
          <div>
            <label className="tms-label">Full Name (as per Govt ID) *</label>
            <input type="text" className="tms-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="tms-label">Gender *</label>
            <select className="tms-input" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className="tms-label">DOB *</label>
            <input type="date" className="tms-input" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div>
            <label className="tms-label">Nationality *</label>
            <input type="text" className="tms-input" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Country" />
          </div>
          <div>
            <label className="tms-label">Email *</label>
            <input type="email" className="tms-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="tms-label">Phone</label>
            <input type="tel" className="tms-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <button type="button" className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={add}>
          Add Participant
        </button>
      </div>
      <div className="tms-content-card">
        <h3 className="tms-section-header">List ({list.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="tms-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Age category</th>
                <th>Status</th>
                <th>WYC ID</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.fullName}</td>
                  <td>{p.role}</td>
                  <td>{p.gender}</td>
                  <td>{p.dob}</td>
                  <td>{p.ageCategoryId ? ageCategories.find((c) => c.id === p.ageCategoryId)?.label : '-'}</td>
                  <td>{p.applicationStatus}</td>
                  <td>{p.wycId ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
