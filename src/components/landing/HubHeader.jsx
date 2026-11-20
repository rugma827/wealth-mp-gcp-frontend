import React from 'react';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Database,
  Radio,
} from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';
import './landing.css';

export default function HubHeader({ onOpenSearch, onOpenSettings }) {
  const {
    isDemoMode,
    setIsDemoMode,
    googleConnected,
    refreshSchedule,
    loadingSchedule,
  } = useMeeting();

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="hub-header glass-panel">
      <div className="hub-header__left">
        <div className="hub-brand">
          <div className="hub-brand__icon">
            <Sparkles size={20} className="hub-brand__sparkle" />
          </div>
          <div>
            <div className="hub-brand__title-row">
              <h1 className="hub-brand__title">Meeting Intelligence</h1>
              <span className="hub-brand__version">v2.4 Standalone</span>
            </div>
            <p className="hub-brand__subtitle">
              Agentic Wealth Advisor · Calendar Sync & Pre-Meeting Briefs
            </p>
          </div>
        </div>

        <div className="hub-header__divider" />

        <div className="hub-date-pill">
          <Calendar size={14} className="hub-date-icon" />
          <span>{todayDate}</span>
        </div>
      </div>

      <div className="hub-header__right">
        {/* Live vs Mock Mode Switch */}
        <button
          className={`mode-toggle-btn ${isDemoMode ? 'mode-toggle-btn--demo' : 'mode-toggle-btn--live'}`}
          onClick={() => setIsDemoMode(!isDemoMode)}
          title="Toggle between Live FastAPI Backend and Synthetic Demo Data"
        >
          {isDemoMode ? (
            <>
              <Database size={13} />
              <span>Demo Data Mode</span>
            </>
          ) : (
            <>
              <Radio size={13} className="live-pulse" />
              <span>Live Backend Mode</span>
            </>
          )}
        </button>

        {/* Google Calendar Status Pill */}
        <div className="calendar-status-pill">
          {googleConnected ? (
            <>
              <CheckCircle2 size={13} className="text-success" />
              <span>Google Calendar Synced</span>
            </>
          ) : (
            <>
              <AlertCircle size={13} className="text-warning" />
              <span>Calendar Disconnected</span>
            </>
          )}
        </div>

        {/* Refresh Schedule Button */}
        <button
          className="btn-icon"
          onClick={refreshSchedule}
          disabled={loadingSchedule}
          title="Refresh calendar & briefs"
        >
          <RefreshCw size={15} className={loadingSchedule ? 'animate-spin' : ''} />
        </button>

        {/* Ad-Hoc Direct Prep Trigger */}
        <button className="btn-secondary" onClick={onOpenSearch}>
          <Search size={14} />
          <span>Direct Client Prep</span>
        </button>

        {/* Settings Button */}
        <button className="btn-icon" onClick={onOpenSettings} title="Intelligence Settings">
          <SlidersHorizontal size={15} />
        </button>
      </div>
    </header>
  );
}
