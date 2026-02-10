import { useState } from 'react';

const REPORTS = [
  { name: 'Competition Summary', desc: 'Overall stats, medal counts, athlete participation by delegation' },
  { name: 'Start Lists', desc: 'Printable start lists by event, session, venue' },
  { name: 'Medal Report', desc: 'Detailed medal allocation breakdown by delegation, discipline, age' },
  { name: 'Scoring Analytics', desc: 'Score distributions, judge consistency analysis, override frequency' },
  { name: 'Protest Log', desc: 'Full audit trail of all protests with outcomes' },
  { name: 'Delegation Report', desc: 'Athlete counts, entry stats, team compositions per delegation' },
  { name: 'Schedule Report', desc: 'Published schedule with version history and conflict log' },
  { name: 'Audit Trail', desc: 'Complete system audit log for all score changes and overrides' },
];

export default function AdminReports() {
  const [generating, setGenerating] = useState<string | null>(null);
  return (
    <div>
      <h1 className="tms-page-title">Reports & Exports</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        Pre-built reports for competition management & post-event analysis
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {REPORTS.map((r) => (
          <div key={r.name} className="tms-content-card">
            <h3 className="tms-section-header">{r.name}</h3>
            <p style={{ fontSize: 14, color: 'var(--tms-slate)', marginBottom: 16 }}>{r.desc}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="tms-btn tms-btn-primary"
                onClick={() => { setGenerating(r.name); setTimeout(() => setGenerating(null), 1500); }}
              >
                {generating === r.name ? 'Generating...' : 'Generate'}
              </button>
              <button className="tms-btn tms-btn-outline" onClick={() => alert(`PDF export: ${r.name}`)}>PDF Export</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
