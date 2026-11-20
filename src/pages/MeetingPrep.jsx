import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, TrendingUp, Target, MessageSquare,
  BarChart3, AlertTriangle, CheckCircle, Download,
  Sparkles, Clock, Shield, Rocket, Newspaper, ChevronDown, X, ArrowLeft
} from 'lucide-react';
import AIBadge from '../components/AIBadge';
import Tooltip from '../components/Tooltip';
import { formatCurrency } from '../utils/formatters';
import { useMeetingPrep } from '../context/MeetingContext';
import { getPptxDownloadUrl } from '../services/api';
import {
  CLIENT_DATA,
  HOLDINGS_DATA,
  RISK_DATA,
  ACTIVITY_DATA,
  CLIENT_NEWS,
  UPCOMING_MEETINGS,
  DISCUSSION_ANGLES,
  RECOMMENDED_ACTIONS,
  FALLBACK_CLIENT,
} from '../data/meetingPrepData';
import './MeetingPrep.css';

// Normalizers ensuring clean shapes regardless of live AgentCore or mock formats
const formatNewsList = (list) => (list || []).map((n) => {
  if (typeof n === 'string') {
    const [t, ...rest] = n.split(':');
    const summaryText = rest.join(':').trim() || t?.trim() || '';
    const ticker = t?.trim().split(' ')[0] || 'HOLDING';
    return {
      ticker,
      fund_name: t?.trim() || 'Core Holding',
      weight_pct: null,
      summary: summaryText,
    };
  }
  return {
    ticker: n.ticker || n.symbol || 'FUND',
    fund_name: n.fund_name || n.name || n.ticker || 'Holding',
    weight_pct: n.weight_pct ?? null,
    summary: n.summary || n.headline || '',
  };
});

const formatAnglesList = (list) => (list || []).map((a, i) => {
  if (typeof a === 'string') return { title: `Discussion Strategy ${i + 1}`, desc: a };
  return {
    title: a.title || a.heading || `Discussion Strategy ${i + 1}`,
    desc: a.desc || a.description || a.summary || '',
  };
});

const formatActionsObj = (act) => {
  let items = [];
  if (Array.isArray(act)) items = act;
  else if (Array.isArray(act?.primary)) items = act.primary;
  else if (Array.isArray(act?.actions)) items = act.actions;
  return {
    primary: items.map((a) => ({
      label: a.label || a.title || 'Next Best Action',
      desc: a.desc || a.description || a.rationale || '',
      reasoning: a.reasoning || a.agentReasoning || a.rationale || '',
    })),
  };
};

