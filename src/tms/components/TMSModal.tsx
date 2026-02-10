import { ReactNode } from 'react';

interface TMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function TMSModal({ isOpen, onClose, title, children }: TMSModalProps) {
  if (!isOpen) return null;
  return (
    <div className="tms-modal-overlay" onClick={onClose}>
      <div
        className="tms-content-card tms-modal-content"
        style={{
          maxWidth: 540,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          margin: 20,
          boxShadow: '0 24px 48px rgba(10, 22, 40, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="tms-section-header" style={{ margin: 0 }}>{title}</h2>
          <button className="tms-btn tms-btn-outline" onClick={onClose} style={{ padding: '4px 12px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
