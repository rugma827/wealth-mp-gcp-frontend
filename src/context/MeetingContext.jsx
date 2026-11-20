import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  fetchTodayMeetings,
  fetchUpcomingMeetings,
  generateMeetingPrep,
  generateDirectClientPrep,
  checkGoogleAuth,
} from '../services/api';
import { useMeeting, useMeetingPrep } from './useMeeting';
import { useAuth } from './AuthContext';

export const MeetingContext = createContext(null);
export { useMeeting, useMeetingPrep };

export function MeetingProvider({ children }) {
  const { userId, googleConnected, setGoogleConnected } = useAuth();

  const [todayMeetings, setTodayMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [scheduleError, setScheduleError] = useState(null);

  const [generating, setGenerating] = useState({});
  const [progress, setProgress] = useState({});
  const [results, setResultsState] = useState({});
  const [genErrors, setGenErrors] = useState({});

  const [settings, setSettings] = useState({
    autoRun: true,
    morningTime: '07:30',
    afternoonTime: '13:00',
    notifySlack: false,
    generatePptx: true,
  });

  const setResult = (key, data) => setResultsState((prev) => ({ ...prev, [key]: data }));
  const setGeneratingFor = (key, val) => setGenerating((prev) => ({ ...prev, [key]: val }));
  const setProgressFor = (key, val) => setProgress((prev) => ({ ...prev, [key]: val }));
  const setGenError = (key, msg) => setGenErrors((prev) => ({ ...prev, [key]: msg }));

  const loadSchedule = useCallback(async () => {
    if (!userId) return;
    setLoadingSchedule(true);
    setScheduleError(null);
    try {
      const [todayRes, upcomingRes] = await Promise.all([
        fetchTodayMeetings(userId),
        fetchUpcomingMeetings(userId),
      ]);
      if (todayRes.ok) setTodayMeetings(todayRes.meetings);
      if (upcomingRes.ok) setUpcomingMeetings(upcomingRes.meetings);
    } catch (err) {
      setScheduleError(err.message);
    } finally {
      setLoadingSchedule(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    checkGoogleAuth(userId).then((res) => {
      if (res.ok && res.data?.status === 'authenticated') {
        setGoogleConnected(true);
        loadSchedule();
      } else if (res.authRequired) {
        setGoogleConnected(false);
        setLoadingSchedule(false);
      }
    });
  }, [userId]);

  const triggerGenerate = useCallback(async (meeting) => {
    const key = meeting.meetingId || meeting.id;
    setGeneratingFor(key, true);
    setProgressFor(key, 10);

    try {
      const res = await generateMeetingPrep({
        userId,
        meetingId: meeting.meetingId || meeting.id,
        clientName: meeting.clientName,
        onProgress: ({ pct }) => setProgressFor(key, pct),
      });

      if (res.ok && res.result) {
        const brief = res.result;
        const targetId = brief?.client?.customerId || brief?.client?.clientId || meeting.clientId || key;

        setResult(targetId, brief);
        setResult(key, brief);

        setTodayMeetings((prev) =>
          prev.map((m) =>
            m.id === meeting.id || m.meetingId === meeting.meetingId
              ? { ...m, status: 'ready', pptxId: brief.pptxId || m.pptxId }
              : m
          )
        );
        setUpcomingMeetings((prev) =>
          prev.map((m) =>
            m.id === meeting.id || m.meetingId === meeting.meetingId
              ? { ...m, status: 'ready', pptxId: brief.pptxId || m.pptxId }
              : m
          )
        );

        setProgressFor(key, 100);
        setGeneratingFor(key, false);
        return { ok: true, clientId: targetId };
      }
      throw new Error(res.error || 'No result returned');
    } catch (err) {
      setGeneratingFor(key, false);
      setProgressFor(key, 0);
      setGenError(key, err.message || 'Generation failed. Please try again.');
      return { ok: false, error: err.message };
    }
  }, [userId]);

  const triggerDirectPrep = useCallback(async (clientName) => {
    const key = `direct-${clientName.toLowerCase().replace(/\s+/g, '-')}`;
    setGeneratingFor(key, true);
    setProgressFor(key, 15);

    try {
      const res = await generateDirectClientPrep(
        clientName,
        ({ pct }) => setProgressFor(key, pct),
        userId
      );

      if (res.ok && res.result) {
        const brief = res.result;
        const resolvedId = brief?.client?.customerId || brief?.client?.clientId || key;
        setResult(resolvedId, brief);
        setResult(key, brief);
        setProgressFor(key, 100);
        setGeneratingFor(key, false);
        return { ok: true, clientId: resolvedId };
      }
      throw new Error(res.error || 'Direct prep could not be generated');
    } catch (err) {
      setGeneratingFor(key, false);
      setProgressFor(key, 0);
      setGenError(key, err.message || 'Generation failed. Please try again.');
      return { ok: false, error: err.message };
    }
  }, [userId]);

  const value = {
    googleConnected,
    setGoogleConnected,
    todayMeetings,
    upcomingMeetings,
    loadingSchedule,
    scheduleError,
    generating,
    progress,
    results,
    settings,
    setSettings,
    refreshSchedule: loadSchedule,
    triggerGenerate,
    triggerDirectPrep,
    setResult,
    setGeneratingFor,
    setProgressFor,
    genErrors,
    setGenError,
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
}
