import React, { useState } from 'react';
import { Rocket, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck } from 'lucide-react';
import Modal from '../common/Modal';
import AIBadge from '../common/AIBadge';
import './detail.css';

export default function NextBestActions({ actions }) {
  const [selectedReasoning, setSelectedReasoning] = useState(null);

  const primaryActions = actions?.primary || [];
  if (primaryActions.length === 0) return null;

  return (
    <>
      <section className="detail-section-card glass-panel">
        <div className="section-card-head">
          <div className="section-card-title-group">
            <div className="section-icon-wrap section-icon-wrap--cyan">
              <Rocket size={16} />
            </div>
            <div>
              <h2 className="section-title">Next Best Actions (NBA)</h2>
              <p className="section-subtitle">Fiduciary validated next steps & execution guidance</p>
            </div>
          </div>
          <AIBadge size="sm" label="Agentic Decisions" />
        </div>

        <div className="nba-cards-list">
          {primaryActions.map((act, idx) => (
            <div key={idx} className="nba-action-card">
              <div className="nba-card-header-row">
                <div className="nba-card-title-left">
                  <CheckCircle2 size={16} className="text-success" />
                  <h4 className="nba-card-label">{act.label}</h4>
                </div>
                {act.reasoning && (
                  <button
                    className="btn-reasoning-link"
                    onClick={() => setSelectedReasoning(act)}
                  >
                    <span>View Agent Reasoning</span>
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
              <p className="nba-card-description">{act.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Reasoning Modal */}
      <Modal
        isOpen={!!selectedReasoning}
        onClose={() => setSelectedReasoning(null)}
        title="Agent Reasoning & Audit Chain"
        subtitle={selectedReasoning?.label}
        icon={<ShieldCheck size={18} />}
        maxWidth="680px"
      >
        <div className="reasoning-modal-body">
          <div className="reasoning-compliance-banner">
            <ShieldCheck size={16} className="text-success" />
            <span>Validated against Client IPS, Regulation Best Interest (Reg BI) & Fiduciary Suitability</span>
          </div>

          <div className="reasoning-thought-process">
            <h4 className="reasoning-heading">Multi-Agent Deliberation Rationale</h4>
            <p className="reasoning-paragraph">
              {selectedReasoning?.reasoning || 'Reasoning details are generated during agent synthesis.'}
            </p>
          </div>

          <div className="reasoning-modal-footer">
            <button className="btn-primary" onClick={() => setSelectedReasoning(null)}>
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
