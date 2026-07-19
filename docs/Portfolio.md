# Portfolio Case Study — AI Feedback Analyzer

---

## Project Overview

**AI Feedback Analyzer** is a production-quality frontend SPA that transforms raw customer reviews into structured product intelligence. It classifies sentiment, clusters themes, ranks pain points by severity, generates RICE-scored feature recommendations, and produces a three-view product roadmap — all running entirely client-side in the browser with no backend required.

**Live demo:** https://ai-feedback-analyzer.vercel.app  
**Repository:** https://github.com/your-username/ai-feedback-analyzer  
**Role:** Solo — full product design, architecture, engineering, and deployment  
**Timeline:** Built and polished to production quality

---

## Problem Statement

Product managers at startups and scaleups routinely collect hundreds of customer reviews from G2, App Store, Trustpilot, Capterra, and Play Store. Synthesizing them is manual, slow, and inconsistent:

- Copy-pasting into spreadsheets loses structure
- Tools like Medallia or Qualtrics cost $30,000+/year
- Generic ChatGPT prompts produce inconsistent, non-reproducible summaries
- No PM has time to read 500 individual reviews before a quarterly planning session

**The gap:** a fast, free, privacy-respecting tool that goes from raw review text to a prioritized product backlog in under 60 seconds, with no account, no API key, and no data leaving the browser.

---

## What I Built

### Input layer
Two data entry paths: paste raw text (with live per-line classification preview) or upload a CSV/TXT file via drag-and-drop. Five branded sample datasets (Zepto, Swiggy, Zomato, Blinkit, Generic SaaS) let anyone try the tool instantly without having real data.

### Analysis engine
A client-side NLP pipeline in `analysisEngine.ts`:
- **Sentiment classification** — keyword scoring across 40 curated positive/negative terms
- **Theme detection** — keyword clustering across 9 product domains
- **Pain point identification** — regex pattern matching against 7 severity-ranked pain point categories
- **Executive summary** — deterministic template-based prose generation from computed metrics

### Visualization layer
Eight interactive chart types across six analysis pages: Area charts (sentiment trends), Radar charts (theme vs. sentiment matrix), Scatter plots (impact/effort matrix), Bar charts (RICE rankings, rating distributions, source breakdowns), Pie/Donut charts (sentiment split), Word clouds (theme frequency visualization), Gantt/Kanban/Timeline views (roadmap).

### Export layer
Three real download formats: PDF (browser `window.print()` with `@media print` CSS), CSV (Blob download with proper quoting), JSON (complete analysis snapshot). Zero new dependencies.

---

## Technical Decisions and Why They Matter

### Decision 1: No backend, no API keys

**What:** The entire analysis pipeline runs in the browser. There is no server, no database, no authentication.

**Why:** Enterprise PMs often cannot share customer feedback data with external APIs due to NDA or GDPR constraints. Running locally means the data never leaves the device. It also means zero infrastructure cost, instant deployment to any static host, and zero downtime.

**Trade-off acknowledged:** The analysis engine uses keyword matching, not transformer-based NLP. Accuracy on mixed-sentiment text is lower than a real ML model. The architecture document describes the migration path to Claude API, which requires only replacing three functions in `analysisEngine.ts`.

---

### Decision 2: Code splitting + lazy loading

**What:** The main JS bundle is 83KB. Recharts (393KB), Framer Motion (33KB), and all 12 secondary pages are in separate chunks loaded on demand.

**Why:** Without splitting, the initial load would be ~930KB — a 9-second first paint on 3G. With splitting, the app shell renders in under 1 second. Vendor chunks are hashed and cached independently, so app updates don't force re-downloading Recharts.

**Implementation detail:** `vite.config.ts` uses a `manualChunks` function to assign modules to named chunks. Pages use `React.lazy()` + `Suspense` with skeleton fallbacks.

---

### Decision 3: CSS variable-driven design system

**What:** All semantic colors are defined as CSS custom properties in `index.css`. Dark mode is implemented by adding `.dark` to `document.documentElement`, which overrides the variable values. Components reference `var(--color-card)`, never hardcoded hex.

**Why:** Theme switching with no React re-renders. The OS preference is detected on first load, persisted in `localStorage`, and applied before first paint (no flash of wrong theme). Adding a new theme requires only a new CSS block — no component changes.

---

### Decision 4: Framer Motion for layout animation

**What:** The sidebar uses `layoutId="sidebar-indicator"` to animate the active nav item indicator across route changes. Page transitions use `AnimatePresence` keyed on `location.pathname`. The mobile sidebar uses a spring-animated width.

**Why:** CSS transitions can't track elements moving between positions in the DOM. Framer Motion's shared layout animations create the "magic move" effect where the active indicator slides smoothly between nav items — a detail that signals premium product quality to users.

---

## Screenshots Checklist

The following screens should be captured for portfolio use. Run `npm run dev` and capture at 1440×900 (desktop) and 390×844 (iPhone 14):

