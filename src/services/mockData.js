/**
 * Meeting Intelligence Mock & Synthetic Data Store
 * Built from Wealth Advisory Bedrock AgentCore & Snowflake Knowledge Base
 */

export const MOCK_SCHEDULE_TODAY = [
  {
    id: 'meet-001',
    meetingId: 'evt-david-thompson',
    clientId: 'C005',
    clientName: 'David Thompson',
    time: '09:00 AM',
    duration: '45m',
    status: 'ready',
    meetingType: 'Cash Deployment & Compliance Review',
    channel: 'In-person',
    tier: 'Premium / HNW',
    aum: '$1,590,000',
    riskStatus: 'CRITICAL',
    sentiment: 'Anxious',
    meetingGoal: 'Cash Deployment, Compliance Review & Behavioral Reassurance',
    location: 'Executive Boardroom 4A',
    pptxId: 'david_thompson_cash_deployment_deck',
    countdown: 'In 25 mins',
  },
  {
    id: 'meet-002',
    meetingId: 'evt-alex-morgan',
    clientId: '15600001',
    clientName: 'Alex Morgan',
    time: '11:30 AM',
    duration: '30m',
    status: 'ready',
    meetingType: 'Portfolio Drift & Rebalancing Review',
    channel: 'Teams Video',
    tier: 'Gold',
    aum: '$500,000',
    riskStatus: 'HIGH',
    sentiment: 'Cautious but improving',
    meetingGoal: 'Reassess equity drift and evaluate rebalancing approaches',
    location: 'Microsoft Teams Link',
    pptxId: 'alex_morgan_drift_rebalance_deck',
    countdown: 'In 2h 55m',
  },
  {
    id: 'meet-003',
    meetingId: 'evt-kevin-smyth',
    clientId: 'C012',
    clientName: 'Kevin Smyth',
    time: '02:30 PM',
    duration: '45m',
    status: 'ready',
    meetingType: 'Cash Deployment Review & Alignment',
    channel: 'In-person',
    tier: 'Standard / Growth',
    aum: '$850,000',
    riskStatus: 'MEDIUM',
    sentiment: 'Risk-Averse',
    meetingGoal: 'Cash Deployment Review & Behavioral Alignment',
    location: 'Branch Office 210',
    pptxId: 'kevin_smyth_cash_deployment_deck',
    countdown: 'In 5h 55m',
  },
  {
    id: 'meet-004',
    meetingId: 'evt-mary-hargrave',
    clientId: '15634602',
    clientName: 'Mary Hargrave',
    time: '04:15 PM',
    duration: '30m',
    status: 'not_generated',
    meetingType: 'Strategy Realignment & Market Check',
    channel: 'Phone Call',
    tier: 'Platinum',
    aum: '$577,000',
    riskStatus: 'MEDIUM',
    sentiment: 'Anxious about market volatility',
    meetingGoal: 'Portfolio Realignment & Strategy Reassurance',
    location: 'Direct Phone Line',
    pptxId: null,
    countdown: 'Today',
  },
];

