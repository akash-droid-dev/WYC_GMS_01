import { useCloudStore } from '../../cloud/store';

export default function SystemConfigPage() {
  const { systemConfig, setSystemConfig } = useCloudStore();

  return (
    <div>
      <h1 className="tms-page-title">System configuration</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Super Admin only. Changes reflect across all modules (FRD 12.2)
      </p>
      <div className="tms-content-card" style={{ maxWidth: 560 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Edition name</label>
          <input
            type="text"
            className="tms-input"
            value={systemConfig.editionName}
            onChange={(e) => setSystemConfig({ editionName: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Registration open</label>
          <label>
            <input
              type="checkbox"
              checked={systemConfig.registrationOpen}
              onChange={(e) => setSystemConfig({ registrationOpen: e.target.checked })}
            />{' '}
            Open
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Registration deadline</label>
          <input
            type="date"
            className="tms-input"
            value={systemConfig.registrationDeadline}
            onChange={(e) => setSystemConfig({ registrationDeadline: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Max events per athlete</label>
          <input
            type="number"
            min={1}
            max={10}
            className="tms-input"
            value={systemConfig.maxEventsPerAthlete}
            onChange={(e) => setSystemConfig({ maxEventsPerAthlete: Number(e.target.value) })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Max individual events</label>
          <input
            type="number"
            min={1}
            max={5}
            className="tms-input"
            value={systemConfig.maxIndividualEvents}
            onChange={(e) => setSystemConfig({ maxIndividualEvents: Number(e.target.value) })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Medical certificate expiry (days)</label>
          <input
            type="number"
            min={7}
            max={90}
            className="tms-input"
            value={systemConfig.medicalCertificateExpiryDays}
            onChange={(e) => setSystemConfig({ medicalCertificateExpiryDays: Number(e.target.value) })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">OTP validity (minutes)</label>
          <input
            type="number"
            min={5}
            max={30}
            className="tms-input"
            value={systemConfig.otpValidityMinutes}
            onChange={(e) => setSystemConfig({ otpValidityMinutes: Number(e.target.value) })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">OTP max retries</label>
          <input
            type="number"
            min={1}
            max={10}
            className="tms-input"
            value={systemConfig.otpMaxRetries}
            onChange={(e) => setSystemConfig({ otpMaxRetries: Number(e.target.value) })}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)' }}>All changes are saved to cloud store and apply immediately across Registration, TMS, Accreditation.</p>
      </div>
    </div>
  );
}
