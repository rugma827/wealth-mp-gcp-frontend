const AUTH_COOKIE_MAX_AGE_SECONDS = 8 * 60 * 60;

const AUTH_COOKIE_NAMES = {
  accessToken: 'access_token',
  idToken: 'id_token',
  refreshToken: 'refresh_token',
  sessionStart: 'session_start',
  isAuthenticated: 'is_authenticated',
  sessionId: 'session_id',
};

function isSecureContext() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function buildCookieOptions(maxAgeSeconds = AUTH_COOKIE_MAX_AGE_SECONDS) {
  const parts = ['Path=/', 'SameSite=Lax', `Max-Age=${maxAgeSeconds}`];
  if (isSecureContext()) parts.push('Secure');
  return parts.join('; ');
}

function setCookie(name, value, maxAgeSeconds = AUTH_COOKIE_MAX_AGE_SECONDS) {
  document.cookie = `${name}=${value}; ${buildCookieOptions(maxAgeSeconds)}`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${isSecureContext() ? '; Secure' : ''}`;
}

function getCookie(name) {
  const prefix = `${name}=`;
  const cookie = document.cookie.split('; ').find((e) => e.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length) : '';
}

export function persistAuthTokens(tokens) {
  setCookie(AUTH_COOKIE_NAMES.accessToken, tokens.accessToken);
  setCookie(AUTH_COOKIE_NAMES.idToken, tokens.idToken);
  setCookie(AUTH_COOKIE_NAMES.refreshToken, tokens.refreshToken);
  setCookie(AUTH_COOKIE_NAMES.sessionStart, Date.now().toString());
  setCookie(AUTH_COOKIE_NAMES.isAuthenticated, 'true');
}

export function updateAuthTokens(tokens) {
  setCookie(AUTH_COOKIE_NAMES.accessToken, tokens.accessToken);
  setCookie(AUTH_COOKIE_NAMES.idToken, tokens.idToken);
}

export function clearAuthCookies() {
  Object.values(AUTH_COOKIE_NAMES).forEach(deleteCookie);
}

export function hasAuthCookies() {
  return Boolean(
    getCookie(AUTH_COOKIE_NAMES.accessToken) &&
    getCookie(AUTH_COOKIE_NAMES.idToken) &&
    getCookie(AUTH_COOKIE_NAMES.refreshToken) &&
    getCookie(AUTH_COOKIE_NAMES.isAuthenticated) === 'true'
  );
}

export function touchAuthSessionStart() {
  setCookie(AUTH_COOKIE_NAMES.sessionStart, Date.now().toString());
}

export function clearLegacyAuthStorage() {
  localStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('id_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('session_start');
}

// --- localStorage-based session (used when cookies are blocked in iframes) ---
const LS_PREFIX = 'wa_sso_';

export function persistSsoSession(token, email) {
  localStorage.setItem(`${LS_PREFIX}access_token`, token);
  localStorage.setItem(`${LS_PREFIX}session_start`, Date.now().toString());
  localStorage.setItem(`${LS_PREFIX}email`, email);
}

export function clearSsoSession() {
  [`${LS_PREFIX}access_token`, `${LS_PREFIX}session_start`, `${LS_PREFIX}email`]
    .forEach((k) => localStorage.removeItem(k));
}

export function hasSsoSession() {
  return Boolean(localStorage.getItem(`${LS_PREFIX}access_token`));
}

export function getSsoToken() {
  return localStorage.getItem(`${LS_PREFIX}access_token`) || '';
}

export function getSsoEmail() {
  return localStorage.getItem(`${LS_PREFIX}email`) || '';
}

export function touchSsoSessionStart() {
  localStorage.setItem(`${LS_PREFIX}session_start`, Date.now().toString());
}

export function isSsoSessionExpired(timeoutMs) {
  const raw = localStorage.getItem(`${LS_PREFIX}session_start`);
  const sessionStart = parseInt(raw, 10);
  if (isNaN(sessionStart)) return true;
  return Date.now() - sessionStart >= timeoutMs;
}

export function getCognitoToken() {
  return getCookie(AUTH_COOKIE_NAMES.accessToken) || localStorage.getItem('wa_sso_access_token') || '';
}

export function getRefreshToken() {
  return getCookie(AUTH_COOKIE_NAMES.refreshToken) || '';
}

export function isAccessTokenExpired() {
  const token = getCognitoToken();
  if (!token) return true;
  try {
    const b64 = token.split('.')[1];
    const payload = JSON.parse(atob(b64.replace(/-/g, '+').replace(/_/g, '/')));
    return (payload.exp * 1000) - Date.now() < 60_000;
  } catch {
    return true;
  }
}

export function getSessionId() {
  return getCookie(AUTH_COOKIE_NAMES.sessionId) || '';
}

export function isAuthSessionExpired(timeoutMs) {
  const raw = getCookie(AUTH_COOKIE_NAMES.sessionStart) || localStorage.getItem('wa_sso_session_start');
  const sessionStart = parseInt(raw, 10);
  if (isNaN(sessionStart)) return true;
  return Date.now() - sessionStart >= timeoutMs;
}
