import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTMSStore } from '../../store/tmsStore';

const COMPONENTS = ['Posture', 'Breathing', 'Technique', 'Presentation', 'Difficulty'];

export default function JudgeScoring() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sessions = useTMSStore((s) => s.sessions);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const getEventById = useTMSStore((s) => s.getEventById);
  const updateScore = useTMSStore((s) => s.updateScore);
  const submitScore = useTMSStore((s) => s.submitScore);

  const session = sessions.find((s) => s.id === sessionId);
  const ev = session ? getEventById(session.eventId) : null;

  const [currentIdx, setCurrentIdx] = useState(4); // Priya Sharma is 5th
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(COMPONENTS.map((c) => [c, 8.0]))
  );
  const [deductions, setDeductions] = useState({ time: -0.2, costume: 0, other: 0 });
  const [elapsed, setElapsed] = useState(222); // 03:42

  const currentSlot = session?.startList?.[currentIdx];
  const currentAthlete = currentSlot?.athleteId ? getAthleteById(currentSlot.athleteId) : null;
  const totalParticipants = session?.startList?.length || 0;

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const compTotal = Object.values(scores).reduce((a, b) => a + b, 0);
  const dedTotal = deductions.time + deductions.costume + deductions.other;
  const finalScore = compTotal + dedTotal;

  const adjustScore = (comp: string, delta: number) => {
    setScores((s) => {
      const v = Math.max(0, Math.min(10, (s[comp] || 0) + delta));
      return { ...s, [comp]: Math.round(v * 10) / 10 };
    });
  };

  const handleSubmit = () => {
    if (!session || !currentSlot) return;
    const compScores = COMPONENTS.map((c) => ({ component: c, value: scores[c] || 0 }));
    const dedList = [
      { reason: 'Time violation', value: deductions.time, code: 'T1' },
      { reason: 'Costume violation', value: deductions.costume, code: 'C1' },
      { reason: 'Other', value: deductions.other, code: 'O1' },
    ].filter((d) => d.value !== 0);
    updateScore(currentSlot.id, session.id, compScores, dedList);
    submitScore(currentSlot.id, session.id);
  };

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Link to="/tms/judge/events" style={{ color: 'var(--tms-teal)', fontSize: 14 }}>← My Events</Link>
          <h1 className="tms-page-title" style={{ marginTop: 8 }}>
            LIVE SCORING · {ev?.name || 'Event'} · Mat 1
          </h1>
          <p style={{ fontSize: 14, color: 'var(--tms-slate)' }}>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</p>
        </div>
        <span className="tms-badge tms-badge-live">LIVE</span>
      </div>

      <div className="tms-content-card" style={{ marginBottom: 24 }}>
        <h3 className="tms-section-header">CURRENT ATHLETE</h3>
        <p style={{ fontSize: 18, fontWeight: 600 }}>{currentAthlete?.fullName || '—'} · #{currentAthlete?.id}</p>
        <p style={{ color: 'var(--tms-slate)' }}>India · Start Order: {currentIdx + 1} of {totalParticipants}</p>
        <div style={{ marginTop: 8 }}>
          <span className="tms-badge tms-badge-pending">In Progress</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="tms-content-card">
          <h3 className="tms-section-header">Score Components</h3>
          <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 16 }}>FR-042 · Each component scored 0.0 - 10.0</p>
          {COMPONENTS.map((c) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ width: 100 }}>{c}</span>
              <div className="tms-score-control">
                <button onClick={() => adjustScore(c, -0.1)}>−</button>
                <input
                  type="number"
                  value={scores[c] ?? 8}
                  step={0.1}
                  min={0}
                  max={10}
                  onChange={(e) => setScores((s) => ({ ...s, [c]: parseFloat(e.target.value) || 0 }))}
                />
                <button onClick={() => adjustScore(c, 0.1)}>+</button>
              </div>
              <span style={{ fontSize: 12, color: 'var(--tms-slate)' }}>Range: 0.0 – 10.0</span>
            </div>
          ))}
        </div>

        <div>
          <div className="tms-content-card" style={{ marginBottom: 16 }}>
            <h3 className="tms-section-header">Deductions</h3>
            <div style={{ marginBottom: 8 }}>
              <label>Time violation: </label>
              <input
                type="number"
                step={0.1}
                value={deductions.time}
                onChange={(e) => setDeductions((d) => ({ ...d, time: parseFloat(e.target.value) || 0 }))}
                style={{ width: 60, padding: 4, marginLeft: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Costume violation: </label>
              <input
                type="number"
                step={0.1}
                value={deductions.costume}
                onChange={(e) => setDeductions((d) => ({ ...d, costume: parseFloat(e.target.value) || 0 }))}
                style={{ width: 60, padding: 4, marginLeft: 8 }}
              />
            </div>
            <div>
              <label>Other deductions: </label>
              <input
                type="number"
                step={0.1}
                value={deductions.other}
                onChange={(e) => setDeductions((d) => ({ ...d, other: parseFloat(e.target.value) || 0 }))}
                style={{ width: 60, padding: 4, marginLeft: 8 }}
              />
            </div>
            <p style={{ marginTop: 12, fontWeight: 600 }}>Total Deductions: {dedTotal}</p>
          </div>

          <div className="tms-content-card">
            <h3 className="tms-section-header">Score Summary</h3>
            <p>Components Total: {compTotal.toFixed(1)} / 50.0</p>
            <p>Deductions: {dedTotal}</p>
            <p style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>
              {finalScore.toFixed(1)} / 50.0 Total
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button className="tms-btn tms-btn-success" onClick={handleSubmit}>✓ Submit Score</button>
        <button className="tms-btn tms-btn-outline">Save Draft</button>
        <button className="tms-btn tms-btn-outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx((i) => i - 1)}>← Previous Athlete</button>
        <button className="tms-btn tms-btn-outline" disabled={currentIdx >= totalParticipants - 1} onClick={() => setCurrentIdx((i) => i + 1)}>Next Athlete →</button>
      </div>
      <p style={{ fontSize: 10, color: 'var(--tms-slate)', marginTop: 12 }}>FR-042 · Score submissions are audit-logged. Draft scores auto-save every 30s (FR-046 offline sync).</p>
    </div>
  );
}
