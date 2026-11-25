import { getCognitoToken } from '../utils/authCookies';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const MEETING_PREP_URL = `${BASE_URL}/meeting-prep`;

function authHeaders() {
  const token = getCognitoToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function post(path, body, timeoutMs = 300_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${MEETING_PREP_URL}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 401) {
      const detail = await res.json().catch(() => ({}));
      return {
        ok: false,
        status: 401,
        authRequired: true,
        authUrl: detail?.detail?.authorization_url || null,
        error: 'Google authorization required.',
      };
    }
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      return { ok: false, error: detail?.detail?.message || `Server error ${res.status}`, status: res.status };
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') return { ok: false, error: 'Request timed out.' };
    return { ok: false, error: 'Cannot reach the backend. Check your connection.' };
  }
}

export function formatCurrency(amount) {
  if (amount == null) return '$0';
  if (typeof amount === 'string' && amount.startsWith('$')) return amount;
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return String(amount);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

export async function checkGoogleAuth(userId) {
  return post('/check-auth', { user_id: userId });
}

export async function fetchTodayMeetings(userId) {
  const res = await post('/calendar-events', { user_id: userId });
  if (!res.ok) return { ok: false, meetings: [], error: res.error };

  const rawEvents = res.data?.events || [];
  const meetings = rawEvents.map((ev, idx) => {
    const startRaw = ev.start?.dateTime || ev.start?.date || '';
    let timeFormatted = 'Today';
    if (startRaw.includes('T')) {
      timeFormatted = new Date(startRaw).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return {
      id: ev.id || `live-${idx}`,
      meetingId: ev.id || `live-meet-${idx}`,
      clientId: ev.client_id || ev.id || `live-${idx}`,
      clientName: ev.client_name || ev.summary?.split(' - ')[0] || ev.summary || 'Client Meeting',
      time: timeFormatted,
      duration: '45m',
      status: ev.prep_ready ? 'ready' : 'not_generated',
      meetingType: ev.summary || 'Client Meeting',
      channel: ev.location ? 'In-person' : 'Google Meet',
      tier: 'Advisory Client',
      aum: '$750,000',
      riskStatus: 'MEDIUM',
      sentiment: 'Neutral',
      meetingGoal: 'Periodic Portfolio Review',
      location: ev.location || 'Virtual',
      pptxId: ev.pptx_id || null,
      isLive: true,
    };
  });

  return { ok: true, meetings, source: 'live' };
}

export async function fetchUpcomingMeetings(userId, numDays = 5) {
  const res = await post('/upcoming-events', { user_id: userId, day_offset: 1, num_days: numDays });
  if (!res.ok) return { ok: false, meetings: [], error: res.error };

  const rawEvents = res.data?.events || [];
  const meetings = rawEvents.map((ev, idx) => ({
    id: ev.id || `up-${idx}`,
    meetingId: ev.id || `up-meet-${idx}`,
    clientId: ev.client_id || ev.id || `up-${idx}`,
    clientName: ev.client_name || ev.summary || 'Client',
    dateLabel: ev.start?.date || 'Upcoming',
    time: ev.start?.dateTime
      ? new Date(ev.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '10:00 AM',
    duration: '45m',
    status: 'not_generated',
    meetingType: ev.summary || 'Scheduled Consultation',
    channel: 'Video Call',
    tier: 'Standard',
    aum: '$500,000',
    riskStatus: 'LOW',
    sentiment: 'Neutral',
    meetingGoal: 'Quarterly Check-in',
    location: 'Virtual',
    pptxId: null,
    isLive: true,
  }));

  return { ok: true, meetings, source: 'live' };
}

async function streamProgress(taskId, onProgress) {
  const token = getCognitoToken();
  const res = await fetch(`${MEETING_PREP_URL}/progress/${taskId}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
  });
  if (!res.ok || !res.body) return null;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let finalResult = null;
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const event = JSON.parse(line.slice(6));
        if (event.type === 'result') { finalResult = event.result; }
        else { onProgress({ pct: event.pct, label: event.message }); }
      } catch (_) {}
    }
    if (finalResult) break;
  }
  return finalResult;
}

export async function generateMeetingPrep({ userId, meetingId, clientName, onProgress }) {
  const notifyProgress = (pct, label) => typeof onProgress === 'function' && onProgress({ pct, label });
  notifyProgress(5, 'Initiating meeting prep...');
  const res = await post('/client-prep-direct', { user_id: userId, client_name: meetingId || clientName, force_refresh: true });
  if (!res.ok) return { ok: false, error: res.error };
  const taskId = res.data?.task_id;
  if (!taskId) return { ok: false, error: 'No task ID returned from server.' };
  const result = await streamProgress(taskId, ({ pct, label }) => notifyProgress(pct, label));
  if (!result) return { ok: false, error: 'Progress stream ended without a result.' };
  if (result.status === 'error') return { ok: false, error: result.message || 'Meeting prep failed.' };
  return { ok: true, result };
}

export async function generateDirectClientPrep(clientName, onProgress, userId) {
  const notifyProgress = (pct, label) => typeof onProgress === 'function' && onProgress({ pct, label });
  notifyProgress(5, `Resolving client "${clientName}"...`);
  const res = await post('/client-prep-direct', { user_id: userId, client_name: clientName, force_refresh: true });
  if (!res.ok) return { ok: false, error: res.error };
  const taskId = res.data?.task_id;
  if (!taskId) return { ok: false, error: 'No task ID returned from server.' };
  const result = await streamProgress(taskId, ({ pct, label }) => notifyProgress(pct, label));
  if (!result) return { ok: false, error: 'Progress stream ended without a result.' };
  if (result.status === 'error') return { ok: false, error: result.message || 'Meeting prep failed.' };
  return { ok: true, result };
}

export function getPptxDownloadUrl(pptxId) {
  if (!pptxId) return '#';
  return `${MEETING_PREP_URL}/download-pptx/${pptxId}`;
}
