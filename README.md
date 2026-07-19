# AI Feedback Analyzer

[![MIT License](https://img.shields.io/badge/license-MIT-8b5cf6.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4.svg)](https://tailwindcss.com/)

**Turn raw customer reviews into prioritized product insights in seconds.**

Paste reviews (or load a branded sample dataset) and get AI-generated sentiment breakdown, theme clusters, pain point rankings, RICE-scored feature recommendations, and an executive summary — all running client-side with zero API keys required.

---

## Screenshots

| Screen | Description |
|--------|-------------|
| ![Landing](docs/screenshots/landing.png) | Dark-themed landing page with hero, stats, and feature grid |
| ![Dashboard](docs/screenshots/dashboard.png) | KPI cards, sentiment trend, NPS gauge, AI executive summary |
| ![Review Input](docs/screenshots/review-input.png) | Brand dataset picker (Zepto, Swiggy, Zomato, Blinkit), paste + live preview |
| ![Sentiment Analysis](docs/screenshots/sentiment.png) | Area chart, radar chart, source breakdown, rating distribution |
| ![Theme Detection](docs/screenshots/themes.png) | Bar chart, word cloud, bubble scatter map, theme detail cards |
| ![All Reviews](docs/screenshots/reviews.png) | Searchable, filterable, sortable paginated table with CSV export |
| ![Pain Points](docs/screenshots/pain-points.png) | Severity-ranked cards with affected user counts and effort estimates |
| ![Product Roadmap](docs/screenshots/roadmap.png) | Kanban, Timeline, and Gantt views with status tracking |
| ![Export](docs/screenshots/export.png) | PDF (print dialog), real CSV/JSON downloads, section toggles |

> _Run `npm run dev` and visit `http://localhost:5173` to see the live app._

---

## Features

- **One-click sample datasets** — Generic SaaS, Zepto ⚡, Swiggy 🛵, Zomato 🍽️, Blinkit 🟡
- **AI-generated executive summary** — deterministic NLP paragraph with animated reveal and copy-to-clipboard
- **Sentiment classification** — positive / negative / neutral per review with trend charts
- **Theme detection** — keyword clustering with mention counts, trend direction, word cloud
- **Pain point analysis** — severity (critical/high/medium/low), affected user %, effort estimate
- **Feature recommendations** — AI-generated with RICE scoring (reach × impact × confidence ÷ effort)
- **Product roadmap** — Kanban, Timeline, and Gantt views with status badges
- **Searchable review table** — full-text search, multi-filter (sentiment, source, stars, date range), pagination
- **Real exports** — PDF via `window.print()`, CSV and JSON via Blob download
- **Dark mode** — persisted in `localStorage`, respects `prefers-color-scheme`
- **Loading skeletons** — shimmer animation on all analysis pages
- **Toast notifications** — zero-dependency custom context+reducer implementation
- **Full accessibility** — ARIA labels, keyboard nav, `role="progressbar"`, `aria-live` regions
- **Mobile responsive** — sidebar collapses, grids reflow at all breakpoints

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
│  │                      Pages (React Router v7)             │   │
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
| **Module-singleton state** (`let _state` in `useAnalysis.ts`) | Survives route navigation without Redux/Zustand. One file, zero boilerplate. |
| **Hardcoded hex colors** in `chartColors.ts` | SVG `fill` attributes cannot resolve CSS custom properties — Recharts renders to SVG. |
| **`window.print()` for PDF** | Zero new dependencies. Browser renders charts natively at full fidelity. Sidebar/header hidden via `@media print`. |
| **Custom toast system** | 60-line `useContext`+`useReducer` implementation. No `sonner` or `react-hot-toast` bundle cost. |
| **Tailwind v4 `@theme {}`** | Plugin-based — no `tailwind.config.ts`. Design tokens live in `index.css`. |
| **`isAnimationActive={false}`** on all Recharts elements | Prevents incomplete animations in headless rendering and avoids layout thrash on navigation. |
| **Deterministic executive summary** | Template-based NLP. Same reviews always produce the same summary — no randomness, no API call. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (plugin-based, `@theme {}`) |
| Routing | React Router v7 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| State | Module singleton (`useAnalysis.ts`) + React Context (toast, dark mode) |
| Exports | `window.print()` (PDF), `Blob`+`URL.createObjectURL` (CSV/JSON) |
| NLP | Client-side keyword engine (`analysisEngine.ts`) |

---

## Installation

```bash
# Clone
git clone https://github.com/your-username/ai-feedback-analyzer.git
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
npm run preview  # preview production build locally
```

No environment variables are required. See [`.env.example`](.env.example) for future API integration placeholders.

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) — Vite is auto-detected.

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

The current client-side engine uses keyword matching. Replacing it with Claude or OpenAI APIs requires minimal changes — only `analysisEngine.ts` functions need API-backed implementations.

### Sentiment Classification → Claude

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

### Recommended Production Architecture

```
Frontend (this repo) → API Server (Node/FastAPI) → Claude API
                                    ↓
                          PostgreSQL + Redis cache
```

---

## Roadmap

- [ ] Real AI backend (Claude API) via environment variable toggle
- [ ] PostgreSQL storage for review history across sessions
- [ ] Multi-project workspace (separate analysis runs per product)
- [ ] Slack / Jira integration to push pain points as tickets
- [ ] CSV/spreadsheet bulk import with column mapping UI
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
