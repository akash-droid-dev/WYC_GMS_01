import TMSModal from './TMSModal';
import { useTMSStore } from '../store/tmsStore';
import type { Entry } from '../types';

interface EntryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry | null;
}

export default function EntryDetailModal({ isOpen, onClose, entry }: EntryDetailModalProps) {
  if (!entry) return null;

  const getEventById = useTMSStore((s) => s.getEventById);
  const getAthleteById = useTMSStore((s) => s.getAthleteById);
  const teams = useTMSStore((s) => s.teams);

  const ev = getEventById(entry.eventId);
  const athlete = entry.athleteId ? getAthleteById(entry.athleteId) : null;
  const team = entry.teamId ? teams.find((t) => t.id === entry.teamId) : null;

  const rows = [
    { label: 'Entry ID', value: entry.id },
    { label: 'Event', value: ev?.name || entry.eventId },
    { label: 'Discipline', value: ev?.disciplineId?.includes('trad') ? 'Traditional' : ev?.disciplineId?.includes('art') ? 'Artistic' : ev?.disciplineId || '—' },
    { label: 'Type', value: entry.type },
    { label: 'Participant(s)', value: athlete ? athlete.fullName : team ? team.name : '—' },
    { label: 'Status', value: entry.status },
    { label: 'Created', value: new Date(entry.createdAt).toLocaleDateString() },
  ];

  return (
    <TMSModal isOpen={isOpen} onClose={onClose} title="Entry Details">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--tms-slate)', fontWeight: 600, textTransform: 'uppercase', minWidth: 100 }}>{label}</span>
            {label === 'Status' ? (
              <span className={`tms-badge tms-badge-${String(value).toLowerCase()}`}>{value}</span>
            ) : (
              <span style={{ textAlign: 'right' }}>{value}</span>
            )}
          </div>
        ))}
      </div>
    </TMSModal>
  );
}