| Screen | Route | What to show | Desktop | Mobile |
|---|---|---|---|---|
| Landing | `/` | Dark hero, stats bar, feature grid | ☐ | ☐ |
| Dashboard — empty | `/dashboard` | Welcome header, skeleton KPIs | ☐ | ☐ |
| Dashboard — loaded | `/dashboard` | Live KPIs, charts, exec summary | ☐ | ☐ |
| Review Input | `/input` | Dataset picker + live preview lines | ☐ | ☐ |
| Review Upload | `/upload` | Drag-drop zone + file preview | ☐ | ☐ |
| Sentiment Analysis | `/sentiment` | Area chart + radar + source bar | ☐ | ☐ |
| Theme Detection | `/themes` | Word cloud + scatter + bar | ☐ | ☐ |
| Pain Points | `/pain-points` | Severity cards + impact/effort matrix | ☐ | ☐ |
| Recommendations | `/recommendations` | RICE calculator + feature cards | ☐ | ☐ |
| Roadmap — Kanban | `/roadmap` | Three-column Kanban board | ☐ | ☐ |
| Roadmap — Gantt | `/roadmap` | Horizontal bar Gantt view | ☐ | ☐ |
| All Reviews | `/reviews` | Filter bar + paginated list | ☐ | ☐ |
| Export | `/export` | Format picker + section toggles | ☐ | ☐ |
| Dark mode | any | Side-by-side light/dark comparison | ☐ | — |
| Mobile sidebar | any | Slide-out overlay on mobile | — | ☐ |
| Command palette | any | ⌘K command palette open | ☐ | — |
| Toast notification | any | Success toast after analysis | ☐ | ☐ |
| 404 page | `/nonexistent` | Gradient 404 with nav links | ☐ | ☐ |

**Capture tool recommendations:**
- Desktop: Chrome DevTools → capture screenshot at device size
- Mobile: Chrome DevTools → iPhone 14 Pro device emulation
- GIF: [LICEcap](https://www.cockos.com/licecap/) or [Kap](https://getkap.co/) for the analysis flow

**GIF sequences to record:**
1. Paste Zomato reviews → watch live preview → click Analyze → see Dashboard update
2. Dark mode toggle transition
3. Sidebar open/close animation + active nav indicator slide
4. Command palette open → type → navigate
5. Export CSV → file downloads

---

## GitHub Repository Setup

### Repository description (160 char max)
```
AI-powered customer feedback analyzer. Sentiment · Themes · Pain Points · RICE Roadmap. Built with React 19, TypeScript, Tailwind v4. Runs 100% client-side.
```

### GitHub Topics (add all)
```
react
typescript
vite
tailwind-css
product-management
sentiment-analysis
data-visualization
recharts
framer-motion
spa
pwa
dashboard
nlp
feedback-analytics
portfolio
```

### GitHub Badges for README

```markdown
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=flat&logo=vercel)](https://ai-feedback-analyzer.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055ff?style=flat&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6?style=flat)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5a0fc8?style=flat&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Bundle Size](https://img.shields.io/badge/Initial%20Bundle-83KB-22c55e?style=flat)](vite.config.ts)
[![Build](https://img.shields.io/badge/Build-Passing-22c55e?style=flat&logo=github-actions)](https://github.com/your-username/ai-feedback-analyzer/actions)
```

---

## Metrics to Highlight

| Metric | Value | Context |
|---|---|---|
| Initial JS bundle | 83 KB (21 KB gzipped) | Down from ~930 KB monolith before code splitting |
| Recharts chunk | 393 KB — loaded only when first chart page opens | Never blocks initial render |
| Pages | 14 routes | 12 lazy-loaded, 2 eager |
| Analysis speed | <50ms for 100 reviews | Synchronous keyword engine on main thread |
| Lines of code | ~5,800 across 40 TypeScript files | |
| Zero dependencies for analysis | No ML library, no API | Pure JS, ships in the main chunk |
| Dark mode | 0ms flash on load | CSS variable swap before first paint |
| PWA installable | Yes | Service worker + manifest + icons |
| Lighthouse perf | ~90+ | Lazy loading + small initial bundle |

---

## What This Demonstrates to a Hiring Team

**For a Frontend Engineer role:**
- Production Vite + React 19 + TypeScript 6 setup with code splitting and lazy loading
- Framer Motion shared layout animations (`layoutId`, `AnimatePresence`, spring physics)
- Tailwind CSS v4 with CSS-first `@theme {}` configuration
- Design system architecture with CSS custom properties for theming
- Recharts integration with custom tooltips, responsive containers, and SVG accessibility
- Custom hooks (`useAnalysis`, `useDarkMode`, `useIsMobile`, `useCounter`)
- Client-side file processing (FileReader API, Blob downloads)
- PWA implementation (service worker, manifest, offline caching)
- Accessibility-first implementation (ARIA, keyboard navigation, focus management)

**For an Associate PM role:**
- Built a real product that solves a documented PM workflow pain point
- Prioritized features using RICE framework — meta: the tool demonstrates its own methodology
- Made deliberate trade-off decisions (no backend = zero infra cost + privacy guarantee)
- Thought through the full product surface: input → analysis → insight → output → export
- Included sample datasets for five real Indian quick-commerce brands — demonstrates market research
- Wrote an architecture document and roadmap — shows systems thinking
- Identified own product limitations in the About page — demonstrates intellectual honesty
