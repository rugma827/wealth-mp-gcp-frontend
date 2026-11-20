import React from 'react';
import { History, Calendar, ArrowRight } from 'lucide-react';
import './detail.css';

export default function RecentActivity({ activity }) {
  if (!activity || activity.length === 0) return null;

  return (
    <section className="detail-section-card glass-panel">
      <div className="section-card-head">
        <div className="section-card-title-group">
          <div className="section-icon-wrap section-icon-wrap--blue">
            <History size={16} />
          </div>
          <div>
            <h2 className="section-title">Client Touchpoint History</h2>
            <p className="section-subtitle">Chronological record of recent reviews, calls & recorded sentiment</p>
          </div>
        </div>
      </div>

      <div className="activity-timeline">
        {activity.map((item, idx) => (
          <div key={idx} className="timeline-item">
            <div className="timeline-date-col">
              <Calendar size={13} className="text-tertiary" />
              <span>{item.date}</span>
            </div>
            <div className="timeline-marker" />
            <div className="timeline-content-col">
              <p className="timeline-summary">{item.summary}</p>
              {item.decision && (
                <div className="timeline-decision">
                  <ArrowRight size={12} className="text-turquoise" />
                  <span><strong>Decision:</strong> {item.decision}</span>
                </div>
              )}
              {item.sentiment && (
                <span className="timeline-sentiment-pill">
                  Sentiment: {item.sentiment}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