export const MOCK_SCHEDULE_UPCOMING = [
  {
    id: 'meet-101',
    meetingId: 'evt-jean-williams',
    clientId: '15740900',
    clientName: 'Jean Williams',
    dateLabel: 'Tomorrow, Nov 12',
    time: '10:00 AM',
    duration: '45m',
    status: 'ready',
    meetingType: 'Investment Planning & Income Strategy',
    channel: 'In-person',
    tier: 'Gold',
    aum: '$452,429',
    riskStatus: 'LOW',
    sentiment: 'Focused on income stability',
    meetingGoal: 'Fixed income yield enhancement and dividend reinvestment',
    location: 'Office Meeting Room 2B',
    pptxId: 'jean_williams_prep_deck',
  },
  {
    id: 'meet-102',
    meetingId: 'evt-marcus-thompson',
    clientId: '15623828',
    clientName: 'Marcus Thompson',
    dateLabel: 'Thursday, Nov 13',
    time: '01:30 PM',
    duration: '30m',
    status: 'not_generated',
    meetingType: 'Annual Policy & Asset Allocation Review',
    channel: 'Zoom Call',
    tier: 'Silver',
    aum: '$341,185',
    riskStatus: 'LOW',
    sentiment: 'Capital preservation focused',
    meetingGoal: 'Capital preservation posture check & annual IPS signature',
    location: 'Zoom Meeting Room',
    pptxId: null,
  },
  {
    id: 'meet-103',
    meetingId: 'evt-sarah-chen',
    clientId: 'C034',
    clientName: 'Dr. Sarah Chen',
    dateLabel: 'Friday, Nov 14',
    time: '03:00 PM',
    duration: '60m',
    status: 'not_generated',
    meetingType: 'Tax-Loss Harvesting & Estate Advisory',
    channel: 'In-person',
    tier: 'Ultra HNW',
    aum: '$3,820,000',
    riskStatus: 'MEDIUM',
    sentiment: 'Highly Analytical',
    meetingGoal: 'Year-end tax optimization & donor-advised fund setup',
    location: 'Private Client Suite 1',
    pptxId: null,
  },
];

