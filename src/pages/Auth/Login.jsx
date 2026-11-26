import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signInWithFirebase } from '../../utils/firebase';
import { persistAuthTokens } from '../../utils/authCookies';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, ssoLoggedOut } = useAuth();

  const sessionExpired =
    location.state?.sessionExpired ||
    new URLSearchParams(location.search).get('sessionExpired');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [alertmsg, setAlertmsg] = useState(sessionExpired ? 'Session expired. Please sign in again.' : '');
  const [alertColor, setAlertColor] = useState(sessionExpired ? 'text-error' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearAlert = () => { setAlertmsg(''); setAlertColor(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlertmsg('Please enter both email and password.');
      setAlertColor('text-error');
      return;
    }

    if (!isConsentChecked) {
      setAlertmsg('Please agree to the Terms of Use and Privacy Policy.');
      setAlertColor('text-error');
      return;
    }

    try {
      setIsSubmitting(true);
      const tokens = await signInWithFirebase(email, password);
      persistAuthTokens(tokens);
      login(email);
      navigate('/google-connect');
    } catch (err) {
      const code = err?.code || '';
      let msg = 'Login failed. Please try again.';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password. Please try again.';
      } else if (code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a moment and try again.';
      } else if (code === 'auth/user-disabled') {
        msg = 'This account has been disabled. Please contact your administrator.';
      } else if (err?.message) {
        msg = err.message;
      }
      setAlertmsg(msg);
      setAlertColor('text-error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (ssoLoggedOut) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', gap: '16px' }}>
          <LogOut size={36} style={{ color: '#64748B', margin: '0 auto' }} />
          <h2 className="auth-welcome">Session Ended</h2>
          <p className="auth-subtitle">You have been signed out.<br />Please return to the main application to launch again.</p>
          <footer className="auth-footer" style={{ marginTop: '24px' }}>
            <span>© 2026 Wealth Management</span>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Wealth Management Platform</h1>
        <h2 className="auth-welcome">Welcome Back</h2>
        <p className="auth-subtitle">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={clearAlert}
              placeholder="Enter your email"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="form-group--password">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={clearAlert}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="consent-checkbox">
            <label>
              <input
                type="checkbox"
                checked={isConsentChecked}
                onChange={(e) => { setIsConsentChecked(e.target.checked); clearAlert(); }}
              />
              <span>
                I agree to the{' '}
                <button type="button" className="link-inline">Terms of Use</button>
                {' '}and{' '}
                <button type="button" className="link-inline">Privacy Policy</button>
              </span>
            </label>
          </div>

          {alertmsg && <p className={`alert-message ${alertColor}`}>{alertmsg}</p>}

          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <footer className="auth-footer">
          <button type="button">Terms of Use</button>
          <span>|</span>
          <button type="button">Privacy Policy</button>
          <span>|</span>
          <span>© 2026 Wealth Management</span>
        </footer>
      </div>
    </div>
  );
}