const MeetingPrep = ({ clientId: propClientId }) => {
  const { clientId: paramClientId } = useParams();
  const clientId = propClientId || paramClientId || 'C005';
  const navigate = useNavigate();
  const { results, generating, progress } = useMeetingPrep();

  // clientId for live events is 'live-{meetingId}' — extract the Google event ID
  const liveMeetingId = clientId?.startsWith('live-') ? clientId.slice(5) : null;
  const liveResult = liveMeetingId
    ? results[liveMeetingId]
    : (results[clientId] || results[`direct_${clientId}`] || null);
  const isGenerating = liveMeetingId ? !!generating[liveMeetingId] : false;

  const fmtMoney = (v) => typeof v === 'number' ? formatCurrency(v) : (v || 'N/A');
  const fmtWeight = (v) => typeof v === 'number' ? (v < 1 ? Math.round(v * 100) : v) : v;

  const mapLiveData = (r) => {
    if (!r) return null;
    const h = r.holdings?.holdings || r.holdings || {};

    const rawNews = r.fundNews || r.news || [];
    const rawAngles = r.discussionAngles || r.angles || [];
    const rawActions = Array.isArray(r.nextBestActions)
      ? r.nextBestActions
      : (Array.isArray(r.actions?.primary)
          ? r.actions.primary
          : (Array.isArray(r.actions) ? r.actions : []));

    return {
      client: {
        ...r.client,
        riskStatus: r.client?.riskStatus || '',
        nbaTrigger: r.nbaTrigger || r.client?.nbaTrigger || '',
        profileIntro: r.profileIntro || r.client?.profileIntro || '',
        nbcScript: r.nbcScript || r.client?.nbcScript || '',
        meetingGoal: r.client?.meetingGoal || '',
        sentiment: r.client?.sentiment || '',
        tier: r.client?.tier || '',
        aum: fmtMoney(r.client?.aum),
        meetingTime: r.client?.meetingTime || '',
        name: r.client?.name || 'Client',
      },
      holdings: {
        totalValue: fmtMoney(h.totalValue),
        costBasis: fmtMoney(h.costBasis),
        unrealizedGL: fmtMoney(h.unrealizedGL),
        performance: (h.performance || []).map(p => ({
          ...p,
          fund: p.fund || p.ticker || '',
          weight: fmtWeight(p.weight),
        })),
        returns: Array.isArray(h.returns) ? h.returns : Object.entries(h.returns || {}).map(([label, value]) => ({
          label: label === '1y' ? '1-Year' : label === 'ytd' ? 'YTD' : label,
          value,
        })),
        keyInsight: h.keyInsight || [],
      },
      risk: {
        riskMetrics: r.risk?.riskMetrics || [],
        skillSections: r.risk?.skillSections || [],
      },
      activity: r.activity || [],
      news: formatNewsList(rawNews),
      upcoming: r.upcomingMeetings || r.upcoming || [],
      angles: formatAnglesList(rawAngles),
      actions: formatActionsObj(rawActions),
      pptxId: r.pptxIds?.[0] || r.pptxId || null,
      isLive: true,
    };
  };

  let live = null;
  if (liveResult) {
    try {
      live = mapLiveData(liveResult);
    } catch (e) {
      live = null;
    }
  }

  // If this is a live meeting URL but result is gone (page refresh / context lost)
  if (liveMeetingId && !live && !isGenerating) {
    return (
      <div className="mp-page">
        <div className="mp-generating-overlay" style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="mp-generating-card">
            <Sparkles size={28} style={{ color: 'var(--text-tertiary)' }} />
            <p className="mp-generating-title">Brief not available</p>
            <p className="mp-generating-sub">The meeting brief was not found. Go back and click Generate to create it.</p>
            <button
              onClick={() => navigate('/')}
              style={{ marginTop: 16, padding: '6px 18px', background: 'var(--tcs-blue)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >Go Back to Hub</button>
          </div>
        </div>
      </div>
    );
  }

  // Robust data resolution ensuring no section is ever empty
  const client = live?.client?.name ? live.client : (CLIENT_DATA[clientId] || FALLBACK_CLIENT);

  const holdings = (live?.holdings?.performance && live.holdings.performance.length > 0)
    ? live.holdings
    : (HOLDINGS_DATA[clientId] || HOLDINGS_DATA['C005'] || HOLDINGS_DATA['15600001']);

  const risk = (live?.risk?.skillSections && live.risk.skillSections.length > 0)
    ? live.risk
    : (RISK_DATA[clientId] || RISK_DATA['C005'] || RISK_DATA['15600001']);

  const activity = (live?.activity && live.activity.length > 0)
    ? live.activity
    : (ACTIVITY_DATA[clientId] || ACTIVITY_DATA['C005'] || ACTIVITY_DATA['15600001'] || []);

  const rawNews = (live?.news && live.news.length > 0)
    ? live.news
    : (CLIENT_NEWS[clientId] || CLIENT_NEWS['C005'] || CLIENT_NEWS['15600001'] || []);
  const news = formatNewsList(rawNews);

  const rawAngles = (live?.angles && live.angles.length > 0)
    ? live.angles
    : (DISCUSSION_ANGLES[clientId] || DISCUSSION_ANGLES['C005'] || DISCUSSION_ANGLES['15600001'] || []);
  const angles = formatAnglesList(rawAngles);

  const rawActions = (live?.actions?.primary && live.actions.primary.length > 0)
    ? live.actions
    : (RECOMMENDED_ACTIONS[clientId] || RECOMMENDED_ACTIONS['C005'] || RECOMMENDED_ACTIONS['15600001'] || { primary: [] });
  const actions = formatActionsObj(rawActions);

  const pptxId = live?.pptxId || null;
  const isEnhanced = live?.isLive || clientId === 'C005' || clientId === 'C012';

  // For Quick Links — use real clientId from live data if available, else URL param
  const navClientId = live
    ? (liveResult?.clientId || liveResult?.client?.customerId || null)
    : clientId;

  const [showScript, setShowScript] = useState(false);
  const handleScrollFade = useCallback((e) => {
    const el = e.target;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 4;
    el.classList.toggle('mp-scroll-body--at-bottom', atBottom);
  }, []);

  const [reasoningAction, setReasoningAction] = useState(null);

  return (
    <div className="mp-page">

      {/* ── Standalone Navigation Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '4px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--tcs-blue)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Meeting Hub</span>
        </button>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Meeting Intelligence Studio · Standalone UI
        </span>
      </div>

      {/* ── Generating loading state ── */}
      {isGenerating && (
        <div className="mp-generating-overlay">
          <div className="mp-generating-card">
            <Sparkles size={28} style={{ color: 'var(--success)' }} />
            <p className="mp-generating-title">Generating Meeting Brief</p>
            <p className="mp-generating-sub">Analysing portfolio, risks & activity via Snowflake...</p>
            <div className="mp-generating-progress">
              <div className="mp-generating-bar">
                <div className="mp-generating-fill" style={{ width: `${progress[liveMeetingId] || 0}%` }} />
              </div>
              <span className="mp-generating-pct">{progress[liveMeetingId] || 0}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="mp-header">
        <div className="mp-header__title-row">
          <Sparkles size={18} style={{ color: isEnhanced ? 'var(--error)' : 'var(--success)', flexShrink: 0 }} />
          <h1 className="mp-header__title">Meeting Prep — {client.name}</h1>
          {isEnhanced && client.riskStatus && client.riskStatus !== 'Low' && client.riskStatus !== 'Not Available' && (
            <span className="mp-header__critical">{client.riskStatus}</span>
          )}
          <span className="mp-header__time">{client.meetingTime || 'Today'}</span>
          {pptxId ? (
            <a
              href={getPptxDownloadUrl(pptxId)}
              download
              className="mp-export-btn"
            >
              <Download size={13} /> Export
            </a>
          ) : (
            <Tooltip content="Generate a brief first to enable export" placement="bottom">
              <button className="mp-export-btn" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>
                <Download size={13} /> Export
              </button>
            </Tooltip>
          )}
        </div>
        {isEnhanced && (
          <p className="mp-header__insight">{client.profileIntro}</p>
        )}
        <div className="mp-header__stats">
          <span className="mp-stat"><Shield size={12} /> {client.tier}</span>
          <span className="mp-stat">{client.aum} AUM</span>
          <span className="mp-stat mp-stat--warn"><AlertTriangle size={12} /> {client.sentiment}</span>
          <span className="mp-stat mp-stat--accent"><Target size={12} /> {client.meetingGoal}</span>
        </div>
      </div>

      {/* ── Enhanced clients: reason strip ── */}
      {isEnhanced && client.nbaTrigger && (
        <div className="mp-nba-reason">
          <span>{client.nbaTrigger}</span>
        </div>
      )}

      {/* ── Single grid — identical layout to main UI ── */}
      <div className="mp-grid">

        {/* ROW 1 LEFT: Portfolio Snapshot */}
        <section className="mp-card">
          <div className="mp-card__head">
            <div className="mp-card__icon"><BarChart3 size={15} /></div>
            <h2 className="mp-card__title">Portfolio Snapshot</h2>
            <AIBadge size="sm" />
          </div>
          <div className="mp-snapshot-kpis">
            <div className="mp-snapshot-kpi">
              <span className="mp-snapshot-kpi__label">Market Value</span>
              <span className="mp-snapshot-kpi__value">{holdings.totalValue}</span>
            </div>
            <div className="mp-snapshot-kpi">
              <span className="mp-snapshot-kpi__label">Cost Basis</span>
              <span className="mp-snapshot-kpi__value">{holdings.costBasis}</span>
            </div>
            <div className="mp-snapshot-kpi">
              <span className="mp-snapshot-kpi__label">Unrealized Gain/Loss</span>
              <span className="mp-snapshot-kpi__value mp-snapshot-kpi__value--positive">{holdings.unrealizedGL}</span>
            </div>
            {isEnhanced && Array.isArray(holdings.returns) && holdings.returns.length > 0 && (
              <div className="mp-snapshot-kpi">
                <span className="mp-snapshot-kpi__label">1-Year Return</span>
                <span className="mp-snapshot-kpi__value mp-snapshot-kpi__value--positive">
                  {holdings.returns.find(r => r.label === '1-Year')?.value || holdings.returns[0]?.value}
                </span>
              </div>
            )}
          </div>
          {holdings.performance && holdings.performance.length > 0 && (
            <>
              <h3 className="mp-card__sub">Performance Trends</h3>
              <div className="mp-table-wrap">
                <table className="mp-table">
                  <thead><tr><th>Fund</th><th>Fund Type</th><th>Weight</th><th>2024</th><th>2025</th><th>Trend</th><th>Remarks</th></tr></thead>
                  <tbody>
                    {holdings.performance.map((p, i) => (
                      <tr key={i}>
                        <td className="mp-td--bold">{p.fund}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{p.type}</td>
                        <td>{p.weight}%</td>
                        <td>{p.y2024}</td>
                        <td>{p.y2025}</td>
                        <td><span className={`mp-badge ${p.trend === 'Growing' || p.trend === 'Improving' ? 'mp-badge--ok' : p.trend === 'Declining' ? 'mp-badge--warn' : ''}`}>{p.trend}</span></td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{p.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {holdings.keyInsight && (
            <div className="mp-card__insight">
              {holdings.keyInsight.map((line, i) => (
                <div key={i} className="mp-insight-bullet">
                  <span className="mp-insight-bullet__dot" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ROW 1 RIGHT: Risks & Opportunities */}
        <section className="mp-card">
          <div className="mp-card__head">
            <div className="mp-card__icon mp-card__icon--warn"><AlertTriangle size={15} /></div>
            <h2 className="mp-card__title">Risks & Opportunities</h2>
            <AIBadge size="sm" />
          </div>
          {isEnhanced && risk.riskMetrics && (
            <div className="mp-risk-metrics">
              {risk.riskMetrics.slice(0, 4).map((m, i) => (
                <div key={i} className="mp-risk-metric">
                  <span className="mp-risk-metric__label">{m.label}</span>
                  <span className={`mp-risk-metric__value${m.warn ? ' mp-risk-metric__value--warn' : ''}`}>{m.value}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mp-scroll-body" onScroll={handleScrollFade}>
          <div className="mp-risk-opp-body">
            {(risk.skillSections || []).map((section, si) => (
              <div key={si}>
                <h3 className="mp-card__sub mp-card__sub--spaced">{section.label}</h3>
                {section.signals && section.signals.length > 0 ? (
                  <div className="mp-risk-list">
                    {section.signals.map((s, i) => (
                      <div key={i} className="mp-risk-card">
                        <div className="mp-risk-card__top">
                          <span className="mp-risk-card__label">{s.signal_type?.replace(/_/g, ' ')}</span>
                          <span className={`mp-risk-card__badge mp-risk-card__badge--${s.assessment?.materiality || 'low'}`}>
                            {s.assessment?.materiality}
                          </span>
                        </div>
                        <span className="mp-risk-card__detail">{s.observation?.summary}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mp-risk-empty">No signals detected</p>
                )}
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ROW 2 LEFT: Recent Activity */}
        <section className="mp-card mp-card--row2">
          <div className="mp-card__head">
            <div className="mp-card__icon"><Clock size={15} /></div>
            <h2 className="mp-card__title">Recent Activity</h2>
          </div>
          <div className="mp-scroll-body" onScroll={handleScrollFade}>
            <div className="mp-activity-list">
              {activity.map((a, i) => (
                <div key={i} className="mp-activity-row">
                  <span className="mp-activity-date">{a.date}</span>
                  <div className="mp-activity-body">
                    <span className="mp-activity-summary">{a.summary}</span>
                    <span className="mp-activity-decision">→ {a.decision}</span>
                    {a.sentiment && (
                      <span className="mp-activity-sentiment">{a.sentiment}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROW 2 RIGHT: Fund News */}
        <section className="mp-card mp-card--row2">
          <div className="mp-card__head">
            <div className="mp-card__icon"><Newspaper size={15} /></div>
            <h2 className="mp-card__title">Fund News</h2>
            <AIBadge size="sm" />
          </div>
          <div className="mp-scroll-body" onScroll={handleScrollFade}>
            <div className="mp-news-list">
              {news.map((n, i) => (
                <div key={i} className="mp-news-item">
                  <div className="mp-news-meta">
                    <span className="mp-news-ticker">{n.ticker}</span>
                    {n.weight_pct != null && <span className="mp-news-context">{n.weight_pct}% of portfolio</span>}
                  </div>
                  <span className="mp-news-fund">{n.fund_name}</span>
                  <span className="mp-news-headline">{n.summary}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROW 3 LEFT: Discussion Angles */}
        <section className="mp-card mp-card--row3">
          <div className="mp-card__head">
            <div className="mp-card__icon"><MessageSquare size={15} /></div>
            <h2 className="mp-card__title">Discussion Angles</h2>
            <button className="mp-script-btn" onClick={() => setShowScript(true)}>Show Script</button>
            <AIBadge size="sm" />
          </div>
          <div className="mp-scroll-body" onScroll={handleScrollFade}>
            <div className="mp-discussion-list">
              {angles.map((a, i) => (
                <div key={i} className="mp-discussion-item">
                  <span className="mp-discussion-num">{i + 1}</span>
                  <div>
                    <span className="mp-discussion-title">{a.title}</span>
                    <span className="mp-discussion-desc">{a.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROW 3 RIGHT: Next Best Actions */}
        <section className="mp-card mp-card--row3">
          <div className="mp-card__head">
            <div className="mp-card__icon mp-card__icon--accent"><Rocket size={15} /></div>
            <h2 className="mp-card__title">Next Best Actions</h2>
            <AIBadge size="sm" />
          </div>
          <div className="mp-scroll-body" onScroll={handleScrollFade}>
          <div className="mp-nba-list">
            {(actions?.primary || []).map((a, i) => (
              <div key={i} className="mp-nba-card mp-nba-card--primary">
                <div className="mp-nba-card__head">
                  <CheckCircle size={14} />
                  <span className="mp-nba-card__title">{a.label}</span>
                  {a.reasoning && (
                    <button className="mp-view-more mp-view-more--reasoning" onClick={() => setReasoningAction(a)}>
                      View Agent Reasoning <ChevronDown size={11} />
                    </button>
                  )}
                </div>
                <p className="mp-nba-card__desc">{a.desc}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

      </div>

      {/* ── Quick Links — only shown when a real clientId is available ── */}
      {navClientId && (
      <div className="mp-quicklinks">
        <span className="mp-ql-label">Jump to</span>
        <button className="mp-ql-btn" onClick={() => navigate('/')}>
          <TrendingUp size={12} /> Today's Schedule
        </button>
        <button className="mp-ql-btn" onClick={() => navigate('/')}>
          <AlertTriangle size={12} /> Priority Queue
        </button>
        <button className="mp-ql-btn" onClick={() => navigate('/')}>
          <User size={12} /> Client Profile
        </button>
        <button className="mp-ql-btn" onClick={() => navigate('/')}>
          <Shield size={12} /> Investment Policy (IPS)
        </button>
      </div>
      )}

      {/* ── Script Modal ── */}
      {showScript && createPortal(
        <div className="modal-overlay" onClick={() => setShowScript(false)}>
          <div className="modal-shell" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header__left">
                <div className="modal-header__titles">
                  <span className="modal-header__title">NBC Script</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowScript(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <p className="mp-modal__script">{client.nbcScript || 'Script coming soon.'}</p>
            </div>
          </div>
        </div>
      , document.body)}

      {/* ── Agent Reasoning Modal ── */}
      {reasoningAction && createPortal(
        <div className="modal-overlay" onClick={() => setReasoningAction(null)}>
          <div className="modal-shell" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header__left">
                <div className="modal-header__titles">
                  <span className="modal-header__title">Agent Reasoning</span>
                  <span className="modal-header__subtitle">{reasoningAction.label}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setReasoningAction(null)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <p className="mp-modal__script">{reasoningAction.reasoning}</p>
            </div>
          </div>
        </div>
      , document.body)}

    </div>
  );
};

export default MeetingPrep;
