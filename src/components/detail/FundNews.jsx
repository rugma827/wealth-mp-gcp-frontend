import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import AIBadge from '../common/AIBadge';
import './detail.css';

export default function FundNews({ news }) {
  if (!news || news.length === 0) return null;

  return (
    <section className="detail-section-card glass-panel">
      <div className="section-card-head">
        <div className="section-card-title-group">
          <div className="section-icon-wrap section-icon-wrap--cyan">
            <Newspaper size={16} />
          </div>
          <div>
            <h2 className="section-title">Holding-Specific News & Catalysts</h2>
            <p className="section-subtitle">Real-time market stories mapped to the client’s portfolio weights</p>
          </div>
        </div>
        <AIBadge size="sm" label="Bloomberg Agent" />
      </div>

      <div className="fund-news-grid">
        {news.map((item, idx) => (
          <div key={idx} className="fund-news-card">
            <div className="fund-news-header">
              <span className="fund-news-ticker">{item.ticker}</span>
              {item.weight_pct != null && (
                <span className="fund-news-weight">{item.weight_pct}% of portfolio</span>
              )}
            </div>
            <h4 className="fund-news-name">{item.fund_name}</h4>
            <p className="fund-news-summary">{item.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
