import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Video,
  Phone,
  Building,
  Sparkles,
  ChevronRight,
  Download,
  AlertTriangle,
  Shield,
  Loader2,
} from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';
import { getPptxDownloadUrl } from '../../services/api';
import './landing.css';

export default function MeetingCard({ meeting }) {
  const navigate = useNavigate();
  const { generating, triggerGenerate } = useMeeting();

  const key = meeting.meetingId || meeting.id;
  const genState = generating[key] || { isGenerating: false, pct: 0, label: '' };

  const handleActionClick = async (e) => {
    e.stopPropagation();
    if (meeting.status === 'ready') {
      navigate(`/prep/${meeting.clientId || meeting.id}`);
    } else {
      const res = await triggerGenerate(meeting);
      if (res && res.ok) {
        navigate(`/prep/${key}`);
      }
    }
  };

  const renderChannelIcon = () => {
    const channelLower = (meeting.channel || '').toLowerCase();
    if (channelLower.includes('teams') || channelLower.includes('video') || channelLower.includes('zoom')) {
      return <Video size={13} />;
    }
    if (channelLower.includes('phone')) {
      return <Phone size={13} />;
    }
    return <Building size={13} />;
  };

  const getRiskClass = (status) => {
    switch (status) {
      case 'CRITICAL':
        return 'risk-pill--critical';
      case 'HIGH':
        return 'risk-pill--high';
      case 'MEDIUM':
        return 'risk-pill--medium';
      default:
        return 'risk-pill--low';
    }
  };

  return (
    <div
      className={`meeting-card glass-panel ${meeting.status === 'ready' ? 'meeting-card--ready' : ''}`}
      onClick={() => {
        if (meeting.status === 'ready') {
          navigate(`/prep/${meeting.clientId || meeting.id}`);
        }
      }}
    >
      {/* Left Time Column */}
      <div className="meeting-card__time-col">
        <span className="meeting-time-primary">{meeting.time}</span>
        <span className="meeting-time-duration">{meeting.duration}</span>
        {meeting.countdown && (
          <span className="meeting-time-countdown">{meeting.countdown}</span>
        )}
      </div>

      <div className="meeting-card__divider" />

      {/* Middle Client & Agenda Column */}
      <div className="meeting-card__content">
        <div className="meeting-card__headline">
          <h3 className="meeting-client-name">{meeting.clientName}</h3>
          
          <span className="client-tier-badge">
            <Shield size={11} />
            <span>{meeting.tier}</span>
          </span>

          <span className="client-aum-pill">{meeting.aum} AUM</span>

          {meeting.riskStatus && (
            <span className={`risk-pill ${getRiskClass(meeting.riskStatus)}`}>
              <AlertTriangle size={11} />
              <span>{meeting.riskStatus}</span>
            </span>
          )}
        </div>

        <p className="meeting-topic-title">{meeting.meetingType}</p>

        <div className="meeting-meta-row">
          <span className="meeting-meta-item">
            {renderChannelIcon()}
            <span>{meeting.channel}</span>
          </span>
          <span className="meeting-meta-item">
            <MapPin size={13} />
            <span>{meeting.location || 'Private Suite'}</span>
          </span>
          {meeting.sentiment && (
            <span className="meeting-sentiment-tag">
              Sentiment: <strong>{meeting.sentiment}</strong>
            </span>
          )}
        </div>

        {/* Progress Bar when Generating */}
        {genState.isGenerating && (
          <div className="meeting-card__progress-block">
            <div className="meeting-card__progress-labels">
              <span className="progress-phase-text">
                <Loader2 size={12} className="animate-spin text-turquoise" />
                <span>{genState.label || 'Agentic reasoning in progress...'}</span>
              </span>
              <span className="progress-pct-text">{genState.pct}%</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${genState.pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Action Column */}
      <div className="meeting-card__actions" onClick={(e) => e.stopPropagation()}>
        {genState.isGenerating ? (
          <button className="btn-secondary" disabled style={{ opacity: 0.8 }}>
            <Loader2 size={14} className="animate-spin" />
            <span>Generating...</span>
          </button>
        ) : meeting.status === 'ready' ? (
          <div className="meeting-ready-group">
            <button className="btn-ready" onClick={handleActionClick}>
              <span>View Prep Brief</span>
              <ChevronRight size={14} />
            </button>
            {meeting.pptxId && (
              <a
                href={getPptxDownloadUrl(meeting.pptxId)}
                className="btn-icon-subtle"
                title="Download client presentation slides (.pptx)"
                download
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={14} />
              </a>
            )}
          </div>
        ) : (
          <button className="btn-primary" onClick={handleActionClick}>
            <Sparkles size={14} />
            <span>Generate with AI</span>
          </button>
        )}
      </div>
    </div>
  );
}
