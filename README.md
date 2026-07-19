<div align="center">

# AI Feedback Analyzer

**Turn raw customer reviews into prioritized product insights — in seconds, with zero API keys.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--feedback--roan.vercel.app-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-feedback-roan.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-99deepthinj%2Fai--feedback--analyzer-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/99deepthinj/ai-feedback-analyzer)

[![MIT License](https://img.shields.io/badge/License-MIT-8B5CF6.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg)](https://tailwindcss.com/)

</div>

---

Paste reviews (or load a branded sample dataset — Zepto, Swiggy, Zomato, Blinkit) and instantly get:
- **Sentiment breakdown** with trend charts and source attribution
- **Theme clusters** with word cloud, bubble map, and mention counts
- **Pain point rankings** with severity, affected-user %, and effort estimate
- **RICE-scored feature recommendations** and a prioritized product roadmap
- **AI-generated executive summary** with animated typewriter reveal

Everything runs **entirely client-side** — no backend, no API keys, no data leaves the browser.

---

## Screenshots

| | |
|---|---|
| ![Landing page](docs/images/landing.png) | ![Dashboard with executive summary](docs/images/dashboard.png) |
| Dark-themed landing with hero, stats, and feature grid | KPI cards, sentiment trend, NPS gauge, AI executive summary |
| ![Sentiment analysis](docs/images/sentiment.png) | ![Theme detection](docs/images/themes.png) |
| Area chart, radar chart, source breakdown, rating distribution | Bar chart, word cloud, bubble scatter, theme detail cards |
| ![Pain points](docs/images/pain-points.png) | ![Product roadmap](docs/images/roadmap.png) |
| Severity-ranked cards with affected user % and effort estimate | Kanban, Timeline, and Gantt views with status tracking |
| ![Light theme](docs/images/light-theme.png) | ![Dark theme](docs/images/dark-theme.png) |
| Light mode — clean, high-contrast, print-friendly | Dark mode — sidebar, charts, full design system |

> **[Try it live →](https://ai-feedback-roan.vercel.app)** or run locally with `npm run dev`.

---

## Features

| Category | Feature |
|----------|---------|
| **Input** | Paste free-text reviews or load one-click sample datasets (Generic, Zepto ⚡, Swiggy 🛵, Zomato 🍽️, Blinkit 🟡) |
| **Analysis** | Sentiment classification (positive / negative / neutral) per review |
| **Analysis** | Theme detection — keyword clustering with mention counts and trend direction |
| **Analysis** | Pain point identification — severity, affected user %, effort estimate |
| **Analysis** | Feature recommendations with RICE scoring (Reach × Impact × Confidence ÷ Effort) |
| **Synthesis** | AI executive summary — deterministic NLP with animated reveal and copy button |
| **Planning** | Product roadmap in Kanban, Timeline, and Gantt views |
| **Data** | Searchable, filterable, sortable review table (full-text, sentiment, source, stars, date) |
| **Export** | PDF via `window.print()`, real CSV and JSON via Blob download |
| **UX** | Dark mode persisted in `localStorage`, respects `prefers-color-scheme` |
| **UX** | Loading skeletons on all analysis pages, toast notifications on actions |
| **UX** | Command palette (⌘K), keyboard shortcuts, mobile-responsive sidebar |
| **A11y** | ARIA labels, keyboard navigation, `role="progressbar"`, `aria-live` regions |
| **PWA** | Service worker, `manifest.json`, installable on desktop and mobile |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                            │
│                                                                 │
│  ┌──────────────┐   paste/upload    ┌─────────────────────────┐ │
│  │  Review      │ ──────────────►  │   analysisEngine.ts     │ │
│  │  Input /     │                  │                         │ │
│  │  Upload      │  ◄─────────────  │  classifySentiment()    │ │
│  └──────────────┘   Review[]       │  detectThemes()         │ │
│                                    │  identifyPainPoints()   │ │
│  ┌──────────────────────────────┐  │  generateFeatures()     │ │
│  │         useAnalysis()        │  │  buildRiceMatrix()      │ │
│  │   (module-singleton state)   │  └─────────────────────────┘ │
│  │                              │                               │
│  │  reviews[]  themes[]         │  ┌─────────────────────────┐ │
│  │  painPoints[] features[]     │  │  executiveSummary.ts    │ │
│  └──────────────────────────────┘  │  generateSummary()      │ │
│           │                        └─────────────────────────┘ │
│           ▼                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Pages (React Router v7)                 │   │
│  │                                                          │   │
│  │  /dashboard  /sentiment  /themes  /pain-points           │   │
│  │  /recommendations  /roadmap  /reviews  /export           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Recharts SVG  │  │ ToastContext │  │  useDarkMode()       │  │
│  │ chartColors.ts│  │ (useReducer) │  │  (localStorage)      │  │
│  └───────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Module-singleton state** (`let _state` in `useAnalysis.ts`) | Survives route navigation without Redux or Zustand — one file, zero boilerplate |
| **Hardcoded hex colors** in `chartColors.ts` | SVG `fill` attributes cannot resolve CSS custom properties; Recharts renders to SVG |
| **`window.print()` for PDF** | Zero new dependencies; browser renders charts natively at full fidelity; sidebar hidden via `@media print` |
| **Custom toast system** | 60-line `useContext`+`useReducer` implementation — no `sonner` or `react-hot-toast` bundle cost |
| **Tailwind v4 `@theme {}`** | Plugin-based — no `tailwind.config.ts`; design tokens live directly in `index.css` |
| **`isAnimationActive={false}`** on Recharts | Prevents incomplete animations in headless rendering and avoids layout thrash on navigation |
| **Deterministic executive summary** | Template-based NLP — same reviews always produce the same summary; no randomness, no API call |
| **Code splitting** | `React.lazy()` on 12 secondary pages; Recharts, Framer Motion, Radix in separate chunks; initial load ~84KB |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 5 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@theme {}` plugin-based) |
| Routing | React Router v7 |
| Animation | Framer Motion 12 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| UI primitives | Radix UI (Select, Dialog, Accordion, Tabs, etc.) |
| State | Module singleton (`useAnalysis.ts`) + React Context (toast, dark mode) |
| Exports | `window.print()` (PDF), `Blob`+`URL.createObjectURL` (CSV / JSON) |
| NLP | Client-side keyword engine (`analysisEngine.ts`) |
| PWA | Vite PWA plugin, `manifest.json`, service worker |

---

## Installation

```bash
# Clone
git clone https://github.com/99deepthinj/ai-feedback-analyzer.git
cd ai-feedback-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Type check
npx tsc --noEmit

# Production build
npm run build
npm run preview   # preview production build locally
```

No environment variables are required. See [`.env.example`](.env.example) for future API integration placeholders.

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) — Vite is auto-detected, no config needed.

### Netlify

```bash
npm run build
netlify deploy --prod --dir dist
```

Add `public/_redirects` for SPA routing:
```
/*    /index.html    200
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t ai-feedback-analyzer .
docker run -p 8080:80 ai-feedback-analyzer
```

---

## Future Backend Architecture

The current engine uses client-side keyword matching. Replacing it with Claude or OpenAI requires changing only the functions in `analysisEngine.ts`.

### Sentiment Classification → Claude API

```typescript
// Current: keyword matching in classifySentiment()
// Future:
async function classifySentiment(text: string): Promise<Sentiment> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content: `Classify as exactly one word: positive, negative, or neutral.\n\n"${text}"`
    }]
  })
  return response.content[0].text.trim().toLowerCase() as Sentiment
}
// Cost: ~55 tokens/review ≈ $0.0001/review at Sonnet pricing
```

### Theme Detection → Structured Output

```typescript
async function detectThemes(reviews: string[]): Promise<Theme[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Extract the top 8 recurring themes from these ${reviews.length} reviews.
Return JSON: [{ "name": string, "count": number, "sentiment": "positive"|"negative"|"neutral" }]

Reviews:
${reviews.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
    }]
  })
  return JSON.parse(response.content[0].text)
}
```

### Executive Summary → Streaming

```typescript
async function* streamExecutiveSummary(reviews: Review[]): AsyncGenerator<string> {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-5',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Write a 3-sentence executive summary. Data-driven, PM audience, no filler.
Total: ${reviews.length} reviews | Positive: ${reviews.filter(r => r.sentiment === 'positive').length}
Top themes: ${reviews.flatMap(r => r.themes).slice(0, 5).join(', ')}`
    }]
  })
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') yield chunk.delta.text
  }
}
```

**Estimated costs (Claude Sonnet):**

| Operation | Cost per 100 reviews |
|-----------|---------------------|
| Sentiment classification | ~$0.01 |
| Theme detection (batched) | ~$0.01 |
| Executive summary | ~$0.005 |
| **Total** | **~$0.025 / 100 reviews** |

**Recommended production architecture:**
```
Frontend (this repo) → API Server (Node / FastAPI) → Claude API
                                   ↓
                         PostgreSQL + Redis cache
```

---

## Roadmap

- [ ] Real AI backend (Claude API) via environment variable toggle
- [ ] PostgreSQL storage for review history across sessions
- [ ] Multi-project workspace (separate analysis runs per product)
- [ ] Slack / Jira integration to push pain points as tickets
- [ ] CSV / spreadsheet bulk import with column mapping UI
- [ ] Scheduled weekly digest email reports
- [ ] Shareable read-only report URLs
- [ ] Competitor comparison view (side-by-side datasets)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for dev setup, commit conventions, and PR guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

[MIT](LICENSE) © 2024 AI Feedback Analyzer
