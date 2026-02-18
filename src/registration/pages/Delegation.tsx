import { useState } from 'react';
import { useCloudStore } from '../../cloud/store';
import type { DelegationType } from '../../cloud/types';

export default function DelegationPage() {
  const { delegations, countries, addDelegation, updateDelegation } = useCloudStore();
  const [delegationType, setDelegationType] = useState<DelegationType>('International');
  const [countryId, setCountryId] = useState('');
  const [federationAssociation, setFederationAssociation] = useState('');
  const [teamManagerName, setTeamManagerName] = useState('');
  const [teamManagerEmail, setTeamManagerEmail] = useState('');
  const [teamManagerPhone, setTeamManagerPhone] = useState('');
  const [saved, setSaved] = useState(false);

  const current = delegations[0];

  const save = () => {
    if (current) {
      updateDelegation(current.id, {
        delegationType,
        countryId: delegationType === 'International' ? countryId : undefined,
        federationAssociation,
        teamManagerName,
        teamManagerEmail,
        teamManagerPhone,
      });
    } else {
      addDelegation({
        delegationType,
        countryId: delegationType === 'International' ? countryId : undefined,
        federationAssociation,
        teamManagerName,
        teamManagerEmail,
        teamManagerPhone,
        status: 'Draft',
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="tms-page-title">My Delegation</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Delegation Type drives mandatory fields (FRD REG-003)
      </p>
      <div className="tms-content-card" style={{ maxWidth: 560 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Delegation Type</label>
          <select
            className="tms-input"
            value={delegationType}
            onChange={(e) => setDelegationType(e.target.value as DelegationType)}
          >
            <option value="National">National (State/Unit)</option>
            <option value="International">International (Country)</option>
          </select>
        </div>
        {delegationType === 'International' && (
          <div style={{ marginBottom: 16 }}>
            <label className="tms-label">Country *</label>
            <select
              className="tms-input"
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              required
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Federation / Association *</label>
          <input
            type="text"
            className="tms-input"
            value={federationAssociation}
            onChange={(e) => setFederationAssociation(e.target.value)}
            placeholder="e.g. National Yogasana Federation"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Team Manager Name *</label>
          <input
            type="text"
            className="tms-input"
            value={teamManagerName}
            onChange={(e) => setTeamManagerName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Team Manager Email *</label>
          <input
            type="email"
            className="tms-input"
            value={teamManagerEmail}
            onChange={(e) => setTeamManagerEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="tms-label">Team Manager Phone</label>
          <input
            type="tel"
            className="tms-input"
            value={teamManagerPhone}
            onChange={(e) => setTeamManagerPhone(e.target.value)}
          />
        </div>
        <button type="button" className="tms-btn tms-btn-primary" onClick={save}>
          {current ? 'Update' : 'Create'} Delegation
        </button>
        {saved && <span style={{ marginLeft: 12, color: 'var(--tms-green)' }}>Saved.</span>}
      </div>
    </div>
  );
}
