import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';

const CURRENT_ADMIN = 'oc.verifier@wyc2026.org';

export default function VerificationQueue() {
  const {
    participants,
    ageCategories,
    approveParticipant,
    rejectParticipant,
    requestCorrection,
  } = useCloudStore();
  const pending = participants.filter((p) => p.applicationStatus === 'Pending Verification');
  const [rejectReason, setRejectReason] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionFields, setCorrectionFields] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleApprove = (participantId: string) => {
    const wycId = approveParticipant(participantId, CURRENT_ADMIN);
    if (wycId) setSelectedId(null);
  };

  const handleReject = (participantId: string) => {
    if (!rejectReason.trim()) return;
    rejectParticipant(participantId, rejectReason, CURRENT_ADMIN);
    setRejectReason('');
    setSelectedId(null);
  };

  const handleCorrection = (participantId: string) => {
    if (!correctionReason.trim() || correctionFields.length === 0) return;
    requestCorrection(participantId, correctionFields, correctionReason, CURRENT_ADMIN);
    setCorrectionReason('');
    setCorrectionFields([]);
    setSelectedId(null);
  };

  return (
    <div>
      <h1 className="tms-page-title">Verification Queue</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Approve / Reject / Request correction. On approval, Unique WYC ID generated (FRD VER-001, ID-001)
      </p>
      <div className="tms-content-card">
        <table className="tms-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Age category</th>
              <th>Application ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((p) => (
              <tr key={p.id}>
                <td>{p.fullName}</td>
                <td>{p.role}</td>
                <td>{p.gender}</td>
                <td>{p.dob}</td>
                <td>{ageCategories.find((c) => c.id === p.ageCategoryId)?.label ?? '-'}</td>
                <td>{p.applicationId ?? '-'}</td>
                <td>
                  {selectedId === p.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button type="button" className="tms-btn tms-btn-primary" onClick={() => handleApprove(p.id)}>
                        Approve (generate WYC ID)
                      </button>
                      <div>
                        <input
                          type="text"
                          className="tms-input"
                          placeholder="Reject reason"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <button type="button" className="tms-btn tms-btn-danger" style={{ marginTop: 4 }} onClick={() => handleReject(p.id)}>Reject</button>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="tms-input"
                          placeholder="Correction reason"
                          value={correctionReason}
                          onChange={(e) => setCorrectionReason(e.target.value)}
                        />
                        <label><input type="checkbox" checked={correctionFields.includes('photo')} onChange={(e) => setCorrectionFields((f) => e.target.checked ? [...f, 'photo'] : f.filter((x) => x !== 'photo'))} /> Photo</label>
                        <label><input type="checkbox" checked={correctionFields.includes('documents')} onChange={(e) => setCorrectionFields((f) => e.target.checked ? [...f, 'documents'] : f.filter((x) => x !== 'documents'))} /> Documents</label>
                        <button type="button" className="tms-btn tms-btn-secondary" style={{ marginTop: 4 }} onClick={() => handleCorrection(p.id)}>Request correction</button>
                      </div>
                      <button type="button" className="tms-btn tms-btn-secondary" onClick={() => setSelectedId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button type="button" className="tms-btn tms-btn-primary" onClick={() => setSelectedId(p.id)}>Review</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pending.length === 0 && <p style={{ color: 'var(--tms-slate)' }}>No applications pending verification.</p>}
      </div>
    </div>
  );
}
