import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  clearAuthCookies,
  clearLegacyAuthStorage,
  hasAuthCookies,
  isAuthSessionExpired,
  touchAuthSessionStart,
  persistAuthTokens,
  persistSsoSession,
  clearSsoSession,
  hasSsoSession,
  getSsoEmail,
  touchSsoSessionStart,
  isSsoSessionExpired,
} from '../utils/authCookies';
import { verifyUrlIdToken } from '../utils/firebase';

const AuthContext = createContext();
const SESSION_TIMEOUT = 30 * 60 * 1000;
const ABSOLUTE_SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => (hasAuthCookies() && !isAuthSessionExpired(SESSION_TIMEOUT)) ||
          (hasSsoSession() && !isSsoSessionExpired(SESSION_TIMEOUT))
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem('advisorUserId') || getSsoEmail() || ''
  );
  const [googleConnected, setGoogleConnectedState] = useState(
    () => localStorage.getItem('googleCalConnected') === 'true'
  );
  const [ready, setReady] = useState(false);
  const timerRef = useRef(null);
  const absoluteTimerRef = useRef(null);
  const absoluteEmailRef = useRef('');

  const logout = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(absoluteTimerRef.current);
    clearAuthCookies();
    clearSsoSession();
    clearLegacyAuthStorage();
    localStorage.removeItem('googleCalConnected');
    setIsAuthenticated(false);
    setUserId('');
    setGoogleConnectedState(false);
  }, []);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, SESSION_TIMEOUT);
  }, [isAuthenticated, logout]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlIdToken = params.get('idToken');
    const urlEmail = params.get('email');

    if (urlIdToken && urlEmail) {
      const { valid } = verifyUrlIdToken(urlIdToken);
      window.history.replaceState({}, '', window.location.pathname);
      if (valid) {
        persistSsoSession(urlIdToken, urlEmail);
        clearLegacyAuthStorage();
        localStorage.setItem('advisorUserId', urlEmail);
        setUserId(urlEmail);
        setIsAuthenticated(true);
      } else {
        window.location.replace('/login?sessionExpired=1');
        return;
      }
    }
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (email) => {
    touchAuthSessionStart();
    clearLegacyAuthStorage();
    if (email) {
      localStorage.setItem('advisorUserId', email);
      setUserId(email);
      absoluteEmailRef.current = email;
    }
    setIsAuthenticated(true);
  };

  const setGoogleConnected = (val) => {
    if (val) localStorage.setItem('googleCalConnected', 'true');
    else localStorage.removeItem('googleCalConnected');
    setGoogleConnectedState(val);
  };

  useEffect(() => {
    clearLegacyAuthStorage();
    const cookieOk = hasAuthCookies() && !isAuthSessionExpired(SESSION_TIMEOUT);
    const ssoOk = hasSsoSession() && !isSsoSessionExpired(SESSION_TIMEOUT);
    if (!cookieOk && !ssoOk) { setIsAuthenticated(false); return; }
    if (!isAuthenticated) return;

    resetTimer();
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (hasAuthCookies()) touchAuthSessionStart();
      if (hasSsoSession()) touchSsoSessionStart();
      resetTimer();
    };
    events.forEach((e) => window.addEventListener(e, handleActivity));
    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  }, [isAuthenticated, resetTimer, logout]);

  useEffect(() => {
    if (!isAuthenticated) return;
    clearTimeout(absoluteTimerRef.current);
    absoluteTimerRef.current = setTimeout(logout, ABSOLUTE_SESSION_TIMEOUT);
    return () => clearTimeout(absoluteTimerRef.current);
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{
      isAuthenticated, userId, googleConnected,
      login, logout, setGoogleConnected,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
