import React, { useState, useEffect } from 'react';
import { Edit3, CheckSquare, Square, Save, Check } from 'lucide-react';
import './detail.css';

export default function AdvisorNotes({ clientId }) {
  const storageKey = `advisor_notes_${clientId}`;
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || '';
    } catch {
      return '';
    }
  });
  const [savedStatus, setSavedStatus] = useState(false);

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Acknowledge market volatility & validate client caution', done: true },
    { id: 2, text: 'Review 22% cash drag impact vs 60/40 benchmark', done: false },
    { id: 3, text: 'Propose 4-tranche DCA schedule ($50K/month)', done: false },
    { id: 4, text: 'Send electronic rebalancing consent via Client Portal', done: false },
    { id: 5, text: 'Calendar 30-day touchpoint review', done: false },
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleSaveNotes = () => {
    try {
      localStorage.setItem(storageKey, notes);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  return (
    <section className="detail-section-card glass-panel">
      <div className="section-card-head">
        <div className="section-card-title-group">
          <div className="section-icon-wrap section-icon-wrap--purple">
            <Edit3 size={16} />
          </div>
          <div>
            <h2 className="section-title">In-Meeting Scratchpad & Checklist</h2>
            <p className="section-subtitle">Private advisor workspace during client consultation</p>
          </div>
        </div>
        <button className="btn-secondary" onClick={handleSaveNotes}>
          {savedStatus ? <Check size={13} className="text-success" /> : <Save size={13} />}
          <span>{savedStatus ? 'Saved' : 'Save Notes'}</span>
        </button>
      </div>

      <div className="notes-container-split">
        {/* Meeting Execution Checklist */}
        <div className="notes-checklist-col">
          <span className="notes-col-title">Consultation Milestones</span>
          <div className="checklist-items-list">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`checklist-item ${item.done ? 'checklist-item--done' : ''}`}
                onClick={() => toggleCheck(item.id)}
              >
                {item.done ? (
                  <CheckSquare size={16} className="text-turquoise" />
                ) : (
                  <Square size={16} className="text-tertiary" />
                )}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scratchpad Textarea */}
        <div className="notes-editor-col">
          <span className="notes-col-title">Live Meeting Notes</span>
          <textarea
            className="notes-textarea"
            placeholder="Type notes, client remarks, and follow-ups during the call..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
