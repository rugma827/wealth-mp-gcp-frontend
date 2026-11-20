import { useContext } from 'react';
import { MeetingContext } from './MeetingContext';

export function useMeeting() {
  const ctx = useContext(MeetingContext);
  if (!ctx) throw new Error('useMeeting must be used within a MeetingProvider');
  return ctx;
}

export function useMeetingPrep() {
  return useMeeting();
}
