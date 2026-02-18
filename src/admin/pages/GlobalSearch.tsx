import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';

export default function GlobalSearch() {
  const [q, setQ] = useState('');
  const { participants, delegations, accreditationRecords } = useCloudStore();
  const lower = q.trim().toLowerCase();
  const results = lower.length >= 2
    ? {
        participants: participants.filter(
          (p) =>
            p.fullName.toLowerCase().includes(lower) ||
            p.wycId?.toLowerCase().includes(lower) ||
            p.applicationId?.toLowerCase().includes(lower) ||
            p.email.toLowerCase().includes(lower)
        ),
        delegations: delegations.filter(
          (d) => d.federationAssociation.toLowerCase().includes(lower) || d.teamManagerEmail.toLowerCase().includes(lower)
        ),
        accreditation: accreditationRecords.filter(
          (a) =>
            a.wycId.toLowerCase().includes(lower) ||
            a.fullName.toLowerCase().includes(lower) ||
            a.email.toLowerCase().includes(lower)
        ),
      }
    : { participants: [], delegations: [], accreditation: [] };

  const total = results.participants.length + results.delegations.length + results.accreditation.length;

  return (
    <div>
      <h1 className="tms-page-title">Global search</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Search by WYC ID, Application ID, Name, Email, Country (FRD 12.3)
      </p>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <input
          type="search"
          className="tms-input"
          placeholder="WYC ID / Application ID / Name / Email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 400 }}
        />
        {q.trim().length >= 2 && <p style={{ marginTop: 8 }}>{total} result(s)</p>}
      </div>
      {total > 0 && (
        <div className="tms-content-card">
          {results.participants.length > 0 && (
            <>
              <h3 className="tms-section-header">Participants</h3>
              <table className="tms-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>WYC ID</th>
                    <th>Application ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.participants.map((p) => (
                    <tr key={p.id}>
                      <td>{p.fullName}</td>
                      <td>{p.wycId ?? '-'}</td>
                      <td>{p.applicationId ?? '-'}</td>
                      <td>{p.applicationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {results.accreditation.length > 0 && (
            <>
              <h3 className="tms-section-header">Accreditation</h3>
              <table className="tms-table">
                <thead>
                  <tr>
                    <th>WYC ID</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.accreditation.map((a) => (
                    <tr key={a.id}>
                      <td>{a.wycId}</td>
                      <td>{a.fullName}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
