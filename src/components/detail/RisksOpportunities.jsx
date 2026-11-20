import React from 'react';
import { AlertTriangle, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import AIBadge from '../common/AIBadge';
import './detail.css';

export default function RisksOpportunities({ risk }) {
  if (!risk) return null;

  return (
    <section className="detail-section-card glass-panel">
      <div className="section-card-head">
        <div className="section-card-title-group">
          <div className="section-icon-wrap section-icon-wrap--red">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h2 className="section-title">Risks & Opportunity Signals</h2>
            <p className="section-subtitle">Multi-skill surveillance across cash drift, policy bounds & volatility</p>
          </div>
        </div>
        <AIBadge size="sm" label="Risk Engine" />
      </div>

      {/* Metrics Row */}
      {risk.riskMetrics && risk.riskMetrics.length > 0 && (
        <div className="risk-metrics-strip">
          {risk.riskMetrics.map((m, idx) => (
            <div
              key={idx}
              className={`risk-metric-box ${m.warn ? 'risk-metric-box--warn' : ''}`}
            >
              <span className="risk-metric-label">{m.label}</span>
              <span className="risk-metric-val">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Surveillance Skill Sections */}
      <div className="risk-sections-list">
        {(risk.skillSections || []).map((section, sIdx) => (
          <div key={sIdx} className="risk-category-group">
            <h4 className="risk-category-title">{section.label}</h4>
            <div className="risk-signals-grid">
              {(section.signals || []).map((sig, sigIdx) => {
                const materiality = sig.assessment?.materiality || 'medium';
                return (
                  <div key={sigIdx} className="risk-signal-card">
                    <div className="signal-card-top">
                      <span className="signal-type-name">
                        {sig.signal_type?.replace(/_/g, ' ')}
                      </span>
                      <span className={`materiality-tag materiality-tag--${materiality}`}>
                        {materiality}
                      </span>
                    </div>
                    <p className="signal-observation-text">
                      {sig.observation?.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
