# LinkedIn Assets — AI Feedback Analyzer

---

## Project Entry (LinkedIn "Projects" section)

**Name:** AI Feedback Analyzer

**Description (2,000 char limit — paste this):**

Built a production-quality web application that transforms raw customer reviews into prioritized product insights — running entirely in the browser with no backend or API keys required.

**What it does:**
Paste reviews or upload a CSV from G2, App Store, Trustpilot, or Capterra, and get instant sentiment classification, theme clustering, pain point severity ranking, RICE-scored feature recommendations, and a three-view product roadmap (Kanban, Timeline, Gantt).

**Key technical highlights:**
→ React 19 + TypeScript 6 + Vite 8 — initial bundle reduced from ~930KB to 83KB via manual code splitting and React.lazy() across 12 routes
→ Framer Motion shared layout animations (layoutId, AnimatePresence) for sidebar transitions and page animations
→ Tailwind CSS v4 with CSS-first design system — instantaneous dark mode with zero layout flash
→ 8 Recharts chart types across 6 analysis pages (area, radar, scatter, bar, pie, word cloud, gantt, kanban)
→ PWA-ready: service worker, Web App Manifest, offline caching, installable on mobile
→ 3 real export formats: PDF via window.print(), CSV and JSON via Blob download
→ Full keyboard navigation with ⌘K command palette and keyboard shortcuts modal
→ WCAG AA-compliant ARIA implementation throughout

**Why I built it:**
I saw product managers spending hours manually synthesizing 200+ customer reviews into a product backlog — a problem that should take minutes with the right tool. Existing solutions cost $30k+/year or require sharing sensitive customer data with external services. This runs 100% locally.

**Architecture document, technical write-up, and live demo available in the repository.**

**URL:** https://ai-feedback-analyzer.vercel.app
**GitHub:** https://github.com/your-username/ai-feedback-analyzer

---

## LinkedIn Post — Project Launch (copy-paste ready)

---

I just shipped a project I've been working on: AI Feedback Analyzer.

The problem: PMs collect hundreds of customer reviews from G2, App Store, Trustpilot, Capterra. Synthesizing them is manual, inconsistent, and takes hours.

The solution: paste your reviews (or load one of 5 sample datasets), and get in seconds:
→ Sentiment breakdown with trend charts
→ Theme clusters with frequency analysis
→ Pain points ranked by severity and affected user %
→ RICE-scored feature recommendations
→ Product roadmap in Kanban, Timeline, and Gantt views
→ Executive summary you can copy directly into a stakeholder doc

The entire thing runs in your browser. No account. No API key. No data leaves your device.

**Technical highlights worth sharing:**

The biggest engineering challenge was getting the initial bundle to 83KB when Recharts alone is 393KB. Solution: Vite manualChunks + React.lazy() — the chart library loads only when you first navigate to an analysis page, and stays cached after that. First paint is fast. Subsequent pages feel instant.

I also implemented Framer Motion's `layoutId` for the sidebar navigation — the active indicator "slides" between nav items as you navigate, rather than jumping. It's a 4-line change that makes the app feel 10x more polished.

Dark mode is built on CSS custom properties rather than React state — toggling the theme adds a single `.dark` class to the document root, which overrides all color variables at once. Zero re-renders. Zero flash.

**What I learned:**
- Code splitting is not optional — it's the difference between a 1-second and a 9-second load
- CSS custom properties are the right primitive for theming, not JavaScript
- Framer Motion's shared layout animations are genuinely magical and worth the bundle cost for a data-heavy dashboard
- "No backend" is a feature, not a limitation, if you design around it correctly

Live demo: [link]
GitHub (including 1,000-line architecture document): [link]

What PM tool problem would you build next? 👇

#React #TypeScript #FrontendEngineering #ProductManagement #WebDevelopment #OpenSource

---

## LinkedIn Post — Technical Deep-Dive (alternate version)

---

Something I don't see talked about enough: the performance cost of data visualization libraries.

Recharts — the most popular React charting library — is 393KB uncompressed. If you bundle it naively, every user downloads it on first load, even if they never open a chart page.

Here's how I solved it in my recent project:

**The problem:**
My app (AI Feedback Analyzer) has 8 chart types across 6 pages. Recharts + D3 dependencies = 393KB. React Router + React DOM = 216KB. Framer Motion = 33KB. Total: a ~930KB bundle.

**The solution — Vite manualChunks:**
```javascript
manualChunks(id) {
  if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts'
  if (id.includes('framer-motion')) return 'vendor-motion'
  if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react'
  if (id.includes('node_modules')) return 'vendor'
}
```

**Combined with React.lazy():**
```javascript
const SentimentAnalysis = lazy(() => import('@/pages/SentimentAnalysis'))
// 12 pages → 12 separate chunks, loaded on demand
```

**Result:**
- Initial load: 83KB (21KB gzipped) ✅
- Recharts: loaded only when user first opens a chart page ✅
- After first load: chunk is cached — subsequent chart pages feel instant ✅
- App code and vendor code in separate chunks — app updates don't bust the Recharts cache ✅

The trick most people miss: vendor chunks need to be in separate files from your app code. When you push a new version, your app chunk hash changes but the vendor chunk hash stays the same — users who visited before re-download only your app code, not Recharts again.

Full project: github.com/your-username/ai-feedback-analyzer

#WebPerformance #React #Vite #FrontendEngineering #JavaScript

---

## LinkedIn Summary Section Addition

If adding to your LinkedIn About section:

> I build production-quality frontend applications with a focus on performance, accessibility, and design system architecture. Recent project: AI Feedback Analyzer — a React 19 + TypeScript SPA that classifies customer review sentiment, clusters themes, and generates RICE-prioritized product roadmaps client-side, with an 83KB initial bundle, full dark mode, PWA support, and zero backend infrastructure. Architecture document and live demo at [url].

---

## Comment Templates (for engaging with relevant posts)

**On a post about PM tools:**
> Coincidentally I just built something for this exact problem — raw reviews → structured product backlog in under 60 seconds, runs in the browser. Would love your feedback on whether the output format is useful for actual planning sessions: [url]

**On a post about React performance:**
> Great point on bundle size. In a recent project I got Recharts (393KB) completely out of the initial bundle using Vite manualChunks + React.lazy() — happy to share the config if useful.

**On a post about dark mode implementation:**
> CSS custom properties on the root element are really the right primitive here — I wrote about my approach in a recent project's architecture doc, switching the entire theme with a single classList.add('dark') and zero React re-renders.

---

## Skills to Add/Highlight on LinkedIn

Add these skills and confirm them from your project:

**Frontend:**
React.js · TypeScript · JavaScript · Vite · Tailwind CSS · Framer Motion · Recharts · HTML5 · CSS3

**Architecture:**
Single Page Applications · Code Splitting · Lazy Loading · Progressive Web Apps · REST APIs

**Tooling:**
Git · GitHub · Vercel · npm · ESLint · VS Code

**Product:**
Product Management · RICE Prioritization · User Research · Data Visualization · NLP

**Soft skills to demonstrate in recommendations:**
Systems thinking · Attention to detail · Product ownership · Documentation · Self-directed learning
