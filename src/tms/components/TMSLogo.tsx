import { Link } from 'react-router-dom';

interface TMSLogoProps {
  size?: number;
  showLabel?: boolean;
  compact?: boolean;
}

export default function TMSLogo({ size = 44, showLabel = true, compact = false }: TMSLogoProps) {
  return (
    <Link to="/tms" className="tms-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
      <img
        src="/tms-yoga-logo.png"
        alt="WYC 2026 Yogasana Championship"
        style={{ height: size, width: 'auto', objectFit: 'contain' }}
      />
      {showLabel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 0 : 2 }}>
          <span style={{ fontWeight: 700, fontSize: compact ? 14 : 16 }}>WYC 2026</span>
          {!compact && (
            <span style={{ fontSize: 11, opacity: 0.9 }}>World Yogasana Championship</span>
          )}
        </div>
      )}
    </Link>
  );
}
