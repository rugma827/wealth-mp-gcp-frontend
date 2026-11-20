import React from 'react';
import { CalendarCheck, FileCheck2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';
import './landing.css';

export default function MetricsStrip() {
  const { todayMeetings } = useMeeting();

  const totalToday = todayMeetings.length;
  const briefsReady = todayMeetings.filter((m) => m.status === 'ready').length;
  const criticalCount = todayMeetings.filter((m) => m.riskStatus === 'CRITICAL').length;

  return (
    <section className="metrics-strip">
      {/* Metric 1 */}
      <div className="metric-card glass-panel">
        <div className="metric-card__icon metric-card__icon--blue">
          <CalendarCheck size={18} />
        </div>
        <div>
          <span className="metric-card__label">Today's Schedule</span>
          <div className="metric-card__val-row">
            <span className="metric-card__value">{totalToday}</span>
            <span className="metric-card__sub">Meetings on agenda</span>
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="metric-card glass-panel">
        <div className="metric-card__icon metric-card__icon--green">
          <FileCheck2 size={18} />
        </div>
        <div>
          <span className="metric-card__label">AI Briefs Prepared</span>
          <div className="metric-card__val-row">
            <span className="metric-card__value">{briefsReady}</span>
            <span className="metric-card__sub">of {totalToday} ready to review</span>
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="metric-card glass-panel">
        <div className="metric-card__icon metric-card__icon--cyan">
          <TrendingUp size={18} />
        </div>
        <div>
          <span className="metric-card__label">Total AUM in Play</span>
          <div className="metric-card__val-row">
            <span className="metric-card__value">$2.94M</span>
            <span className="metric-card__sub">Across today's roster</span>
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="metric-card glass-panel">
        <div className="metric-card__icon metric-card__icon--red">
          <AlertTriangle size={18} />
        </div>
        <div>
          <span className="metric-card__label">Critical Suitability Drift</span>
          <div className="metric-card__val-row">
            <span className="metric-card__value" style={{ color: 'var(--fin-negative)' }}>
              {criticalCount}
            </span>
            <span className="metric-card__sub">Excess cash & policy flags</span>
          </div>
        </div>
      </div>
    </section>
  );
}
