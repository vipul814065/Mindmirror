# MindMirror AI — PromptWars Challenge Alignment

This document maps the reconstructed PromptWars challenge to implemented features. Use it for judge review.

## Challenge statement (reconstructed)

MindMirror AI is an **AI-powered mental wellness companion** for students preparing for **JEE, NEET, UPSC, CAT, CUET** and similar competitive exams.

### Seven core features

1. **AI Journal Analysis** — Write freely; get sentiment, stress, burnout risk, confidence, triggers, themes, AI reasoning, and recommendations
2. **Mood Tracking** — Daily mood logging with trigger tags and trend charts
3. **Stress Trigger Detection** — Auto-identified patterns from moods and journals
4. **Burnout Risk Meter** — Composite score with factor breakdown
5. **AI Wellness Coach** — Empathetic chat support with quick-reply suggestions
6. **Personalized Action Plan** — Tailored steps based on your data
7. **Weekly Emotional Insights** — Pattern cards and mood trend analysis

### Extended features (12/12 Challenge Requirements Coverage)

See **Challenge Requirements Coverage** panel on the dashboard for the full checklist with auto-detection.

### Signature insight

> You feel stressed after every mock test… motivation recovers within 2 days.

### Demo pitch flow

1. Dashboard → **PromptWars Competition Pitch** panel + **Challenge Requirements Coverage**
2. Load Sample Week → moods, journals, triggers populated
3. Weekly Insights → mock-test stress pattern + Hyper-Personalized AI Insights
4. Journal → **Try demo entry** → **Analyze Entry** (6 AI metrics + reasoning)
5. Coach → **Demo: “I failed my mock”** → empathetic response
6. Mindfulness → adaptive breathing/grounding exercises
7. Action Plan → personalized items with checkboxes
8. Burnout → animated meter with factor breakdown
9. Analytics → full chart dashboard (extended demo)

### Technical constraints

- Next.js 16 + TypeScript + Tailwind v4 glassmorphism UI
- Client-only `localStorage` persistence (no backend/API keys)
- Rule-based mock AI behind swappable `WellnessAIEngine` interface + `src/services/` layer

---

## Line-by-line mapping

| Requirement | Route | Evidence |
|-------------|-------|----------|
| AI wellness companion | `/` | Dashboard + `CompetitionPitchPanel` + `ChallengeRequirementsCoverage` |
| JEE/NEET/UPSC/CAT/CUET targeting | `/`, `/settings` | Exam pills, exam-specific coach prefix |
| AI Journal Analysis (6+ outputs) | `/journal` | Mood, stress, burnout, confidence, triggers, recommendation, AI reasoning |
| Mood tracking + charts | `/mood` | `MoodPicker`, `MoodChart` |
| Stress trigger detection | `/insights/triggers` | `detectTriggerPatterns`, breakdown chart |
| Burnout risk meter | `/burnout` | `ProgressRing`, factor breakdown, tips |
| AI wellness coach | `/coach` | Chat UI, floating widget, `Demo: I failed my mock` |
| Personalized action plan | `/plan` | Category badges, checkboxes, progress |
| Weekly emotional insights | `/insights/weekly` | `HeroInsightCard`, Hyper-Personalized AI Insights |
| Adaptive mindfulness | `/mindfulness` | Trigger-adaptive exercises |
| Motivational encouragement | `/` | `MotivationalBanner`, coach closings |
| Academic wellbeing | `/analytics`, `/` | `WeeklyProgressCard`, study metrics |
| Signature mock-test insight | `/`, `/insights/weekly` | `getHeroInsightQuote()` |
| Load Sample Week demo | `/` | `CompetitionPitchPanel` → Load Sample Week |
| 30-day mood trend | `/`, `/analytics` | `MoodChart` |
| Analytics charts (8 types) | `/analytics` | All chart components |
| Glassmorphism purple/white UI | Global | `globals.css`, `GradientBackground`, glass components |
| Mock AI engine | `src/lib/ai/`, `src/services/` | `engine.ts`, `safety.ts`, service facades |
| Engineering quality | `QUALITY.md` | CI, tests, security headers |

---

## 2-minute judge script

1. Open **http://localhost:3000**
2. Confirm **PromptWars Competition Pitch** panel shows requirements
3. Confirm **Challenge Requirements Coverage** shows **12/12**
4. Click **Load Sample Week** if needed
5. Read **hero AI insight** and **Motivational Encouragement** banner
6. Scan **AI Wellness Features** grid (8 feature cards)
7. Click **Start guided pitch** or use **Show me** links:
   - Weekly Insights → Hyper-Personalized AI Insights
   - Journal → **Try demo entry** → **Analyze Entry**
   - Coach → **Demo: “I failed my mock”**
   - Mindfulness → adaptive exercises
   - Plan → category badges + checkboxes
   - Burnout → animated ring + factors
   - Triggers → mock-test breakdown
   - Analytics → full chart suite

---

## Verification commands

```bash
npm run lint
npm test
npm run build
```
