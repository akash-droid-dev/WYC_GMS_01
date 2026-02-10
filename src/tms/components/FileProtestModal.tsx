import { useState } from 'react';
import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';

interface FileProtestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileProtestModal({ isOpen, onClose }: FileProtestModalProps) {
  const addProtest = useTMSStore((s) => s.addProtest);
  const medalEvents = useTMSStore((s) => s.medalEvents);
  const results = useTMSStore((s) => s.results);

  const [eventId, setEventId] = useState('');
  const [subject, setSubject] = useState('');
  const [evidence, setEvidence] = useState('');

  const eventsWithResults = medalEvents.filter((e) =>
    results.some((r) => r.eventId === e.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !subject.trim()) return;
    addProtest({
      eventId,
      subject: subject.trim(),
      evidence: evidence ? evidence.split(',').map((s) => s.trim()).filter(Boolean) : [],
    });
    onClose();
    setEventId('');
    setSubject('');
    setEvidence('');
  };

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="File Protest · FR-054">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 16 }}>
          Select event, provide reason. Evidence optional. Decision authority will review.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Event *</label>
            <select
              required
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            >
              <option value="">Select event...</option>
              {eventsWithResults.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Subject / Reason *</label>
            <textarea
              required
              placeholder="Describe the protest (e.g. Score dispute · J3 assessment)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Evidence (comma-separated filenames)</label>
            <input
              type="text"
              placeholder="video_clip.mp4, scorecard_scan.pdf"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" className="tms-btn tms-btn-primary">File Protest</button>
          <button type="button" className="tms-btn tms-btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </TMSModal>
  );
}
