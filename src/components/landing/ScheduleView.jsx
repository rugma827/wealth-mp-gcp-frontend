import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search, Sparkles } from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';
import MeetingCard from './MeetingCard';
import './landing.css';

export default function ScheduleView({ onOpenSearch }) {
  const {
    todayMeetings,
    upcomingMeetings,
    loadingSchedule,
  } = useMeeting();

  const [activeTab, setActiveTab] = useState('today');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'ready', 'pending'
  const [searchQuery, setSearchQuery] = useState('');

  const currentList = activeTab === 'today' ? todayMeetings : upcomingMeetings;

  const filteredMeetings = currentList.filter((m) => {
    // Status filter
    if (filterStatus === 'ready' && m.status !== 'ready') return false;
    if (filterStatus === 'pending' && m.status === 'ready') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = (m.clientName || '').toLowerCase().includes(q);
      const topicMatch = (m.meetingType || '').toLowerCase().includes(q);
      return nameMatch || topicMatch;
    }
    return true;
  });

  return (
    <div className="schedule-view-section">
      {/* Control Bar: Tabs + Filters */}
      <div className="schedule-controls-bar">
        <div className="schedule-tabs-group">
          <button
            className={`schedule-tab-btn ${activeTab === 'today' ? 'schedule-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <Clock size={15} />
            <span>Today's Meetings</span>
            <span className="schedule-count-pill">{todayMeetings.length}</span>
          </button>

          <button
            className={`schedule-tab-btn ${activeTab === 'upcoming' ? 'schedule-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={15} />
            <span>Upcoming Outlook</span>
            <span className="schedule-count-pill">{upcomingMeetings.length}</span>
          </button>
        </div>

        {/* Right Filter & Search */}
        <div className="schedule-filters-group">
          <div className="search-input-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search meetings by client or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="status-filter-pills">
            <button
              className={`filter-pill ${filterStatus === 'all' ? 'filter-pill--active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-pill ${filterStatus === 'ready' ? 'filter-pill--active' : ''}`}
              onClick={() => setFilterStatus('ready')}
            >
              Brief Ready
            </button>
            <button
              className={`filter-pill ${filterStatus === 'pending' ? 'filter-pill--active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Needs Prep
            </button>
          </div>
        </div>
      </div>

      {/* Roster Container */}
      <div className="schedule-roster-container">
        {loadingSchedule ? (
          <div className="schedule-empty-state glass-panel">
            <div className="animate-spin text-tcs-blue" style={{ marginBottom: 12 }}>
              <Clock size={28} />
            </div>
            <p className="empty-title">Synchronizing schedule...</p>
            <p className="empty-sub">Fetching events and pre-generating briefs from Bedrock AgentCore.</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="schedule-empty-state glass-panel">
            <Calendar size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 12 }} />
            <p className="empty-title">No meetings match your filter</p>
            <p className="empty-sub">
              Try adjusting your search criteria, or launch an on-demand direct client prep.
            </p>
            <button className="btn-primary" style={{ marginTop: 14 }} onClick={onOpenSearch}>
              <Sparkles size={14} />
              <span>Launch Direct Client Prep</span>
            </button>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting.id || meeting.meetingId} meeting={meeting} />
          ))
        )}
      </div>
    </div>
  );
}
