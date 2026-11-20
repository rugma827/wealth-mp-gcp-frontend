import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Search,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  Download,
  Video,
  Phone,
  Building,
  CheckCircle2,
  Copy,
  Check,
  Target,
  Shield,
  Loader2,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Compass,
  Zap,
  FolderDown,
  UserCheck,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { useMeeting } from '../context/useMeeting';
import { useAuth } from '../context/AuthContext';
import { getPptxDownloadUrl } from '../services/api';
import AIBadge from '../components/AIBadge';
import SettingsModal from '../components/landing/SettingsModal';
import DirectPrepModal from '../components/landing/DirectPrepModal';
import './LandingPage.css';

// Gradient palette for client avatar monograms
const AVATAR_GRADIENTS = {
  'C005': 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)',      // David Thompson - Emerald
  'C012': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',      // Kevin Smyth - Amber
  '15600001': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',  // Alex Morgan - Blue
  '15634602': 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',  // Mary Hargrave - Rose
  'default': 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
};

function getInitials(name = '') {
  if (!name) return 'CL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getMeetingHighlight(m) {
  const id = m.clientId || m.id;
  if (id === 'C005') {
    return {
      type: 'critical',
      tag: 'Critical Idle Cash (22%)',
      text: '22.0% Cash vs 10% IPS ceiling ($350K idle) — performance dilution & Reg BI review trigger',
    };
  }
  if (id === '15600001') {
    return {
      type: 'warn',
      tag: 'Equity Drift (+7.4%)',
      text: '8% underweight equities vs target; Phase-1 $10K rebalance order approved',
    };
  }
  if (id === 'C012') {
    return {
      type: 'critical',
      tag: 'Defensive Drag (40%)',
      text: 'Defensive 40.0% cash cushion; 2 consecutive deferrals creates suitability review trigger',
    };
  }
  return {
    type: 'info',
    tag: 'Volatility Sentiment',
    text: 'Client exhibits anxiety regarding market pullbacks; behavioral reassurance needed',
  };
}

