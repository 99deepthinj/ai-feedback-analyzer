# Resume Bullets — AI Feedback Analyzer

Use these in your resume under **Projects** or **Experience**. Three tiers provided: concise (1 line), standard (2–3 lines), and detailed (full PAR format). Pick the tier that fits your resume length.

---

## Project Header Block

```
AI Feedback Analyzer                                   github.com/your-username/ai-feedback-analyzer
Solo Project · React 19 · TypeScript · Tailwind v4 · Vite · Recharts · Framer Motion   Live: aifa.vercel.app
```

---

## Tier 1 — Concise (1 line each, use 3–4)

- Built a client-side SPA that classifies sentiment, clusters themes, and generates RICE-prioritized product roadmaps from raw customer reviews using a custom NLP engine in TypeScript.
- Reduced initial JS bundle from ~930KB to 83KB via Vite code splitting and React lazy loading across 12 routes.
- Implemented a CSS variable-driven dark mode system with zero flash on load, respecting `prefers-color-scheme` and persisting preference in localStorage.
- Shipped a PWA with service worker offline caching, Web App Manifest, and install prompts — deployable to any static file host with no backend infrastructure.
- Integrated Recharts with 8 chart types (Area, Radar, Scatter, Bar, Pie, Word Cloud, Gantt, Kanban) across 6 analysis pages with full dark mode compatibility.

---

## Tier 2 — Standard (2–3 lines, use 2–3 bullets)

**Architecture & Performance**
- Architected a zero-backend SPA where 100% of data processing runs client-side, eliminating infrastructure cost and ensuring user data never leaves the browser — a key selling point for enterprise PMs with GDPR constraints.
- Achieved an 83KB initial bundle (down from ~930KB) by implementing Vite `manualChunks` vendor splitting (react-dom, recharts, framer-motion into separate cached chunks) and `React.lazy()` for all 12 secondary routes.

**UI Engineering**
- Built a production-quality design system using Tailwind CSS v4's `@theme {}` CSS-first configuration with semantic CSS custom properties, enabling instantaneous dark/light mode switching with no React re-renders and no flash of unstyled content.
- Implemented Framer Motion shared layout animations (`layoutId`, `AnimatePresence`, spring physics) for sidebar active-indicator transitions, page enter/exit animations, and mobile backdrop — with a single `useIsMobile` hook driving responsive sidebar behavior via `matchMedia`.

**Product & Feature Thinking**
- Designed and built the full product surface end-to-end: two data input flows (paste + CSV drag-drop), five analysis views, three export formats (PDF via `window.print()`, CSV and JSON via Blob download), and a command palette (⌘K) with keyboard shortcut navigation.
- Selected five real Indian quick-commerce brands (Zepto, Swiggy, Zomato, Blinkit) as sample datasets, demonstrating product market research and enabling any user to demo the full analysis flow in under 10 seconds without their own data.

---

## Tier 3 — PAR Format (Problem → Action → Result, for senior roles)

**Problem:** Product managers at startups have no fast, free, privacy-respecting tool to transform 200–500 raw customer reviews into a structured product backlog. Existing solutions cost $30k+/year or require sharing data with external APIs.

**Action:** Built a fully client-side React SPA with a custom TypeScript NLP engine (sentiment classification, theme detection, pain point ranking, RICE scoring). Implemented Vite code splitting to reduce initial load to 83KB. Built 8 Recharts chart types across 6 analysis pages, a CSS variable design system with full dark mode, PWA offline support, three real export formats, and a keyboard-driven command palette.

**Result:** A deployable-to-Vercel portfolio project demonstrating full-stack frontend engineering: React 19, TypeScript 6, Tailwind v4, Framer Motion, Recharts, React Router v7, FileReader API, Blob downloads, Service Workers, and Web App Manifest — with zero backend infrastructure and zero recurring cost.

---

## Skills Keywords Demonstrated (for ATS)

Include these in your resume skills section if they apply:

```
React · React 19 · TypeScript · JavaScript (ES2023) · Vite · Tailwind CSS · CSS Custom Properties
Framer Motion · Recharts · React Router · Radix UI · Lucide React · clsx · tailwind-merge
SPA Architecture · Code Splitting · Lazy Loading · Bundle Optimization · Tree Shaking
PWA · Service Workers · Web App Manifest · Offline Support
FileReader API · Blob API · URL.createObjectURL · window.print()
CSS Variables · Dark Mode · Responsive Design · Mobile-first · Media Queries
Custom Hooks · useReducer · useContext · useMemo · useCallback · useRef
Accessibility · ARIA · WCAG · Keyboard Navigation · Focus Management
Git · GitHub · Vercel · Netlify · Static Site Deployment
Product Thinking · RICE Prioritization · User Story Mapping · NLP · Sentiment Analysis
```

---

## Role-specific Framing

### Framing for Frontend Engineer roles

Lead with the technical depth:

> "Built AI Feedback Analyzer — a React 19 + TypeScript SPA with a custom client-side NLP pipeline, Vite code splitting (83KB initial bundle from 930KB), Framer Motion shared layout animations, CSS variable design system with zero-flash dark mode, and PWA service worker. 14 routes, 8 chart types, 3 export formats, 0 backend."

### Framing for Full-Stack roles

Lead with the system design:

> "Designed and built the full product stack: custom TypeScript NLP engine, React component architecture, Recharts visualization layer, CSS design system, and static deployment pipeline. Documented a future backend architecture (Node API, PostgreSQL schema, Auth flow, Claude API integration) to demonstrate production migration readiness."

### Framing for Associate PM roles

Lead with the product thinking:

> "Identified and addressed a real PM workflow gap: synthesizing 200+ customer reviews into a product roadmap manually takes hours. Built a tool that does it in 60 seconds. Made deliberate prioritization decisions: no backend (privacy + zero cost), five real-brand sample datasets (immediate value with no setup), and RICE scoring built into the output (matches how PMs actually prioritize). Documented known limitations and the roadmap to production."

### Framing for UI/UX Engineer roles

Lead with the design system:

> "Built a production design system from scratch: Tailwind v4 `@theme {}` CSS-first tokens, semantic CSS custom properties for light/dark theming, Framer Motion shared layout animations for polish, custom skeleton/empty state components, WCAG AA-compliant ARIA implementation, and a responsive layout with a collapsing sidebar powered by `matchMedia`. Zero third-party component libraries beyond Radix UI primitives."

---

## Cover Letter Paragraph (adapt as needed)

> One of my recent projects I'm most proud of is the AI Feedback Analyzer — a production-quality SPA I built solo that takes raw customer reviews and turns them into structured product intelligence. I built it because I saw PMs copying reviews into spreadsheets and spending hours on synthesis that should take minutes. The technical choices I made reflect how I'd approach a real product: no backend because customer data is sensitive and infra has real cost; code splitting because a 930KB bundle on 3G is a broken experience; a proper design system because dark mode is not a checkbox feature. I wrote a 1,000-line architecture document including a future database schema, auth flow, and Claude API integration path — not because this project needs it today, but because I think in systems. You can see the live product at [url], and the full codebase and architecture at [github].
