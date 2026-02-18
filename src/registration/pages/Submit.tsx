import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';

export default function SubmitPage() {
  const { delegations, participants, eventEntries, updateParticipant, updateDelegation } = useCloudStore();
  const [ack, setAck] = useState<string | null>(null);
  const delegationId = delegations[0]?.id;
  const list = participants.filter((p) => p.delegationId === delegationId);
  const drafts = list.filter((p) => p.applicationStatus === 'Draft');
  const canSubmit = delegationId && drafts.length > 0;

  const submit = () => {
    if (!delegationId) return;
    const applicationId = `APP-${Date.now()}`;
    drafts.forEach((p) => {
      updateParticipant(p.id, {
        applicationStatus: 'Pending Verification',
        applicationId,
      });
    });
    updateDelegation(delegationId, { status: 'Submitted', applicationId });
    setAck('Application submitted. Acknowledgement: ' + applicationId + '. No unique WYC ID until approval (FRD REG-040, ID-001).');
  };

  return (
    <div>
      <h1 className="tms-page-title">Submit Application</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Submission produces acknowledgement; WYC ID only after OC approval (FRD REG-040, ID-001)
      </p>
      <div className="tms-content-card">
        <h3 className="tms-section-header">Ready to submit</h3>
        <p>Participants in Draft: {drafts.length}. After submit they move to Pending Verification.</p>
        {canSubmit && (
          <button type="button" className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={submit}>
            Submit for verification
          </button>
        )}
        {!canSubmit && drafts.length === 0 && list.length > 0 && (
          <p style={{ color: 'var(--tms-slate)' }}>No draft participants. All may already be submitted or approved.</p>
        )}
        {ack && (
          <div style={{ marginTop: 24, padding: 16, background: 'rgba(19, 136, 8, 0.1)', borderRadius: 8 }}>
            {ack}
          </div>
        )}
      </div>
    </div>
  );
}
