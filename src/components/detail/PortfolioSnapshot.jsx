import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AIBadge from '../common/AIBadge';
import './detail.css';

export default function PortfolioSnapshot({ holdings }) {
  if (!holdings) return null;

  return (
    <section className="detail-section-card glass-panel">
      <div className="section-card-head">
        <div className="section-card-title-group">
          <div className="section-icon-wrap section-icon-wrap--blue">
            <BarChart3 size={16} />
          </div>
          <div>
            <h2 className="section-title">Portfolio Snapshot & Holdings</h2>
            <p className="section-subtitle">Real-time ledger data, drift analysis & multi-year performance</p>
          </div>
        </div>
        <AIBadge size="sm" label="Snowflake Sync" />
      </div>

      {/* Primary KPI Grid */}
      <div className="snapshot-kpis-grid">
        <div className="snapshot-kpi-item">
          <span className="kpi-label">Total Market Value</span>
          <span className="kpi-value">{holdings.totalValue || 'N/A'}</span>
          <span className="kpi-subtext">Across all advisory accounts</span>
        </div>

        <div className="snapshot-kpi-item">
          <span className="kpi-label">Cost Basis</span>
          <span className="kpi-value">{holdings.costBasis || 'N/A'}</span>
          <span className="kpi-subtext">Cumulative invested principal</span>
        </div>

        <div className="snapshot-kpi-item">
          <span className="kpi-label">Unrealized Gain / Loss</span>
          <span className="kpi-value kpi-value--positive">
            <ArrowUpRight size={18} />
            <span>{holdings.unrealizedGL || 'N/A'}</span>
          </span>
          <span className="kpi-subtext">Trailing performance</span>
        </div>

        {holdings.cashBalance && (
          <div className="snapshot-kpi-item snapshot-kpi-item--warning">
            <span className="kpi-label">Cash & Equivalents</span>
            <span className="kpi-value kpi-value--warning">
              <Wallet size={16} />
              <span>{holdings.cashBalance}</span>
            </span>
            <span className="kpi-subtext" style={{ color: '#F87171' }}>
              Exceeds 10% IPS limit
            </span>
          </div>
        )}
      </div>

      {/* Holdings Breakdown Table */}
      {holdings.performance && holdings.performance.length > 0 && (
        <div className="holdings-table-wrapper">
          <div className="table-header-sub">
            <h3 className="table-sub-heading">Asset Allocation & Performance Matrix</h3>
          </div>
          <div className="table-scroll-container">
            <table className="holdings-table">
              <thead>
                <tr>
                  <th>Fund / Instrument</th>
                  <th>Asset Class</th>
                  <th>Weight</th>
                  <th>2024</th>
                  <th>2025</th>
                  <th>Trend</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {holdings.performance.map((item, idx) => (
                  <tr key={idx} className={item.weight > 20 && item.type.includes('Cash') ? 'row-highlight-warn' : ''}>
                    <td className="td-fund-name">{item.fund}</td>
                    <td className="td-fund-type">{item.type}</td>
                    <td className="td-fund-weight">
                      <div className="weight-bar-wrap">
                        <div className="weight-bar" style={{ width: `${Math.min(item.weight * 2.2, 100)}%` }} />
                        <span>{item.weight}%</span>
                      </div>
                    </td>
                    <td className="td-metric">{item.y2024}</td>
                    <td className="td-metric">{item.y2025}</td>
                    <td>
                      <span
                        className={`trend-badge ${
                          item.trend === 'Growing' || item.trend === 'Improving'
                            ? 'trend-badge--ok'
                            : item.trend === 'Declining'
                            ? 'trend-badge--warn'
                            : 'trend-badge--neutral'
                        }`}
                      >
                        {item.trend}
                      </span>
                    </td>
                    <td className="td-remarks">{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Key AI Insights Bullets */}
      {holdings.keyInsight && holdings.keyInsight.length > 0 && (
        <div className="key-insights-box">
          <div className="key-insights-label">
            <TrendingUp size={13} className="text-turquoise" />
            <span>Agentic Allocation Insights:</span>
          </div>
          <div className="insights-bullet-list">
            {holdings.keyInsight.map((bullet, i) => (
              <div key={i} className="insight-bullet-item">
                <span className="bullet-dot" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
