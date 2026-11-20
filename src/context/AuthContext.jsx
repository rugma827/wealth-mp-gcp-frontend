import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  clearAuthCookies,
  clearLegacyAuthStorage,
  hasAuthCookies,
  isAuthSessionExpired,
  touchAuthSessionStart,
} from '../utils/authCookies';

const AuthContext = createContext();
const SESSION_TIMEOUT = 30 * 60 * 1000;
const ABSOLUTE_SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => hasAuthCookies() && !isAuthSessionExpired(SESSION_TIMEOUT)
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem('advisorUserId') || ''
  );
  const [googleConnected, setGoogleConnectedState] = useState(
    () => localStorage.getItem('googleCalConnected') === 'true'
  );
  const timerRef = useRef(null);
  const absoluteTimerRef = useRef(null);
  const absoluteEmailRef = useRef('');

  const logout = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(absoluteTimerRef.current);
    clearAuthCookies();
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
    if (!hasAuthCookies()) { setIsAuthenticated(false); return; }
    if (isAuthSessionExpired(SESSION_TIMEOUT)) { logout(); return; }
    if (!isAuthenticated) return;

    resetTimer();
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => { touchAuthSessionStart(); resetTimer(); };
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
