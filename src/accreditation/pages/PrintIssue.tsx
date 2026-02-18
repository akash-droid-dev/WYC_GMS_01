import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';

const OP = 'acc.operator@wyc2026.org';

export default function PrintIssuePage() {
  const { accreditationRecords, updateAccreditationStatus, markPrinted, markIssued, reissueCredential, revokeCredential } = useCloudStore();
  const [selectedWycId, setSelectedWycId] = useState('');
  const [revokeReason, setRevokeReason] = useState('');

  const pending = accreditationRecords.filter((a) => a.status === 'Pending' || a.status === 'Needs Correction');
  const ready = accreditationRecords.filter((a) => a.status === 'Ready');

  const markReady = (wycId: string) => {
    updateAccreditationStatus(wycId, 'Ready', OP);
  };
  const doPrint = (wycId: string) => {
    markPrinted(wycId, OP);
  };
  const doIssue = (wycId: string) => {
    markIssued(wycId, OP);
  };
  const doReissue = (wycId: string) => {
    reissueCredential(wycId, OP);
  };
  const doRevoke = (wycId: string) => {
    if (!revokeReason.trim()) return;
    revokeCredential(wycId, revokeReason, OP);
    setRevokeReason('');
    setSelectedWycId('');
  };

  return (
    <div>
      <h1 className="tms-page-title">Print & issue</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Ready → Print → Issue. Reissue increments version and revokes previous (FRD FR-ACC-011, FR-ACC-012, FR-ACC-020, FR-ACC-021)
      </p>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Pending → Ready</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>WYC ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((a) => (
              <tr key={a.id}>
                <td>{a.wycId}</td>
                <td>{a.fullName}</td>
                <td>{a.role}</td>
                <td>
                  <button type="button" className="tms-btn tms-btn-primary" onClick={() => markReady(a.wycId)}>Mark Ready</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Ready → Print → Issue</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>WYC ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accreditationRecords.filter((a) => ['Ready', 'Printed', 'Issued', 'Active'].includes(a.status)).map((a) => (
              <tr key={a.id}>
                <td>{a.wycId}</td>
                <td>{a.fullName}</td>
                <td>{a.status}</td>
                <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {a.status === 'Ready' && <button type="button" className="tms-btn tms-btn-primary" onClick={() => doPrint(a.wycId)}>Print</button>}
                  {a.status === 'Printed' && <button type="button" className="tms-btn tms-btn-primary" onClick={() => doIssue(a.wycId)}>Issue</button>}
                  {(a.status === 'Issued' || a.status === 'Active') && (
                    <>
                      <button type="button" className="tms-btn tms-btn-secondary" onClick={() => doReissue(a.wycId)}>Reissue</button>
                      {selectedWycId === a.wycId ? (
                        <span>
                          <input type="text" className="tms-input" placeholder="Revoke reason" value={revokeReason} onChange={(e) => setRevokeReason(e.target.value)} />
                          <button type="button" className="tms-btn tms-btn-danger" onClick={() => doRevoke(a.wycId)}>Revoke</button>
                        </span>
                      ) : (
                        <button type="button" className="tms-btn tms-btn-danger" onClick={() => setSelectedWycId(a.wycId)}>Revoke</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