export default function LandingPage() {
  const navigate = useNavigate();
  const {
    googleConnected,
    todayMeetings,
    upcomingMeetings,
    loadingSchedule,
    scheduleError,
    generating,
    progress,
    results,
    genErrors,
    setGenError,
    refreshSchedule,
    triggerGenerate,
    setGeneratingFor,
  } = useMeeting();

  const { userId, logout } = useAuth();
  const advisorName = 'Derik Shaju';

  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { setProfileOpen(false); logout(); };

  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showDirectPrep, setShowDirectPrep] = useState(false);

  // Calendar — initialise to today's real date
  const _today = new Date();
  const [calMonth, setCalMonth] = useState(_today.getMonth());
  const [calYear, setCalYear] = useState(_today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(_today.getDate());

  const activeGeneratingKey = useMemo(() => {
    return Object.keys(generating || {}).find((k) => !!generating[k]) || null;
  }, [generating]);

  const isGenerating = Boolean(activeGeneratingKey);
  const currentProgressPct = activeGeneratingKey
    ? (typeof progress[activeGeneratingKey] === 'number'
        ? progress[activeGeneratingKey]
        : progress[activeGeneratingKey]?.pct || 45)
    : 0;

  const activeRoster = activeTab === 'today' ? todayMeetings : upcomingMeetings;

  // Filter roster by client name, topic, or ID
  const filteredMeetings = useMemo(() => {
    if (!searchQuery.trim()) return activeRoster;
    const q = searchQuery.toLowerCase();
    return activeRoster.filter(
      (m) =>
        (m.clientName || '').toLowerCase().includes(q) ||
        (m.meetingType || '').toLowerCase().includes(q) ||
        (m.clientId || '').toLowerCase().includes(q)
    );
  }, [activeRoster, searchQuery]);

  const handleActionClick = async (meeting) => {
    const key = meeting.meetingId || meeting.id;
    setGenError(key, null);
    if (meeting.status === 'ready') {
      navigate(`/prep/${meeting.clientId || meeting.id}`);
    } else {
      const res = await triggerGenerate(meeting);
      if (res && res.ok) {
        navigate(`/prep/${res.clientId || meeting.clientId}`);
      }
    }
  };

  const renderChannelIcon = (channel = '') => {
    const c = channel.toLowerCase();
    if (c.includes('video') || c.includes('teams') || c.includes('zoom')) {
      return <Video size={12} />;
    }
    if (c.includes('phone')) return <Phone size={12} />;
    return <Building size={12} />;
  };

  // Monthly Calendar Helper Computations
  const monthName = new Date(calYear, calMonth).toLocaleString('en-US', { month: 'long' });
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 is Sun

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, empty: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      // Mark days that have live meetings
      const hasEvents = todayMeetings.some(m => {
        const raw = m.startRaw || '';
        if (!raw) return false;
        const d2 = new Date(raw);
        return d2.getMonth() === calMonth && d2.getFullYear() === calYear && d2.getDate() === d;
      });
      days.push({ day: d, empty: false, hasEvents });
    }
    return days;
  }, [calMonth, calYear, daysInMonth, firstDayIndex, todayMeetings]);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(y => y - 1);
    } else {
      setCalMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(y => y + 1);
    } else {
      setCalMonth(m => m + 1);
    }
  };

  return (
    <div className="hub-root animate-fade-in">
      {/* ── 1. Top Executive Command Bar ── */}
      <header className="hub-top-bar">
        <div className="hub-brand-group">
          <div className="hub-brand-icon">
            <Sparkles size={19} />
          </div>
          <div>
            <div className="hub-brand-title">
              <span>Meeting Intelligence Studio</span>
              <span className="hub-brand-tag">Institutional AI</span>
            </div>
            <span className="hub-advisor-greeting">
              Good morning, <strong>{advisorName}</strong> • Advisor Cockpit
            </span>
          </div>
        </div>

        {/* Global Client Book Search */}
        <div className="hub-search-wrapper">
          <Search size={14} className="hub-search-icon" />
          <input
            type="text"
            className="hub-search-input"
            placeholder="Search client roster, ticker, or meeting topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="hub-search-shortcut">⌘K</span>
        </div>

        {/* Top Actions */}
        <div className="hub-top-actions">
          <div className={`hub-status-pill${googleConnected ? '' : ' hub-status-pill--warn'}`} title="Calendar synchronizer status">
            <span className="hub-pulse-dot" />
            <span>{googleConnected ? 'Calendar Synced' : 'Calendar Not Connected'}</span>
          </div>

          <button
            className="btn-hub-direct"
            onClick={() => setShowDirectPrep(true)}
            title="Generate meeting prep on-demand for any client"
          >
            <Compass size={13} />
            <span>Direct Client Prep</span>
          </button>

          <button
            className="hub-icon-btn"
            onClick={refreshSchedule}
            title="Refresh schedule"
            disabled={loadingSchedule}
          >
            <RefreshCw
              size={14}
              className={loadingSchedule ? 'spin-icon' : ''}
            />
          </button>

          <button
            className="hub-icon-btn"
            onClick={() => setShowSettings(true)}
            title="Configure Preferences & Integrations"
          >
            <SlidersHorizontal size={14} />
          </button>

          <div className="hub-profile" ref={profileRef}>
            <button className="hub-profile-trigger" onClick={() => setProfileOpen(p => !p)}>
              <div className="hub-profile-avatar">{advisorName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
              <span className="hub-profile-name">{advisorName}</span>
              <ChevronDown size={12} className={profileOpen ? 'hub-profile-chevron--open' : ''} />
            </button>
            {profileOpen && (
              <div className="hub-profile-dropdown">
                <div className="hub-profile-dropdown__header">
                  <div className="hub-profile-avatar hub-profile-avatar--lg">{advisorName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
                  <div>
                    <span className="hub-profile-dropdown__name">{advisorName}</span>
                    <span className="hub-profile-dropdown__role">Wealth Advisor</span>
                  </div>
                </div>
                <div className="hub-profile-dropdown__divider" />
                <button className="hub-profile-dropdown__item hub-profile-dropdown__item--danger" onClick={handleLogout}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Main Dashboard Layout (Grid) ── */}
      <main className="hub-main-grid">

        {/* ── LEFT: Primary Meeting Pipeline (Contained within Unified Card) ── */}
        <section className="hub-pipeline-card">
          {/* Card Header with Heading & Tabs */}
          <div className="hub-pipeline-card-header">
            <div className="hub-pipeline-title-row">
              <h1 className="hub-pipeline-heading">
                <Target size={17} style={{ color: '#38BDF8' }} />
                <span>Advisory Meeting Pipeline</span>
              </h1>
              <span className="hub-pipeline-sub">
                {todayMeetings.length} consultations scheduled today • {todayMeetings.filter(m => m.status === 'ready' || results[m.clientId] || results[m.meetingId]).length} briefs ready
              </span>
            </div>

            <div className="hub-tabs-group">
              <button
                className={`hub-tab-btn ${activeTab === 'today' ? 'hub-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('today')}
              >
                Today's Schedule ({todayMeetings.length})
              </button>
              <button
                className={`hub-tab-btn ${activeTab === 'upcoming' ? 'hub-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Schedule ({upcomingMeetings.length})
              </button>
            </div>
          </div>

          {/* List-Cards Stack */}
          <div className="hub-list-stack">
            {filteredMeetings.map((meeting, index) => {
              const mClientId = meeting.clientId || meeting.id || 'C005';
              const isFirst = index === 0 && activeTab === 'today';
              const avatarGrad = AVATAR_GRADIENTS[mClientId] || AVATAR_GRADIENTS['default'];
              const initials = getInitials(meeting.clientName);
              const highlight = getMeetingHighlight(meeting);
              const isReady = meeting.status === 'ready';

              return (
                <div
                  key={meeting.id || meeting.clientId}
                  className={`hub-list-card ${isFirst ? 'hub-list-card--next-up' : ''}`}
                >
                  {/* Main Row: Time | Client Info | Action CTA */}
                  <div className="hub-card-main-row">
                    {/* Time Column */}
                    <div className="hub-time-col">
                      <span className="hub-time-tag">{meeting.time || '09:00 AM'}</span>
                      <span className="hub-channel-wrap">
                        {renderChannelIcon(meeting.channel)}
                        <span>{meeting.duration || '45m'}</span>
                      </span>
                      {isFirst && (
                        <span className="hub-countdown-pip">Next Up</span>
                      )}
                    </div>

                    {/* Client Identity Column */}
                    <div className="hub-client-col">
                      <div className="hub-client-avatar" style={{ background: avatarGrad }}>
                        {initials}
                      </div>

                      <div className="hub-client-info">
                        <div className="hub-client-name-row">
                          <span className="hub-client-name">{meeting.clientName}</span>
                          <UserCheck size={14} style={{ color: '#10B981' }} title="Verified Account" />
                          <span className="hub-client-tier">
                            {meeting.tier ? meeting.tier.split('/')[0].trim() : 'HNW Client'}
                          </span>
                          <span className="hub-client-aum">{meeting.aum || '$1.59M'}</span>
                        </div>

                        <div className="hub-client-topic" title={meeting.meetingType || meeting.meetingGoal}>
                          <strong>Goal: </strong>{meeting.meetingType || meeting.meetingGoal || 'Cash Deployment & Compliance Review'}
                        </div>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="hub-action-col">
                      {isReady ? (
                        <>
                          <span className="hub-ready-pip">
                            <CheckCheck size={11} />
                            Ready
                          </span>

                          <button
                            className="btn-open-studio"
                            onClick={() => navigate(`/prep/${mClientId}`)}
                          >
                            <span>View Details</span>
                            <ArrowRight size={13} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="hub-pending-pip">
                            Pending
                          </span>

                          <button
                            className="btn-trigger-gen"
                            onClick={() => handleActionClick(meeting)}
                          >
                            <Zap size={13} />
                            <span>Generate Brief</span>
                          </button>
                        </>
                      )}

                      <a
                        href={getPptxDownloadUrl(mClientId)}
                        download
                        className="btn-row-pptx"
                        title="Download presentation deck"
                      >
                        <Download size={12} />
                        <span>PPTX</span>
                      </a>

                      {genErrors[meeting.meetingId || meeting.id] && (
                        <span className="hub-gen-error">
                          <AlertTriangle size={10} />
                          {genErrors[meeting.meetingId || meeting.id].includes('503') || genErrors[meeting.meetingId || meeting.id].includes('unavailable')
                            ? 'Unavailable — retry'
                            : 'Failed — try again'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Sub-Bar: AI Risk Drift Callout */}
                  <div className="hub-card-drift-bar">
                    <span className={`hub-drift-tag hub-drift-tag--${highlight.type}`}>
                      <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                      <span><strong>{highlight.tag}: </strong>{highlight.text}</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredMeetings.length === 0 && !loadingSchedule && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                <Search size={30} style={{ opacity: 0.4, margin: '0 auto 8px' }} />
                <p>{searchQuery ? `No consultations matching "${searchQuery}"` : 'No meetings found for today.'}</p>
              </div>
            )}

            {/* 503 / backend unavailable banner */}
            {!loadingSchedule && scheduleError && (
              <div style={{ padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>Service unavailable — {scheduleError}. <button onClick={refreshSchedule} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline' }}>Retry</button></span>
              </div>
            )}
          </div>
        </section>

        {/* ── RIGHT: Sidebar (Calendar + Integrated KPIs + Surveillance + Tools) ── */}
        <aside className="hub-sidebar">

          {/* Calendar Card with Integrated KPIs */}
          <div className="hub-sidebar-card">
            <div className="hub-cal-header">
              <div className="hub-cal-title">
                <CalendarIcon size={15} style={{ color: '#38BDF8' }} />
                <span>{monthName} {calYear}</span>
              </div>

              <div className="hub-cal-nav">
                <button className="hub-cal-nav-btn" onClick={prevMonth} title="Previous month">
                  <ChevronLeft size={13} />
                </button>
                <button className="hub-cal-nav-btn" onClick={nextMonth} title="Next month">
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="hub-cal-grid">
              <span className="hub-cal-day-name">Su</span>
              <span className="hub-cal-day-name">Mo</span>
              <span className="hub-cal-day-name">Tu</span>
              <span className="hub-cal-day-name">We</span>
              <span className="hub-cal-day-name">Th</span>
              <span className="hub-cal-day-name">Fr</span>
              <span className="hub-cal-day-name">Sa</span>

              {calendarDays.map((c, i) => {
                if (c.empty) {
                  return <div key={`empty-${i}`} className="hub-cal-cell hub-cal-cell--empty" />;
                }
                const isToday = c.day === _today.getDate() && calMonth === _today.getMonth() && calYear === _today.getFullYear();
                const isSelected = c.day === selectedDay;

                return (
                  <button
                    key={`day-${c.day}`}
                    className={`hub-cal-cell ${isToday ? 'hub-cal-cell--today' : ''} ${
                      isSelected ? 'hub-cal-cell--selected' : ''
                    } ${c.hasEvents ? 'hub-cal-cell--has-events' : ''}`}
                    onClick={() => {
                      setSelectedDay(c.day);
                      if (c.day === 11) setActiveTab('today');
                      else setActiveTab('upcoming');
                    }}
                    title={c.hasEvents ? `${c.day} ${monthName}: Consultations scheduled` : `${c.day} ${monthName}`}
                  >
                    {c.day}
                  </button>
                );
              })}
            </div>

            {/* Integrated KPIs inside Calendar Card */}
            <div className="hub-sidebar-kpis">
              <div className="hub-kpi-box">
                <span className="hub-kpi-val" style={{ color: '#38BDF8' }}>{todayMeetings.length} Scheduled</span>
                <span className="hub-kpi-lbl">Today's Pipeline</span>
              </div>

              <div className="hub-kpi-box">
                <span className="hub-kpi-val" style={{ color: '#4ADE80' }}>
                  {todayMeetings.filter((m) => m.status === 'ready' || results[m.clientId] || results[m.meetingId]).length} Ready
                </span>
                <span className="hub-kpi-lbl">Pre-Synthesized</span>
              </div>

              <div className="hub-kpi-box">
                <span className="hub-kpi-val" style={{ color: '#2DD4BF' }}>$2.94M</span>
                <span className="hub-kpi-lbl">Active Book AUM</span>
              </div>

              <div className="hub-kpi-box">
                <span className="hub-kpi-val" style={{ color: '#F87171' }}>1 Drift Alert</span>
                <span className="hub-kpi-lbl">David T: 22% Cash</span>
              </div>
            </div>
          </div>

          {/* Client Book Surveillance Alerts Card */}
          <div className="hub-sidebar-card">
            <div className="hub-alerts-header">
              <div className="hub-alerts-title">
                <AlertTriangle size={15} style={{ color: '#EF4444' }} />
                <span>Book Surveillance Alerts</span>
              </div>
              <AIBadge size="sm" />
            </div>

            <div className="hub-alerts-list">
              <div className="hub-alert-item hub-alert-item--critical">
                <div className="hub-alert-top">
                  <span className="hub-alert-name">David Thompson</span>
                  <span className="hub-alert-time">09:00 AM Today</span>
                </div>
                <p className="hub-alert-desc">
                  Cash at 22.0% ($350K idle) vs 10% IPS ceiling. Return drag diluting 1Y equity return.
                </p>
                <button
                  className="hub-alert-link"
                  onClick={() => navigate('/prep/C005')}
                >
                  <span>Inspect Prep Brief →</span>
                </button>
              </div>

              <div className="hub-alert-item hub-alert-item--warn">
                <div className="hub-alert-top">
                  <span className="hub-alert-name">Kevin Smyth</span>
                  <span className="hub-alert-time">02:30 PM Today</span>
                </div>
                <p className="hub-alert-desc">
                  Defensive 40.0% cash cushion vs 20% IPS ceiling ($340K idle). 2 consecutive review deferrals.
                </p>
                <button
                  className="hub-alert-link"
                  onClick={() => navigate('/prep/C012')}
                >
                  <span>Inspect Prep Brief →</span>
                </button>
              </div>

              <div className="hub-alert-item hub-alert-item--info">
                <div className="hub-alert-top">
                  <span className="hub-alert-name">Alex Morgan</span>
                  <span className="hub-alert-time">11:30 AM Today</span>
                </div>
                <p className="hub-alert-desc">
                  Equity allocation is +7.4% overweight vs target. Phase-1 $10K rebalance approved.
                </p>
                <button
                  className="hub-alert-link"
                  onClick={() => navigate('/prep/15600001')}
                >
                  <span>Inspect Prep Brief →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tools Card */}
          <div className="hub-sidebar-card">
            <div className="hub-alerts-title">
              <Zap size={14} style={{ color: '#F59E0B' }} />
              <span>Advisor Quick Utilities</span>
            </div>

            <div className="hub-tools-stack">
              <button
                className="btn-sidebar-tool"
                onClick={() => setShowDirectPrep(true)}
              >
                <Compass size={14} style={{ color: '#2DD4BF' }} />
                <span>Direct Client Prep Search</span>
              </button>

              <button
                className="btn-sidebar-tool"
                onClick={() => {
                  todayMeetings.forEach(m => {
                    if (m.status !== 'ready') triggerGenerate(m);
                  });
                }}
              >
                <FileCheck2 size={14} style={{ color: '#38BDF8' }} />
                <span>Batch Generate All Today's Briefs</span>
              </button>

              <button
                className="btn-sidebar-tool"
                onClick={() => {
                  todayMeetings.forEach(m => {
                    const id = m.clientId || m.id;
                    const link = document.createElement('a');
                    link.href = getPptxDownloadUrl(id);
                    link.download = `${id}_deck.pptx`;
                    link.click();
                  });
                }}
              >
                <FolderDown size={14} style={{ color: '#A78BFA' }} />
                <span>Download All Today's PPTX Decks</span>
              </button>
            </div>
          </div>

        </aside>

      </main>

      {/* ── Direct Client Prep Modal ── */}
      <DirectPrepModal
        isOpen={showDirectPrep}
        onClose={() => setShowDirectPrep(false)}
      />

      {/* ── Settings Modal ── */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* ── Generating Progress Modal ── */}
      {isGenerating && (
        <div className="prep-progress-overlay">
          <div className="prep-progress-card animate-scale-in">
            <div className="progress-header">
              <div className="progress-spinner-box">
                <Loader2 size={24} className="spin-icon" />
              </div>
              <div className="progress-title-block">
                <h3>Assembling Meeting Intelligence</h3>
                <p>Running multi-agent portfolio analysis & talking scripts...</p>
              </div>
              <button
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#94A3B8',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (activeGeneratingKey) {
                    setGeneratingFor(activeGeneratingKey, false);
                  }
                }}
                title="Dismiss overlay"
              >
                <X size={16} />
              </button>
            </div>

            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${currentProgressPct}%` }}
              />
            </div>

            <div className="progress-footer">
              <span className="progress-step-label">
                Evaluating asset allocation, policy drift & talking scripts...
              </span>
              <span className="progress-pct-label">{currentProgressPct}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
