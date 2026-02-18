import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

export default function AdminMasterSetup() {
  const [tab, setTab] = useState<'disciplines' | 'age' | 'matrix' | 'scoring' | 'config'>('matrix');
  const disciplines = useTMSStore((s) => s.disciplines);
  const ageCategories = useTMSStore((s) => s.ageCategories);

  const initialMatrix = useMemo(() => {
    const m: Record<string, Record<string, boolean>> = {};
    disciplines.forEach((d) => {
      m[d.id] = {};
      ageCategories.forEach((ac) => {
        m[d.id][ac.id] = Math.random() > 0.2;
      });
    });
    return m;
  }, [disciplines, ageCategories]);

  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(() => initialMatrix);

  const toggleMatrix = (discId: string, ageId: string) => {
    setMatrix((prev) => ({
      ...prev,
      [discId]: {
        ...prev[discId],
        [ageId]: !prev[discId]?.[ageId],
      },
    }));
  };

  const enabledCount = useMemo(() => {
    let count = 0;
    Object.values(matrix).forEach((row) => {
      Object.values(row).forEach((v) => { if (v) count += 2; });
    });
    return count;
  }, [matrix]);

  const tabs = [
    { id: 'disciplines', label: 'Disciplines' },
    { id: 'age', label: 'Age Categories' },
    { id: 'matrix', label: 'Eligibility Matrix' },
    { id: 'scoring', label: 'Scoring Templates' },
    { id: 'config', label: 'System Config' },
  ];

  return (
    <div>
      <h1 className="tms-page-title">Master Setup & Configuration</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        FR-001→006 · Disciplines, Age Categories, Eligibility Matrix
      </p>
      <p style={{ marginBottom: 16, padding: 12, background: 'rgba(19, 136, 8, 0.08)', borderRadius: 8, fontSize: 13 }}>
        <strong>Cloud-connected:</strong> Global age categories, event types, and eligibility matrix are managed in{' '}
        <Link to="/super-admin/masters">Super Admin → Masters</Link> and apply to Registration, TMS, and Accreditation.
      </p>

      <div className="tms-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tms-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id as typeof tab)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'matrix' && (
        <div className="tms-content-card">
          <h3 className="tms-section-header">Eligibility Matrix · 12 Disciplines × 6 Age Categories</h3>
          <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 16 }}>
            Toggle cells to enable/disable medal events. Auto-generates event codes.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="tms-table">
              <thead>
                <tr>
                  <th>Discipline</th>
                  {ageCategories.map((ac) => (
                    <th key={ac.id}>{ac.label}<br /><span style={{ fontSize: 10 }}>{ac.minAge}-{ac.maxAge}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disciplines.slice(0, 8).map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    {ageCategories.map((ac) => (
                      <td key={ac.id}>
                        <button
                          type="button"
                          onClick={() => toggleMatrix(d.id, ac.id)}
                          style={{
                            padding: '4px 8px',
                            background: matrix[d.id]?.[ac.id] ? 'rgba(19, 136, 8, 0.15)' : '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {matrix[d.id]?.[ac.id] ? '✓ M/F' : '—'}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16 }}>Total Medal Events: {enabledCount} ({enabledCount / 2} Male + {enabledCount / 2} Female)</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="tms-btn tms-btn-primary" onClick={() => alert('Auto-generate would create medal events from enabled matrix cells.')}>Auto-Generate Events</button>
            <button className="tms-btn tms-btn-outline" onClick={() => alert('Export would download the eligibility matrix as CSV.')}>Export Matrix</button>
          </div>
          <p style={{ fontSize: 10, color: 'var(--tms-slate)', marginTop: 12 }}>
            FR-001: Discipline master CRUD · FR-002: Age category management · FR-003: Eligibility toggle matrix · FR-004: Auto-generate 116 medal events · FR-005: Scoring template per discipline · FR-006: System configuration
          </p>
        </div>
      )}

      {tab === 'disciplines' && (
        <div className="tms-content-card">
          <table className="tms-table">
            <thead>
              <tr><th>Discipline</th><th>Type</th><th>Style</th></tr>
            </thead>
            <tbody>
              {disciplines.map((d) => (
                <tr key={d.id}><td>{d.name}</td><td>{d.type}</td><td>{d.style}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'age' && (
        <div className="tms-content-card">
          <table className="tms-table">
            <thead>
              <tr><th>Category</th><th>Age Range</th></tr>
            </thead>
            <tbody>
              {ageCategories.map((ac) => (
                <tr key={ac.id}><td>{ac.label}</td><td>{ac.minAge}-{ac.maxAge}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'scoring' && (
        <div className="tms-content-card">
          <h3 className="tms-section-header">Scoring Templates per Discipline</h3>
          <table className="tms-table">
            <thead>
              <tr><th>Discipline</th><th>Components</th></tr>
            </thead>
            <tbody>
              {disciplines.slice(0, 6).map((d) => (
                <tr key={d.id}><td>{d.name}</td><td>{d.components.join(', ')}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'config' && (
        <div className="tms-content-card">
          <h3 className="tms-section-header">System Configuration</h3>
          <p style={{ color: 'var(--tms-slate)' }}>Cut-off date, timezone, scoring rules, and system parameters. (FR-006)</p>
        </div>
      )}
    </div>
  );
}
