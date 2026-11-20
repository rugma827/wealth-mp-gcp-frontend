import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkGoogleAuth } from '../../services/api';
import './Auth.css';

const POLL_INTERVAL_MS = 3000;

export default function GoogleConnect() {
  const navigate = useNavigate();
  const { userId, setGoogleConnected } = useAuth();

  const [status, setStatus] = useState('checking'); // checking | idle | waiting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [authUrl, setAuthUrl] = useState(null);
  const popupRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    silentCheck();
    return () => stopPolling();
  }, []);

  async function silentCheck() {
    setStatus('checking');
    const res = await checkGoogleAuth(userId);

    if (!res.ok && !res.authRequired) {
      setStatus('error');
      setErrorMsg(res.error || 'Could not reach the backend.');
      return;
    }

    if (res.ok && res.data?.status === 'authenticated') {
      setGoogleConnected(true);
      navigate('/', { replace: true });
      return;
    }

    const url = res.authUrl || res.data?.authorization_url || null;
    if (!url) {
      setStatus('error');
      setErrorMsg(res.error || 'Could not retrieve Google authorization URL.');
      return;
    }
    setAuthUrl(url);
    setStatus('idle');
  }

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  function handleConnect() {
    if (!authUrl) { silentCheck(); return; }

    const w = 500, h = 650;
    const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - h) / 2);

    const popup = window.open(authUrl, 'googleAuth',
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`);

    if (!popup) {
      setStatus('error');
      setErrorMsg('Popup was blocked. Please allow popups for this site and try again.');
      return;
    }

    popupRef.current = popup;
    setStatus('waiting');
    startPolling();
  }

  function startPolling() {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const res = await checkGoogleAuth(userId);
      if (res.ok && res.data?.status === 'authenticated') {
        stopPolling();
        try { if (popupRef.current && !popupRef.current.closed) popupRef.current.close(); } catch { /* COOP */ }
        handleSuccess();
      }
    }, POLL_INTERVAL_MS);
  }

  function handleSuccess() {
    setGoogleConnected(true);
    setStatus('success');
    setTimeout(() => navigate('/', { replace: true }), 1500);
  }

  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type === 'google_auth_success') {
        stopPolling();
        try { if (popupRef.current && !popupRef.current.closed) popupRef.current.close(); } catch { /* COOP */ }
        handleSuccess();
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="auth-root">
      <div className="gc-card">
        <h1 className="auth-title">Wealth Management Platform</h1>

        {status === 'checking' && (
          <>
            <Loader size={28} className="gc-spin" style={{ color: '#10b981' }} />
            <p className="gc-title">Checking calendar connection...</p>
          </>
        )}

        {status === 'idle' && (
          <>
            <Calendar size={32} style={{ color: '#10b981' }} />
            <p className="gc-title">Connect Google Calendar</p>
            <p className="gc-subtitle">
              Allow one-time access so Meeting Intelligence can read your schedule
              and prepare AI-powered briefs before each client call.
            </p>
            <button className="gc-btn" onClick={handleConnect} disabled={!authUrl}>
              {authUrl ? 'Connect with Google' : 'Loading...'}
            </button>
            <button className="gc-skip-btn" onClick={() => navigate('/', { replace: true })}>
              Skip for now — I'll connect later
            </button>
          </>
        )}

        {status === 'waiting' && (
          <>
            <Loader size={28} className="gc-spin" style={{ color: '#10b981' }} />
            <p className="gc-title">Waiting for Google authorization</p>
            <p className="gc-subtitle">Complete the sign-in in the popup window.</p>
            <button className="gc-skip-btn" onClick={() => { stopPolling(); setStatus('idle'); }}>
              Cancel
            </button>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={40} style={{ color: '#10b981' }} />
            <p className="gc-title" style={{ color: '#10b981' }}>Google Calendar connected</p>
            <p className="gc-subtitle">Taking you to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={28} style={{ color: '#ef4444' }} />
            <p className="gc-title" style={{ color: '#ef4444' }}>Could not reach the service</p>
            <p className="gc-error">{errorMsg}</p>
            <button className="gc-btn" onClick={silentCheck}>Retry</button>
            <button className="gc-skip-btn" onClick={() => navigate('/', { replace: true })}>
              Skip for now
            </button>
          </>
        )}

        <footer className="auth-footer">Read-only calendar access · © 2026 Wealth Management</footer>
      </div>
    </div>
  );
}
