import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Clock,
  Target,
  AlertTriangle,
  Download,
  Share2,
} from 'lucide-react';
import { getPptxDownloadUrl } from '../../services/api';
import './detail.css';

export default function DetailHeader({ client, pptxId }) {
  const navigate = useNavigate();

  const isCritical = client.riskStatus === 'CRITICAL' || client.riskStatus === 'HIGH';

  return (
    <div className="detail-header-wrapper">
      {/* Top Nav & Breadcrumbs */}
      <div className="detail-top-nav">
        <button className="back-link-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={15} />
          <span>Back to Meeting Hub</span>
        </button>

        <div className="detail-actions-right">
          {pptxId ? (
            <a
              href={getPptxDownloadUrl(pptxId)}
              download
              className="btn-primary"
              title="Download client-ready PowerPoint presentation"
            >
              <Download size={14} />
              <span>Export Presentation (.pptx)</span>
            </a>
          ) : (
            <button className="btn-secondary" disabled style={{ opacity: 0.5 }}>
              <Download size={14} />
              <span>Export Presentation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="detail-hero-card glass-panel">
        <div className="detail-hero-primary">
          <div className="detail-client-identity">
            <div className="client-avatar-badge">
              <Sparkles size={22} className="avatar-sparkle" />
            </div>

            <div>
              <div className="client-title-row">
                <h1 className="client-display-name">{client.name}</h1>
                <span className="client-id-sub">({client.customerId || 'C005'})</span>
                
                {client.riskStatus && (
                  <span
                    className={`risk-badge-large ${
                      isCritical ? 'risk-badge-large--critical' : 'risk-badge-large--medium'
                    }`}
                  >
                    <AlertTriangle size={12} />
                    <span>{client.riskStatus} RISK</span>
                  </span>
                )}
              </div>

              <div className="client-badges-row">
                <span className="client-stat-pill">
                  <Shield size={12} className="text-tcs-blue" />
                  <span>{client.tier || 'Advisory Tier'}</span>
                </span>
                <span className="client-stat-pill client-stat-pill--aum">
                  <span>{client.aum} AUM</span>
                </span>
                <span className="client-stat-pill">
                  <Clock size={12} className="text-turquoise" />
                  <span>{client.meetingTime || 'Today'}</span>
                </span>
                <span className="client-stat-pill client-stat-pill--sentiment">
                  <AlertTriangle size={12} className="text-warning" />
                  <span>Sentiment: {client.sentiment || 'Cautious'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Goal Banner */}
        {client.meetingGoal && (
          <div className="meeting-goal-strip">
            <div className="goal-label-col">
              <Target size={14} className="text-turquoise" />
              <span>Meeting Objective:</span>
            </div>
            <p className="goal-text">{client.meetingGoal}</p>
          </div>
        )}

        {/* NBA Trigger Banner */}
        {client.nbaTrigger && (
          <div className="nba-trigger-banner">
            <div className="trigger-pill">Next Best Conversation Trigger</div>
            <p className="trigger-text">{client.nbaTrigger}</p>
          </div>
        )}
      </div>
    </div>
  );
}
