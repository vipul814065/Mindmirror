# MindMirror AI — PromptWars Challenge Alignment

This document maps the reconstructed PromptWars challenge to implemented features. Use it for judge review.

## Challenge statement (reconstructed)

MindMirror AI is an **AI-powered mental wellness companion** for students preparing for **JEE, NEET, UPSC, CAT, CUET** and similar competitive exams.

### Seven core features

1. **AI Journal Analysis** — Write freely; get sentiment, triggers, themes, and coaching tips
2. **Mood Tracking** — Daily mood logging with trigger tags and trend charts
3. **Stress Trigger Detection** — Auto-identified patterns from moods and journals
4. **Burnout Risk Meter** — Composite score with factor breakdown
5. **AI Wellness Coach** — Empathetic chat support with quick-reply suggestions
6. **Personalized Action Plan** — Tailored steps based on your data
7. **Weekly Emotional Insights** — Pattern cards and mood trend analysis

### Signature insight

> You feel stressed after every mock test… motivation recovers within 2 days.

### Demo pitch flow

1. Dashboard → purple glass UI with burnout ring
2. Load Sample Week → moods, journals, triggers populated
3. Weekly Insights → mock-test stress pattern
4. Journal → write about a mock test → instant AI analysis
5. Coach → “I failed my mock” → empathetic response
6. Action Plan → personalized items with checkboxes
7. Burnout → animated meter with factor breakdown
8. Analytics → full chart dashboard (extended demo)

### Technical constraints

- Next.js 16 + TypeScript + Tailwind v4 glassmorphism UI
- Client-only `localStorage` persistence (no backend/API keys)
- Rule-based mock AI behind swappable `WellnessAIEngine` interface

---

## Line-by-line mapping

| Requirement | Route | Evidence |
|-------------|-------|----------|
| AI wellness companion | `/` | Dashboard + `CompetitionPitchPanel` |
| JEE/NEET/UPSC/CAT/CUET targeting | `/`, `/settings` | Exam pills, exam-specific coach prefix |
| AI Journal Analysis (5 outputs) | `/journal` | Sentiment badge, triggers, themes, reflection, coaching tip |
| Mood tracking + charts | `/mood` | `MoodPicker`, `MoodChart` |
| Stress trigger detection | `/insights/triggers` | `detectTriggerPatterns`, breakdown chart |
| Burnout risk meter | `/burnout` | `ProgressRing`, factor breakdown, tips |
| AI wellness coach | `/coach` | Chat UI, `Demo: I failed my mock` quick action |
| Personalized action plan | `/plan` | Category badges, checkboxes, progress |
| Weekly emotional insights | `/insights/weekly` | `HeroInsightCard`, pattern cards, trend |
| Signature mock-test insight | `/`, `/insights/weekly` | `getHeroInsightQuote()` |
| Load Sample Week demo | `/` | `CompetitionPitchPanel` → Load Sample Week |
| 30-day mood trend | `/`, `/analytics` | `MoodChart` |
| Analytics charts (8 types) | `/analytics` | All chart components |
| Glassmorphism purple/white UI | Global | `globals.css`, `GradientBackground`, glass components |
| Mock AI engine | `src/lib/ai/` | `engine.ts`, `safety.ts` |
| Engineering quality | `QUALITY.md` | CI, tests, security headers |

---

## 2-minute judge script

1. Open **http://localhost:3000**
2. Confirm **PromptWars Competition Pitch** panel shows 8/8 requirements
3. Click **Load Sample Week** if needed
4. Read **hero AI insight** on dashboard
5. Click **Start guided pitch** or use **Show me** links:
   - Weekly Insights → hero quote + patterns
   - Journal → **Try demo entry** → **Analyze Entry**
   - Coach → **Try: “I failed my mock”**
   - Plan → category badges + checkboxes
   - Burnout → animated ring + factors
   - Triggers → 43% mock-test breakdown
   - Analytics → full chart suite

---

## Verification commands

```bash
npm run lint
npm test
npm run build
```
