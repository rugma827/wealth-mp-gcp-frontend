import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useMeeting } from '../context/MeetingContext';
import DetailHeader from '../components/detail/DetailHeader';
import PortfolioSnapshot from '../components/detail/PortfolioSnapshot';
import RisksOpportunities from '../components/detail/RisksOpportunities';
import DiscussionAngles from '../components/detail/DiscussionAngles';
import NextBestActions from '../components/detail/NextBestActions';
import RecentActivity from '../components/detail/RecentActivity';
import FundNews from '../components/detail/FundNews';
import AdvisorNotes from '../components/detail/AdvisorNotes';
import '../components/detail/detail.css';

export default function DetailPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { getBrief } = useMeeting();

  const brief = useMemo(() => {
    return getBrief(clientId);
  }, [clientId, getBrief]);

  if (!brief || !brief.client) {
    return (
      <div className="detail-page-root animate-fade-in">
        <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
          <Sparkles size={36} style={{ color: 'var(--text-tertiary)', marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
            Meeting Brief Not Found
          </h2>
          <p style={{ color: 'var(--text-tertiary)', maxWidth: 460, margin: '0 auto 20px' }}>
            We could not locate pre-generated intelligence for client ID: {clientId}.
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            <ArrowLeft size={14} />
            <span>Return to Meeting Hub</span>
          </button>
        </div>
      </div>
    );
  }

  const { client, holdings, risk, angles, actions, activity, news, pptxId } = brief;

  return (
    <div className="detail-page-root animate-fade-in">
      {/* Client Identity & Command Strip */}
      <DetailHeader client={client} pptxId={pptxId} />

      {/* Row 1: Portfolio Snapshot & Performance */}
      <PortfolioSnapshot holdings={holdings} />

      {/* Row 2: Surveillance Signals & Policy Drift */}
      <RisksOpportunities risk={risk} />

      {/* Row 3: Discussion Angles & Talking Script */}
      <DiscussionAngles angles={angles} client={client} />

      {/* Row 4: Next Best Actions & Fiduciary Reasoning */}
      <NextBestActions actions={actions} />

      {/* Row 5: 2-Column Touchpoint Activity + Curated Fund News */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <RecentActivity activity={activity} />
        <FundNews news={news} />
      </div>

      {/* Row 6: In-Meeting Execution Scratchpad & Checklist */}
      <AdvisorNotes clientId={client.customerId || clientId} />
    </div>
  );
}
