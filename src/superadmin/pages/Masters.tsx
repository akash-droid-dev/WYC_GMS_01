import { useCloudStore } from '../../cloud/store';

export default function MastersPage() {
  const { ageCategories, eventTypes, eligibilityRules, setEligibilityRules } = useCloudStore();

  const toggleEligibility = (eventTypeId: string, ageCategoryId: string) => {
    const rules = eligibilityRules.map((r) =>
      r.eventTypeId === eventTypeId && r.ageCategoryId === ageCategoryId
        ? { ...r, allowed: !r.allowed }
        : r
    );
    setEligibilityRules(rules);
  };

  return (
    <div>
      <h1 className="tms-page-title">Global masters</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Age categories and event types are fixed for WYC 2026 (FRD 7.1, 7.2). Eligibility matrix configurable (FRD 7.3)
      </p>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Age categories (read-only)</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Label</th>
              <th>Age range</th>
            </tr>
          </thead>
          <tbody>
            {ageCategories.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.label}</td>
                <td>{c.minAge}–{c.maxAge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">Event types (read-only)</h3>
        <table className="tms-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Family</th>
            </tr>
          </thead>
          <tbody>
            {eventTypes.map((e) => (
              <tr key={e.id}>
                <td>{e.code}</td>
                <td>{e.name}</td>
                <td>{e.family}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tms-content-card">
        <h3 className="tms-section-header">Eligibility matrix (editable)</h3>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 12 }}>Toggle to allow/disallow event type per age category. Registration and TMS use this.</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="tms-table">
            <thead>
              <tr>
                <th>Event</th>
                {ageCategories.map((ac) => (
                  <th key={ac.id}>{ac.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {eventTypes.map((et) => (
                <tr key={et.id}>
                  <td>{et.name}</td>
                  {ageCategories.map((ac) => {
                    const r = eligibilityRules.find((x) => x.eventTypeId === et.id && x.ageCategoryId === ac.id);
                    return (
                      <td key={ac.id}>
                        <button
                          type="button"
                          onClick={() => toggleEligibility(et.id, ac.id)}
                          style={{
                            padding: '4px 8px',
                            background: r?.allowed ? 'rgba(19, 136, 8, 0.2)' : '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12,
                          }}
                        >
                          {r?.allowed ? 'Yes' : 'No'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
