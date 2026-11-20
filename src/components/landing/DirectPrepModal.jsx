import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, User, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { useMeeting } from '../../context/MeetingContext';

const QUICK_CLIENTS = [
  { id: 'C005', name: 'David Thompson', tier: 'Premium HNW', aum: '$1,590,000', flag: 'Critical Idle Cash' },
  { id: 'C012', name: 'Kevin Smyth', tier: 'Growth', aum: '$850,000', flag: 'High Cash Cushion' },
  { id: '15600001', name: 'Alex Morgan', tier: 'Gold', aum: '$500,000', flag: 'Equity Drift' },
  { id: '15634602', name: 'Mary Hargrave', tier: 'Platinum', aum: '$577,000', flag: 'Volatility Anxious' },
];

export default function DirectPrepModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { triggerDirectPrep, generating } = useMeeting();
  const [clientInput, setClientInput] = useState('');
  const [activeTaskKey, setActiveTaskKey] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const currentGen = activeTaskKey ? generating[activeTaskKey] : null;

  const handleSubmit = async (nameToRun) => {
    const targetName = nameToRun || clientInput.trim();
    if (!targetName) return;
    setSubmitError(null);

    const taskKey = `direct-${targetName.toLowerCase().replace(/\s+/g, '-')}`;
    setActiveTaskKey(taskKey);

    const res = await triggerDirectPrep(targetName);
    if (res && res.ok) {
      onClose();
      navigate(`/prep/${res.clientId}`);
    } else {
      setSubmitError(res?.error || 'Generation failed. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Direct Client Meeting Prep"
      subtitle="Generate AI briefs on-demand for any client without a scheduled calendar event"
      icon={<Sparkles size={18} />}
    >
      <div className="direct-prep-dialog">
        <p className="dialog-description">
          Enter any client’s name to aggregate real-time Snowflake portfolio records, risk drift signals,
          and tailored behavioral conversation angles.
        </p>

        {/* Input Field */}
        <div className="dialog-search-row">
          <div className="search-input-wrap search-input-wrap--large">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="e.g. David Thompson, Kevin Smyth..."
              value={clientInput}
              onChange={(e) => setClientInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              disabled={currentGen?.isGenerating}
              className="search-input"
              autoFocus
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => handleSubmit()}
            disabled={!clientInput.trim() || currentGen?.isGenerating}
          >
            {currentGen?.isGenerating ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {/* Inline error */}
        {submitError && !currentGen && (
          <div className="direct-prep-error">
            <AlertCircle size={13} />
            <span>{submitError.includes('503') || submitError.includes('unavailable') ? 'Service unavailable — please try again shortly.' : 'Something went wrong. Please try again.'}</span>
          </div>
        )}

        {/* Live Progress Bar when running */}
        {currentGen?.isGenerating && (
          <div className="direct-progress-card glass-panel animate-fade-in">
            <div className="direct-progress-labels">
              <span className="direct-phase-text">
                <Loader2 size={13} className="animate-spin text-turquoise" />
                <span>{currentGen.label || 'Synthesizing portfolio intelligence...'}</span>
              </span>
              <span className="direct-pct-text">{currentGen.pct}%</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${currentGen.pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Select Recommendations */}
        <div className="quick-clients-section">
          <span className="quick-clients-title">Frequently Advised High-Priority Clients</span>
          <div className="quick-clients-grid">
            {QUICK_CLIENTS.map((qc) => (
              <div
                key={qc.id}
                className="quick-client-card glass-panel"
                onClick={() => {
                  setClientInput(qc.name);
                  handleSubmit(qc.name);
                }}
              >
                <div className="qc-card-top">
                  <div className="qc-name-group">
                    <User size={14} className="text-tcs-blue" />
                    <span className="qc-name">{qc.name}</span>
                  </div>
                  <span className="qc-tier">{qc.tier}</span>
                </div>
                <div className="qc-card-bottom">
                  <span className="qc-aum">{qc.aum}</span>
                  <span className="qc-flag">{qc.flag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
