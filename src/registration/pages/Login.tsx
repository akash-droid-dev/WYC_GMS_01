import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegistrationLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [message, setMessage] = useState('');

  const sendOtp = () => {
    if (!email.trim()) {
      setMessage('Please enter email.');
      return;
    }
    setMessage('OTP sent (demo: use any 6 digits).');
    setStep('otp');
  };

  const verifyOtp = () => {
    if (otp.length >= 4) {
      setMessage('Login successful.');
      setTimeout(() => navigate('/registration'), 500);
    } else {
      setMessage('Enter a valid OTP (demo: any 4+ digits).');
    }
  };

  return (
    <div className="tms-content-card" style={{ maxWidth: 420, margin: '60px auto' }}>
      <h1 className="tms-page-title">WYC 2026 Registration</h1>
      <p style={{ color: 'var(--tms-slate)', marginBottom: 24 }}>
        National: Mobile OTP · International: Email OTP (FRD REG-001)
      </p>
      {step === 'email' && (
        <>
          <label className="tms-label">Email</label>
          <input
            type="email"
            className="tms-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammanager@federation.org"
          />
          <button type="button" className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={sendOtp}>
            Send OTP
          </button>
        </>
      )}
      {step === 'otp' && (
        <>
          <label className="tms-label">OTP</label>
          <input
            type="text"
            className="tms-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter OTP"
          />
          <button type="button" className="tms-btn tms-btn-primary" style={{ marginTop: 16 }} onClick={verifyOtp}>
            Verify & Login
          </button>
          <button
            type="button"
            className="tms-btn tms-btn-secondary"
            style={{ marginTop: 8 }}
            onClick={() => setStep('email')}
          >
            Change email
          </button>
        </>
      )}
      {message && <p style={{ marginTop: 16, color: 'var(--tms-teal)', fontSize: 14 }}>{message}</p>}
      <p style={{ marginTop: 24, fontSize: 12, color: 'var(--tms-slate)' }}>
        <Link to="/tms">← Back to TMS Public</Link>
      </p>
    </div>
  );
}
