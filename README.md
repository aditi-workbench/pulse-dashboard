# PULSE — Engineering Release Health Dashboard

> Real-time visibility into feature release health, team sprint velocity, and delivery risk for engineering teams.

**[Open the live dashboard →](https://aditi-workbench.github.io/pulse-dashboard/)**

PULSE is an interactive engineering dashboard built for **FleetVision Technologies**, a telematics company with three engineering teams — **Hardware**, **Software**, and **Quality**. It surfaces the health of active feature releases and provides deep-dive sprint metrics sourced from JIRA, so engineering leaders can quickly identify which teams are putting a committed delivery date at risk and take action.

---

## What problem does this solve?

When multiple engineering teams work toward shared feature releases, delivery risk often hides inside individual team sprint reports until it's too late. PULSE aggregates six months of sprint data (Jan – Jun 2026) and cross-references it against committed release dates, giving a single-pane-of-glass view that answers:

- Which feature releases are on track, at risk, or already delayed?
- Which specific team is the bottleneck?
- What happened inside their sprints to cause the slip?

---

## Dashboard pages

### 1. Feature Release Health (home page `/`)

The home page shows all five active feature releases across the Q1–Q2 2026 engineering cycle.

| Column | What it shows |
|---|---|
| **Feature** | Name, JIRA epic key, and expand toggle for full description |
| **Category** | Bug fix / Top Customer Feature Ask / KTLO (Keep The Lights On) |
| **Teams** | Which of the three engineering teams own or contribute to this release |
| **Committed Date** | The date the team committed to deliver; shown in red if past due |
| **Progress** | Completion percentage with a color-coded progress bar |
| **Status** | On Track · At Risk · Delayed |
| **Risk** | Risk severity (Critical / High / Medium / Low) **+ a direct hyperlink to the at-risk team's Sprint Metrics** |

Clicking any row expands a risk analysis panel with the full description of the feature and a plain-English explanation of why it is at risk, with a button to jump straight to that team's sprint data.

Four KPI summary cards at the top give an at-a-glance count of total, on-track, at-risk, and delayed releases. A category filter lets you isolate Bug fixes, Customer Features, or KTLO work.

---

### 2. Sprint Metrics (`/sprints`)

Accessible from the left nav or via a team hyperlink from the Feature Release page (which pre-selects the at-risk team automatically).

**Team selector tabs** — switch between Hardware, Software, and Quality teams.

**KPI cards:**
- Average sprint velocity across all completed sprints
- Total story points delivered year-to-date
- Total bugs found across all sprints
- Total blocked ticket-sprints

**Sprint Velocity Trend chart** — a grouped bar chart showing Planned vs Completed story points for every sprint (Sprint 1 through the current active Sprint 13). The sprint health bar below the chart color-codes each sprint green / amber / red so velocity trends are immediately visible.

**Active Sprint panel** — shows the live Sprint 13 (Jun 22 – Jul 3) with goal, completion progress, per-stat counters (bugs, blocked, carried over), and the full ticket list with JIRA IDs, assignees, story points, and status.

**Sprint History table** — every sprint from newest to oldest. Click any row to expand the full ticket list for that sprint.

---

## Sample data overview

The dashboard ships with realistic fake data modeled around a telematics product company.

**Company:** FleetVision Technologies — Telematics Division
**Time window:** January 5 – June 28, 2026 (13 sprints, 2-week cadence)
**Teams:** Hardware · Software · Quality

### Feature releases

| ID | Feature | Category | Committed | Status | Risk |
|---|---|---|---|---|---|
| FLT-001 | OTA Firmware Crash Fix v3.1.2 | Bug | Feb 28, 2026 | Delayed | Critical |
| FLT-002 | Enhanced GPS Precision v2.5 | Customer Feature | Jun 15, 2026 | Delayed | High |
| FLT-003 | CAN Bus Protocol Upgrade v3.2 | KTLO | Jul 31, 2026 | On Track | Medium |
| FLT-004 | Driver Behavior Analytics Dashboard | Customer Feature | Jul 15, 2026 | At Risk | Medium |
| FLT-005 | Cellular Network Failover | Bug | Jun 30, 2026 | At Risk | High |

### Team narratives (the "why" behind the data)

**Hardware team** — Excellent velocity in Jan–Feb, then a 6-week supply-chain disruption (sprints 3–5) for the u-blox M10 GNSS module caused velocity to collapse to ~50%. This directly delayed the GPS Precision feature (FLT-002) past its Jun 15 committed date.

**Software team** — Strong through April, then the Cellular Failover feature (FLT-005) revealed a mandatory modem abstraction-layer rewrite that was never scoped. Velocity fell to 63–68% through sprints 5–12. With a Jun 30 delivery deadline and the APN regression bug still open, this release is the highest live risk item.

**Quality team** — The OTA firmware bug (FLT-001) triggered a full regression sweep across 14 hardware SKUs in Feb–Mar, dropping QA velocity to 37–41% for sprints 3–4. The team recovered by April. In June, device lab contention between cellular failover testing and driver analytics has begun compressing velocity again (Sprint 12: 68%).

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 with TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v3 (utility-first, custom design tokens) |
| Charts | Recharts (responsive bar charts, custom tooltips) |
| Routing | React Router v6 (URL-driven team pre-selection) |
| Icons | Lucide React |
| Fonts | Inter (UI), JetBrains Mono (code/data) |

---

## Project structure

```
src/
├── types/
│   └── index.ts              # TypeScript interfaces for all data models
├── data/
│   ├── featureReleases.ts    # 5 feature release records
│   └── sprintData.ts         # 13 sprints × 3 teams = 39 sprint records + tickets
├── components/
│   └── Layout/
│       ├── Sidebar.tsx        # Left navigation with PULSE branding
│       └── Layout.tsx         # Root layout wrapper (Outlet)
└── pages/
    ├── FeatureReleasePage.tsx # Home page — release table + KPI cards
    └── SprintMetricsPage.tsx  # Sprint velocity chart + history + ticket drill-down
```

---

## Quick start — no install required

**`pulse-dashboard.html`** is a fully self-contained single file included in this repo. It loads all dependencies (React, Recharts, Tailwind CSS, React Router) from a CDN at runtime — no Node.js, no npm, no build step.

1. Download [`pulse-dashboard.html`](./pulse-dashboard.html) from this repository
2. Open it in any modern browser (Chrome, Firefox, Safari, Edge)
3. The full interactive dashboard loads immediately

> **How it works:** The HTML file uses Babel Standalone to compile JSX in the browser, imports React 18 and Recharts via UMD CDN scripts, and uses a `HashRouter` (`#/sprints`) so navigation works from the local file system without a web server. An internet connection is required to load CDN assets.

---

## Full development setup

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm (included with Node.js)

### Install and run

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pulse-dashboard.git
cd pulse-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build      # Outputs to dist/
npm run preview    # Preview the production build locally
```

---

## How to navigate the dashboard

1. **Start on the Feature Release page** (loads by default). Read the KPI cards and scan the risk column.

2. **Use the category filter** (All / Bug / Customer Feature / KTLO) to focus on a specific type of work.

3. **Click any table row** to expand the risk detail panel — it explains in plain English why the feature is at risk and which team is the bottleneck.

4. **Click the team sprint link** in the Risk column (e.g. "Software Sprints →") to jump to Sprint Metrics with that team already selected. The URL will be `/sprints?team=Software`.

5. **On the Sprint Metrics page**, use the team tabs to switch between Hardware, Software, and Quality. The bar chart and sprint health bar immediately reveal where velocity dipped.

6. **Click any sprint row** in the Sprint History table to expand the full JIRA ticket list for that sprint — including ticket ID, title, type, story points, assignee, and status (Done / In Progress / Blocked / To Do).

7. **Use "Back to Feature Releases"** (top-right of Sprint Metrics) to return to the home page.

---

## Extending the dashboard

The data is defined in `src/data/` as plain TypeScript arrays. To adapt this to a real engineering team:

- Replace `featureReleases.ts` with data fetched from your project management API
- Replace `sprintData.ts` with data from the JIRA REST API (`/rest/agile/1.0/board/{boardId}/sprint`)
- Add an `.env` file with your API keys and update the data fetching layer

---

## License

MIT
