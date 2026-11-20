import React from 'react';
import { SlidersHorizontal, Calendar, Bell, FileSpreadsheet, Check, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';
import { useMeeting } from '../../context/MeetingContext';
import './landing.css';

export default function SettingsModal({ isOpen, onClose }) {
  const {
    googleConnected,
    setGoogleConnected,
    settings,
    setSettings,
    refreshSchedule,
  } = useMeeting();

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meeting Intelligence Configuration"
      subtitle="Automated agent triggers, calendar providers and export preferences"
      icon={<SlidersHorizontal size={18} />}
    >
      <div className="settings-dialog-content">
        {/* Section 1: Calendar Integration */}
        <div className="settings-group">
          <div className="settings-group__header">
            <Calendar size={16} className="text-tcs-blue" />
            <h4 className="settings-group__title">Calendar Integration</h4>
          </div>
          <div className="settings-row">
            <div>
              <span className="settings-label">Google Calendar Sync</span>
              <p className="settings-desc">
                Automatically import client consultations from your linked advisor account.
              </p>
            </div>
            <button
              className={`toggle-switch ${googleConnected ? 'toggle-switch--on' : ''}`}
              onClick={() => setGoogleConnected(!googleConnected)}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>

        {/* Section 2: Automation Schedule */}
        <div className="settings-group">
          <div className="settings-group__header">
            <Bell size={16} className="text-turquoise" />
            <h4 className="settings-group__title">Automated Background Pre-Generation</h4>
          </div>
          <div className="settings-row">
            <div>
              <span className="settings-label">Morning Automated Run</span>
              <p className="settings-desc">Run Bedrock AgentCore at 07:30 AM before market open.</p>
            </div>
            <span className="settings-time-badge">{settings.morningTime} AM</span>
          </div>

          <div className="settings-row">
            <div>
              <span className="settings-label">Afternoon Midday Refresh</span>
              <p className="settings-desc">Re-evaluate drift after 12:00 PM market pricing updates.</p>
            </div>
            <span className="settings-time-badge">{settings.afternoonTime} PM</span>
          </div>
        </div>

        {/* Section 3: Deliverables */}
        <div className="settings-group">
          <div className="settings-group__header">
            <FileSpreadsheet size={16} className="text-warning" />
            <h4 className="settings-group__title">Deliverables & Presentation Exports</h4>
          </div>
          <div className="settings-row">
            <div>
              <span className="settings-label">Generate Client-Ready Slides (.pptx)</span>
              <p className="settings-desc">
                Produce executive summary PowerPoint presentations ready for client screen-sharing.
              </p>
            </div>
            <button
              className={`toggle-switch ${settings.generatePptx ? 'toggle-switch--on' : ''}`}
              onClick={() => handleToggle('generatePptx')}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="settings-footer-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              localStorage.removeItem('mi_prep_results');
              refreshSchedule();
              onClose();
            }}
          >
            <RefreshCw size={13} />
            <span>Reset Cache</span>
          </button>
          <button className="btn-primary" onClick={onClose}>
            <Check size={14} />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
