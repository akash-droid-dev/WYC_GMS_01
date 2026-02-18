import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';

export default function ScanPage() {
  const { accreditationRecords, addScanLog } = useCloudStore();
  const [scanInput, setScanInput] = useState('');
  const [lastResult, setLastResult] = useState<{ wycId: string; result: string; reason?: string } | null>(null);

  const validate = () => {
    const wycId = scanInput.trim();
    if (!wycId) return;
    const record = accreditationRecords.find((a) => a.wycId === wycId);
    if (!record) {
      addScanLog({ wycId, credentialVersion: 1, result: 'Denied', reasonCode: 'NOT_FOUND' });
      setLastResult({ wycId, result: 'Denied', reason: 'Not found' });
    } else if (record.status === 'Revoked') {
      addScanLog({ wycId, credentialVersion: record.credentialVersion, result: 'Denied', reasonCode: 'REVOKED' });
      setLastResult({ wycId, result: 'Denied', reason: 'Revoked' });
    } else if (record.status !== 'Issued' && record.status !== 'Active') {
      addScanLog({ wycId, credentialVersion: record.credentialVersion, result: 'Denied', reasonCode: 'NOT_ISSUED' });
      setLastResult({ wycId, result: 'Denied', reason: 'Not issued' });
    } else {
      addScanLog({ wycId, credentialVersion: record.credentialVersion, result: 'Allowed' });
      setLastResult({ wycId, result: 'Allowed' });
    }
    setScanInput('');
  };

  return (
    <div>
      <h1 className="tms-page-title">Scan validation</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        QR/token validation – Allowed/Denied with reason codes (FRD FR-ACC-017, FR-ACC-018)
      </p>
      <div className="tms-content-card" style={{ maxWidth: 400 }}>
        <label className="tms-label">WYC ID or token</label>
        <input
          type="text"
          className="tms-input"
          value={scanInput}
          onChange={(e) => setScanInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && validate()}
          placeholder="Scan or enter WYC ID"
        />
        <button type="button" className="tms-btn tms-btn-primary" style={{ marginTop: 12 }} onClick={validate}>
          Validate
        </button>
        {lastResult && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: lastResult.result === 'Allowed' ? 'rgba(19, 136, 8, 0.15)' : 'rgba(196, 69, 54, 0.15)',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {lastResult.result}: {lastResult.wycId} {lastResult.reason && `(${lastResult.reason})`}
          </div>
        )}
      </div>
    </div>
  );
}
