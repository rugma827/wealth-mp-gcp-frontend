import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { getCognitoToken, getSessionId, isAccessTokenExpired, updateAuthTokens, clearAuthCookies, clearLegacyAuthStorage } from './utils/authCookies';
import { refreshFirebaseToken } from './utils/firebase';

let _sessionInvalidating = false;
function handleSessionInvalidated() {
  if (_sessionInvalidating) return;
  _sessionInvalidating = true;
  clearAuthCookies();
  clearLegacyAuthStorage();
  localStorage.removeItem('googleCalConnected');
  window.location.replace('/login?sessionExpired=1');
}

const _originalFetch = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input?.url || '';
  const isBackend = url.includes('localhost:8000') || url.includes('.run.app');

  if (isBackend) {
    if (isAccessTokenExpired()) {
      const refreshed = await refreshFirebaseToken();
      if (refreshed) {
        updateAuthTokens(refreshed);
      } else {
        handleSessionInvalidated();
        return new Response(JSON.stringify({ detail: 'Session invalidated' }), { status: 401 });
      }
    }
    const headers = new Headers(init.headers || {});
    const token = getCognitoToken();
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
    const sessionId = getSessionId();
    if (sessionId && !headers.has('X-Session-ID')) headers.set('X-Session-ID', sessionId);
    init = { ...init, headers };
  }

  const response = await _originalFetch(input, init);

  if (isBackend && response.status === 401) {
    try {
      const body = await response.clone().json();
      if (body?.detail === 'Session invalidated') handleSessionInvalidated();
    } catch { /* non-JSON 401 */ }
  }

  return response;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
