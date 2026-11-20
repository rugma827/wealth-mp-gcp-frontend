# Standalone Meeting Intelligence UI

A dedicated, standalone React application providing an executive **Landing Page / Command Hub** and a comprehensive **Detailed Meeting Prep Studio** for Wealth Advisors.

Designed with dark luxury glassmorphism adhering to the Wealth Advisory design language.

---

## Features

### 1. Landing Page (Command Hub)
- **Top Command Bar**: Current date, Google Calendar synchronization indicator, Live Backend / Demo Mode toggle switch, Refresh button, Ad-Hoc Direct Prep trigger, and Preferences modal.
- **Executive Metrics Strip**:
  - Today's agenda count
  - AI Briefs prepared
  - Total AUM in meetings
  - Critical suitability & cash drift alerts
- **Interactive Schedule Roster**:
  - **Today's Meetings** vs **Upcoming Outlook (Next 3–7 Days)** tab switcher
  - Real-time meeting cards with duration, countdown, tier, AUM, risk level, topic, and channel
  - **Dynamic Generation State**: One-click "Generate with AI" or "View Prep Brief" with real-time SSE progress streaming bar
- **Direct Client Prep Modal**:
  - Allows the advisor to search or select any client (e.g., David Thompson, Kevin Smyth, Alex Morgan) to generate an immediate brief on-demand without needing a scheduled calendar event.
- **Preferences Modal**:
  - Calendar provider sync toggle, auto-run schedules (07:30 AM / 13:00 PM), presentation export defaults, and cache reset.

### 2. Detailed Meeting Intelligence Page (Prep Studio)
- **Client Hero Banner**:
  - Back navigation to Meeting Hub
  - Client name, Client ID, Tier badge, Risk Status banner (CRITICAL), Sentiment, Meeting Time, and Meeting Objective
  - **Export Presentation (.pptx)**: 1-click download of generated slides
  - **Next Best Conversation (NBC) Trigger**: Highlights why the consultation was flagged
- **Portfolio Snapshot & Holdings Table**:
  - Market Value, Cost Basis, Unrealized G/L, Cash & Equivalents KPI boxes
  - Asset Allocation & Multi-year performance breakdown (VTI, IEFA, BND, QQQ, etc.)
  - Agentic Allocation Insights bullet points
- **Risks & Opportunity Signals**:
  - Risk metric gauges (Idle Cash Drift, Equity Target Gap, Beta, Liquidity Adequacy)
  - Materiality signal cards (Cash Allocation & Policy Drift, Behavioral & Suitability flags)
- **Discussion Angles & Talking Points**:
  - Numbered conversational strategies
  - **"Show NBC Script" Modal**: Renders the complete behavioral advisor talking script with a 1-click copy button
- **Next Best Actions (NBA) & Reasoning**:
  - Primary fiduciary action cards
  - **"View Agent Reasoning" Modal**: Multi-agent deliberation chain-of-thought and Reg BI compliance rationale
- **Client Touchpoint History & News**:
  - Timeline of prior reviews, client queries, decisions, and sentiments
  - Curated ticker-mapped market news
- **In-Meeting Scratchpad & Checklist**:
  - Private advisor notes with auto-saving to local storage
  - Milestone checklist for in-meeting execution

---

## Dual Mode Support (Live Backend & Demo Mode)

- **Live Mode**: Directly queries the FastAPI backend running at `http://localhost:8000`:
  - `POST /meeting-prep/check-auth`
  - `POST /meeting-prep/get-calendar-events`
  - `POST /meeting-prep/upcoming-events`
  - `POST /meeting-prep/meeting-prep-by-id`
  - `POST /meeting-prep/client-prep-direct`
  - `GET /meeting-prep/download-pptx/{pptx_id}`
  - `GET /assist/progress/{task_id}` (Server-Sent Events)
- **Demo Mode**: Built-in synthetic datasets for high-fidelity offline demonstrations (David Thompson, Kevin Smyth, Alex Morgan, etc.) with simulated multi-step agent progress.

---

## Quick Start

```bash
cd meeting-intelligence-ui

# Install dependencies (already completed)
npm install

# Start local dev server (default port 5174)
npm run dev

# Build production bundle
npm run build
```
