import { useState } from 'react';
import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';

interface RequestEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ASSIGNED_EVENT_IDS = ['trad-ind-subjr-M', 'art-pair-jra-F', 'rhythm-ind-sra-F', 'free-ind-subjr-F'];

export default function RequestEventModal({ isOpen, onClose }: RequestEventModalProps) {
  const requestJudgeEvent = useTMSStore((s) => s.requestJudgeEvent);
  const judgeRequestedEvents = useTMSStore((s) => s.judgeRequestedEvents);
  const medalEvents = useTMSStore((s) => s.medalEvents);
  const sessions = useTMSStore((s) => s.sessions);

  const [eventId, setEventId] = useState('');

  const availableEvents = medalEvents.filter(
    (e) => !ASSIGNED_EVENT_IDS.includes(e.id) && !judgeRequestedEvents.includes(e.id)
  );

  const getSessionInfo = (evId: string) => {
    const s = sessions.find((sess) => sess.eventId === evId);
    return s ? `${s.matId} · ${s.startTime}` : '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventId) {
      requestJudgeEvent(eventId);
      onClose();
      setEventId('');
    }
  };

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="Request Event Assignment · FR-041">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: 12, color: 'var(--tms-slate)', marginBottom: 16 }}>
          Request to be assigned to an event. Chief Judge / Tech Admin will review and approve.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Select Event</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            >
              <option value="">Select event...</option>
              {availableEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} {getSessionInfo(ev.id) && `· ${getSessionInfo(ev.id)}`}
                </option>
              ))}
              {availableEvents.length === 0 && <option disabled>All events assigned or requested</option>}
            </select>
          </div>
          {judgeRequestedEvents.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--tms-teal)' }}>
              Pending: {judgeRequestedEvents.length} event(s) awaiting approval
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" className="tms-btn tms-btn-primary" disabled={!eventId}>
            Request Assignment
          </button>
          <button type="button" className="tms-btn tms-btn-outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </TMSModal>
  );
}