export const MOCK_CLIENT_DETAILS = {
  'C005': {
    client: {
      customerId: 'C005',
      name: 'David Thompson',
      tier: 'Premium / HNW',
      riskProfile: 'Moderate Growth',
      riskStatus: 'CRITICAL',
      sentiment: 'Anxious',
      aum: '$1,590,000',
      meetingTime: '9:00 AM Today',
      meetingGoal: 'Cash Deployment, Compliance Review & Behavioral Reassurance',
      householdId: 'HH005',
      accountId: 'A005',
      clientType: 'Accumulation – Brokerage',
      advisorId: 'ADV001',
      kycStatus: 'Verified',
      nbaTrigger: 'High idle cash (22% vs 10% target, >$350K) combined with anxious sentiment creates immediate performance drag, behavioral risk, and suitability drift — proactive advisor intervention is strongly advised.',
      profileIntro: 'New HNW client onboarded Feb 2026 — currently in early trust-building phase. Tech executive based in San Jose with high discretionary earnings. Exhibits heightened volatility reactivity and tends to defer decisions during market swings. Prefers structured, data-backed reassurance over open-ended macroeconomic discussions.',
      nbcScript: '"David, I want to start by acknowledging that your caution over the past quarters has been completely understandable given market volatility. The gap we are seeing in your overall performance is not coming from poor asset selection or market timing — it is coming from the fact that 22% of your total portfolio is currently parked in idle cash. While that cash provided comfort, it quietly worked against your long-term accumulation objective. I would like to show you a gradual, phased dollar-cost averaging plan over the next 4 months so your capital is put to work without exposing you to sudden market shocks."',
    },
    holdings: {
      totalValue: '$1,590,000',
      costBasis: '$1,320,000',
      unrealizedGL: '+$270,000 (+20.4%)',
      cashBalance: '$349,800 (22.0%)',
      performance: [
        { fund: 'Vanguard Total Stock Market (VTI)', type: 'US Broad Equity', weight: 32, y2024: '+24.1%', y2025: '+14.6%', trend: 'Growing', remarks: 'Core driver of portfolio upside' },
        { fund: 'iShares Core MSCI EAFE (IEFA)', type: 'Developed Int Equity', weight: 18, y2024: '+15.2%', y2025: '+8.3%', trend: 'Improving', remarks: 'Solid dividend contribution' },
        { fund: 'Vanguard Total Bond Market (BND)', type: 'Core Fixed Income', weight: 16, y2024: '+5.7%', y2025: '+6.2%', trend: 'Stable', remarks: 'Anchor allocation, duration 6.2 yrs' },
        { fund: 'Invesco QQQ Trust (QQQ)', type: 'Large Cap Growth Tech', weight: 12, y2024: '+29.4%', y2025: '+18.1%', trend: 'Growing', remarks: 'High tech beta, overweight target' },
        { fund: 'Cash & Treasury Sweep', type: 'Cash Equivalents', weight: 22, y2024: '+4.8%', y2025: '+4.5%', trend: 'Declining', remarks: 'Excess cash vs 10% IPS maximum' },
      ],
      returns: [
        { label: '1-Year', value: '+14.8%' },
        { label: 'YTD', value: '+9.4%' },
        { label: '3-Year Ann.', value: '+11.2%' },
        { label: 'Cash Drag Loss', value: '-2.4%' },
      ],
      keyInsight: [
        'Total cash balance of $349,800 is 12% above the maximum allowed threshold specified in the IPS.',
        'Net cash drag cost approximately $38,200 in foregone capital growth during the recent equity rally.',
        'Tech exposure through QQQ is well positioned, but overall equity weighting is 8% below the growth model.',
      ],
    },
    risk: {
      riskMetrics: [
        { label: 'Idle Cash Drift', value: '+12.0%', warn: true },
        { label: 'Equity Target Gap', value: '-8.0%', warn: true },
        { label: 'Volatility Score (Beta)', value: '0.88', warn: false },
        { label: 'Liquidity Adequacy', value: 'Overfunded', warn: false },
      ],
      skillSections: [
        {
          label: 'Cash Allocation & Policy Drift',
          signals: [
            {
              signal_type: 'ALLOCATION_DRIFT',
              assessment: { materiality: 'critical' },
              observation: { summary: 'Portfolio is in breach of the 10% cash policy cap (actual 22%). Uninvested funds have sat idle for 90+ days without deployment directives.' },
            },
            {
              signal_type: 'OPPORTUNITY_COST',
              assessment: { materiality: 'high' },
              observation: { summary: 'Estimated $38K opportunity loss relative to 60/40 benchmark over the trailing 12-month period due to excessive cash cushion.' },
            },
          ],
        },
        {
          label: 'Behavioral & Suitability Flags',
          signals: [
            {
              signal_type: 'SENTIMENT_DISCONNECT',
              assessment: { materiality: 'medium' },
              observation: { summary: 'Client marked Moderate Growth on KYC profile but behaves as Capital Preservation during short-term market pullbacks.' },
            },
          ],
        },
      ],
    },
    activity: [
      { date: 'Oct 28, 2026', summary: 'Advisor initiated portfolio review call; client expressed anxiety over interest rate volatility.', decision: 'Agreed to prepare comprehensive deployment roadmap.', sentiment: 'Anxious' },
      { date: 'Sep 14, 2026', summary: 'Quarterly dividend payment of $6,820 deposited directly into cash sweep.', decision: 'Retained in cash per client request.', sentiment: 'Neutral' },
      { date: 'Feb 14, 2026', summary: 'Initial onboarding and transfer of $1.5M liquid assets from prior institution.', decision: 'Executed phase 1 baseline allocation.', sentiment: 'Optimistic' },
    ],
    news: [
      { ticker: 'VTI', fund_name: 'Vanguard Total Stock Market', weight_pct: 32, summary: 'US large caps extend rally as consumer resilience and tech earnings exceed consensus forecasts.' },
      { ticker: 'QQQ', fund_name: 'Invesco QQQ Trust', weight_pct: 12, summary: 'AI infrastructure spend and semiconductor demand bolster Nasdaq-100 earnings guidance.' },
      { ticker: 'BND', fund_name: 'Vanguard Total Bond Market', weight_pct: 16, summary: 'Treasury yields stabilize around 4.15% following Federal Reserve FOMC minutes.' },
    ],
    upcoming: [
      { date: 'Nov 11, 2026', title: 'Cash Deployment & Compliance Review', type: 'Advisory Review' },
      { date: 'Dec 15, 2026', title: 'Year-End Tax Loss Harvesting & 1099 Check', type: 'Tax Planning' },
      { date: 'Feb 14, 2027', title: 'Annual IPS Suitability & Recertification', type: 'Annual Audit' },
    ],
    angles: [
      {
        title: 'Frame Cash as Risk, Not Safe Harbor',
        desc: 'Help David understand that while cash avoids daily volatility, inflation and dividend dilution create guaranteed purchasing power loss.',
      },
      {
        title: 'Present a 4-Tranche Dollar-Cost Averaging (DCA) Plan',
        desc: 'Rather than a lump-sum deployment of $200K, offer 4 equal monthly investments of $50K into VTI and IEFA to lower psychological hesitation.',
      },
      {
        title: 'Reaffirm Emergency Buffer Sufficiency',
        desc: 'Confirm that even after deploying $200K, the remaining $150K comfortably covers 12 months of family living expenses.',
      },
    ],
    actions: {
      primary: [
        {
          label: 'Execute Phased Cash Deployment Schedule',
          desc: 'Deploy $200,000 of idle cash in 4 monthly tranches ($50k/mo) into core index funds (VTI: $35K, IEFA: $15K).',
          reasoning: 'Reduces cash drag by 1.9% annualized while honoring client emotional risk threshold through DCA pacing. Fully compliant with IPS target bands.',
        },
        {
          label: 'Obtain Electronic Rebalancing Consent',
          desc: 'Submit automated digital sign-off document through Wealth Portal for proposed tranche execution.',
          reasoning: 'Reg BI compliance requirement when initiating proactive reallocations exceeding 10% of portfolio value.',
        },
        {
          label: 'Schedule 30-Day Checkpoint Call',
          desc: 'Calendar a brief 15-minute touchpoint after Tranche 1 to review execution and confirm client peace of mind.',
          reasoning: 'Behavioral reinforcement prevents panic cancellations during the deployment window.',
        },
      ],
    },
    pptxId: 'david_thompson_cash_deployment_deck',
  },

  'C012': {
    client: {
      customerId: 'C012',
      name: 'Kevin Smyth',
      tier: 'Standard / Growth',
      riskProfile: 'Moderate',
      riskStatus: 'MEDIUM',
      sentiment: 'Risk-Averse',
      aum: '$850,000',
      meetingTime: '2:30 PM Today',
      meetingGoal: 'Cash Deployment Review & Behavioral Alignment',
      householdId: 'HH012',
      accountId: 'A012',
      clientType: 'Accumulation – Brokerage',
      advisorId: 'ADV001',
      kycStatus: 'Verified',
      nbaTrigger: 'Persistent defensive cash allocation (40% vs 20% IPS limit) is restricting long-term compounding — education-led conversation needed to unlock deployment.',
      profileIntro: 'Mass Affluent client, accumulation-focused with a persistent defensive bias. Prioritizes comfort over capital growth. Responds well to education-led explanations and data-backed framing. Prefers email follow-ups.',
      nbcScript: '"Kevin, I want to take a moment to look at your investment progress. The funds we selected have yielded strong returns between 18% and 28% over the past year. The reason your overall account balance hasn\'t matched that performance is that 40% of your capital is parked in cash sweep. I propose moving a manageable 10% slice of that cash into your dividend growth sleeve over the coming quarter."',
    },
    holdings: {
      totalValue: '$850,000',
      costBasis: '$710,000',
      unrealizedGL: '+$140,000 (+19.7%)',
      cashBalance: '$340,000 (40.0%)',
      performance: [
        { fund: 'Vanguard Dividend Appreciation (VIG)', type: 'Dividend Growth', weight: 30, y2024: '+18.5%', y2025: '+12.1%', trend: 'Growing', remarks: 'Consistent dividend payer' },
        { fund: 'Schwab US Aggregate Bond (SCHZ)', type: 'Core Bonds', weight: 20, y2024: '+5.4%', y2025: '+5.9%', trend: 'Stable', remarks: 'Income stability' },
        { fund: 'SPDR S&P 500 ETF (SPY)', type: 'US Core Large', weight: 10, y2024: '+26.2%', y2025: '+15.2%', trend: 'Growing', remarks: 'Equity anchor' },
        { fund: 'Treasury Money Market Fund', type: 'Cash Equivalent', weight: 40, y2024: '+4.9%', y2025: '+4.6%', trend: 'Declining', remarks: 'Excess reserve beyond IPS guideline' },
      ],
      returns: [
        { label: '1-Year', value: '+10.2%' },
        { label: 'YTD', value: '+6.8%' },
        { label: 'Cash Drag Impact', value: '-3.1%' },
      ],
      keyInsight: [
        'Cash holdings of $340,000 represent double the client’s recommended 20% liquid reserve allocation.',
        'High cash ratio provided downside protection during corrections but created substantial return gap.',
      ],
    },
    risk: {
      riskMetrics: [
        { label: 'Cash Ratio Drift', value: '+20.0%', warn: true },
        { label: 'Income Yield Gap', value: '-1.4%', warn: false },
        { label: 'Portfolio Beta', value: '0.62', warn: false },
      ],
      skillSections: [
        {
          label: 'Asset Allocation Imbalance',
          signals: [
            {
              signal_type: 'OVERALLOCATED_CASH',
              assessment: { materiality: 'high' },
              observation: { summary: '40% cash allocation compared against 20% IPS limit. Capital productivity is significantly subdued.' },
            },
          ],
        },
      ],
    },
    activity: [
      { date: 'Aug 20, 2026', summary: 'Semi-annual portfolio check-in. Client declined equity deployment citing macro recession headlines.', decision: 'Agreed to maintain conservative stance until Q4.', sentiment: 'Cautious' },
    ],
    news: [
      { ticker: 'VIG', fund_name: 'Vanguard Dividend Appreciation', weight_pct: 30, summary: 'Dividend aristocrats report resilient balance sheets and steady dividend increases.' },
      { ticker: 'SCHZ', fund_name: 'Schwab US Aggregate Bond', weight_pct: 20, summary: 'Fixed income durations offer attractive locking-in yield before anticipated rate cuts.' },
    ],
    upcoming: [
      { date: 'Nov 11, 2026', title: 'Cash Deployment Review & Alignment', type: 'Portfolio Review' },
    ],
    angles: [
      {
        title: 'Focus on Low-Volatility Dividend Payers',
        desc: 'Propose allocating into dividend growers rather than pure growth tech to match Kevin’s psychological comfort level.',
      },
      {
        title: 'Illustrate Inflation Compounding Drag',
        desc: 'Demonstrate with a visual chart how 3% inflation erodes real purchasing power on $340K cash over 5 years.',
      },
    ],
    actions: {
      primary: [
        {
          label: 'Allocate $100K into Dividend & Short-Duration Fixed Income',
          desc: 'Rebalance $100K from cash sweep into VIG ($60K) and SCHZ ($40K).',
          reasoning: 'Improves portfolio yield by 115 bps while keeping cash reserves at a generous 28%, preserving safety cushion.',
        },
      ],
    },
    pptxId: 'kevin_smyth_cash_deployment_deck',
  },

  '15600001': {
    client: {
      customerId: '15600001',
      name: 'Alex Morgan',
      tier: 'Gold',
      riskProfile: 'Moderate Growth',
      riskStatus: 'HIGH',
      sentiment: 'Cautious but improving',
      aum: '$500,000',
      meetingTime: '11:30 AM Today',
      meetingGoal: 'Reassess equity drift and evaluate rebalancing approaches',
      nbaTrigger: 'Equity rally expanded tech & large-cap weights by 7.4% above IPS ceiling, increasing portfolio concentration risk.',
      profileIntro: 'Active tech sector professional, moderate growth investor. Understands market mechanics but requests quantitative justification before approving rebalancing shifts.',
      nbcScript: '"Alex, great connecting today. Your equity portfolio had an outstanding run over the past 12 months, driven primarily by your large-cap growth positions. However, that growth pushed your equity exposure to 74%, which is 7.4% over your target risk boundary. Today, I want to present two rebalancing options: trim gains into defensive dividend payers, or reallocate into short-duration bonds."',
    },
    holdings: {
      totalValue: '$500,000',
      costBasis: '$390,000',
      unrealizedGL: '+$110,000 (+28.2%)',
      performance: [
        { fund: 'Vanguard Growth ETF (VUG)', type: 'US Large Growth', weight: 42, y2024: '+31.2%', y2025: '+19.8%', trend: 'Growing', remarks: 'Exceeds target weight by +8.2%' },
        { fund: 'iShares Core S&P 500 (IVV)', type: 'US Core Large', weight: 32, y2024: '+25.4%', y2025: '+14.9%', trend: 'Growing', remarks: 'Solid performance' },
        { fund: 'Vanguard Total International (VXUS)', type: 'Foreign Equity', weight: 14, y2024: '+12.1%', y2025: '+7.4%', trend: 'Stable', remarks: 'Underweight model target' },
        { fund: 'Vanguard Intermediate Treasury (VGIT)', type: 'Fixed Income', weight: 12, y2024: '+4.8%', y2025: '+5.5%', trend: 'Stable', remarks: 'Underweight target by 6%' },
      ],
      returns: [
        { label: '1-Year', value: '+21.4%' },
        { label: 'YTD', value: '+13.8%' },
      ],
      keyInsight: [
        'Equity exposure reached 74% against the model benchmark of 65%.',
        'Large-cap growth concentration increases drawdown sensitivity if market experiences multiple contraction.',
      ],
    },
    risk: {
      riskMetrics: [
        { label: 'Equity Allocation Drift', value: '+7.4%', warn: true },
        { label: 'Sector Concentration', value: 'Technology 38%', warn: true },
        { label: 'Portfolio Beta', value: '1.14', warn: false },
      ],
      skillSections: [
        {
          label: 'Portfolio Allocation Drift',
          signals: [
            {
              signal_type: 'EQUITY_CONCENTRATION_DRIFT',
              assessment: { materiality: 'high' },
              observation: { summary: 'Strong market gains pushed VUG allocation to 42% vs 30% target. Beta elevated to 1.14.' },
            },
          ],
        },
      ],
    },
    activity: [
      { date: 'Sep 10, 2026', summary: 'Quarterly review conducted. Client agreed to monitor tech exposure into year-end.', decision: 'Rebalance trigger set at 75% equity ceiling.', sentiment: 'Neutral' },
    ],
    news: [
      { ticker: 'VUG', fund_name: 'Vanguard Growth ETF', weight_pct: 42, summary: 'Growth funds show strong momentum amid resilient corporate earnings in cloud and hardware.' },
      { ticker: 'VGIT', fund_name: 'Vanguard Interm Treasury', weight_pct: 12, summary: 'Yield curve steepens, presenting attractive entry for intermediate government duration.' },
    ],
    upcoming: [
      { date: 'Nov 11, 2026', title: 'Portfolio Drift & Rebalancing Review', type: 'Rebalancing Review' },
    ],
    angles: [
      {
        title: 'Locking in Gains to De-Risk',
        desc: 'Frame the proposed rebalancing as taking well-earned profits off the table and re-allocating into yield.',
      },
    ],
    actions: {
      primary: [
        {
          label: 'Trim $40K VUG and Reallocate to Intermediate Treasury (VGIT)',
          desc: 'Bring overall equity weighting from 74% down to target 66%.',
          reasoning: 'Realigns risk parameters to client IPS without generating excessive capital gains tax friction.',
        },
      ],
    },
    pptxId: 'alex_morgan_drift_rebalance_deck',
  },
};

export const FALLBACK_CLIENT_DATA = MOCK_CLIENT_DETAILS['C005'];
