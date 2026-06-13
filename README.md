# MindMirror AI

An AI-powered mental wellness companion for students preparing for JEE, NEET, UPSC, CAT, CUET and similar competitive exams.

## Features

- **AI Journal Analysis** — Write freely; get sentiment, triggers, themes, and coaching tips
- **Mood Tracking** — Daily mood logging with trigger tags and trend charts
- **Stress Trigger Detection** — Auto-identified patterns from moods and journals
- **Burnout Risk Meter** — Composite score with factor breakdown
- **AI Wellness Coach** — Empathetic chat support with quick-reply suggestions
- **Personalized Action Plan** — Tailored steps based on your data
- **Weekly Emotional Insights** — Pattern cards and mood trend analysis

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (glassmorphism design system)
- Framer Motion, Recharts, Zod, Vitest

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Click **Load Sample Week** on the dashboard to populate demo data for the competition pitch.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run Vitest test suite |
| `npm run lint` | ESLint check |

## Data Storage

All data is stored in browser `localStorage` — no backend or API keys required. AI features use a rule-based mock engine with realistic exam-student language.

## Demo Flow

1. Dashboard → purple glass UI with burnout ring
2. Load Sample Week → moods, journals, triggers populated
3. Weekly Insights → "You feel stressed after every mock test…"
4. Journal → write about a mock test → instant AI analysis
5. Coach → "I failed my mock" → empathetic response
6. Action Plan → personalized items with checkboxes
7. Burnout → animated meter with factor breakdown

## Quality

See [QUALITY.md](./QUALITY.md) for the engineering scorecard (target: 90+/100 per category).
