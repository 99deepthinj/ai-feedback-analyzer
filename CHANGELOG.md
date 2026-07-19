# Changelog

All notable changes to AI Feedback Analyzer are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versions follow [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2024-12-15

### Added
- **Executive Summary card** on Dashboard: deterministic NLP-generated paragraph summarizing sentiment, top themes, and critical pain points. Animated reveal with copy-to-clipboard.
- **All Reviews page** (`/reviews`): full-text search, multi-filter (sentiment, source, star rating, date range), sortable columns, 25-per-page pagination, filtered CSV export.
- **Sample datasets**: five one-click loadable corpora — Generic SaaS, Zepto, Swiggy, Zomato, Blinkit — each with 15–20 carefully crafted reviews targeting real keyword patterns.
- **Toast notification system**: custom `useContext`+`useReducer` implementation (no external library). Auto-dismisses after 4 seconds. Three variants: default, success, error.
- **Loading skeletons** on all seven analysis pages: 600ms simulated mount delay with shimmer animation.
- **Real CSV export**: `Blob` download with header row, escaped quotes, all review fields.
- **Real JSON export**: complete analysis snapshot (reviews, themes, pain points, metadata).
- **PDF export**: `window.print()` + `@media print` CSS — zero new dependencies, pixel-perfect chart rendering.
- **Dataset picker UI** on Review Input page: emoji-labeled brand buttons that load reviews into the textarea and show a toast.
- **Landing page** (`/`): dark-themed marketing page with hero, stats, feature grid, how-it-works, testimonials, and CTA.
- **About page** (`/about`): tech stack, architecture decisions, known limitations.
- **Help page** (`/help`): accordion-style user guide with page-by-page instructions and FAQ.
- **Dark mode persistence**: `localStorage` with `prefers-color-scheme` fallback; SSR-safe initializer.
- **Accessibility pass**: ARIA labels on all icon-only buttons, `role="progressbar"` with value attributes, `role="button"` + `tabIndex` + keyboard handlers on drop zones, `aria-pressed` on toggle buttons, `aria-live="polite"` on toast region.
- **SEO metadata**: Open Graph, Twitter Card, `theme-color`, `apple-touch-icon` in `index.html`.
- **App logo** (`public/app-logo.svg`): purple gradient circle with "AF" monogram and circuit-board accents.
- **MIT License**, **CONTRIBUTING.md**, **CHANGELOG.md**, **`.env.example`**.

### Changed
- Dashboard now uses live `useAnalysis()` data instead of static mock stats.
- Sidebar footer shows live review count from `useAnalysis()`.
- Sidebar navigation reordered: "All Reviews" added between Upload and Sentiment.
- `window.print()` replaces the placeholder PDF export button.
- Review Input: sample dataset selector replaces single hardcoded sample button.

### Fixed
- Division by zero in `SentimentAnalysis` and `analysisEngine.ts` when no reviews loaded (`|| 1` guard).
- `Math.random()` called on every render in `ThemeDetection` bubble chart — replaced with deterministic name-hash formula in `useMemo`.
- Array mutation in `SentimentAnalysis`: `sentimentBySource.sort()` now uses spread clone.
- Tooltip lookup collision in `ThemeDetection` when two themes share the same mention count.
- Non-null assertion `file!` in `ReviewUpload` — replaced with early-return guard.
- `localStorage` access in `useDarkMode` during SSR — `typeof window === 'undefined'` guard added.
- `Github` icon not exported from `lucide-react` in `About.tsx` — changed to `ExternalLink`.
- `React.ElementType` used without React import — changed to `import type { ElementType } from 'react'`.

---

## [0.5.0] — 2024-12-01

### Added
- **Pain Points page**: ranked list with severity scores, affected user counts, and effort estimates.
- **Recommendations page**: AI-generated feature recommendations with priority scoring.
- **RICE Prioritization**: reach × impact × confidence ÷ effort scoring for all recommendations.
- **Product Roadmap page**: Kanban, Timeline, and Gantt views with status badges.
- **Export page**: multi-format selector UI with section toggles.

### Changed
- Recharts animations disabled globally (`isAnimationActive={false}`) for consistent rendering.
- All chart colors moved to `src/lib/chartColors.ts` as hardcoded hex values (SVG cannot resolve CSS custom properties).

---

## [0.4.0] — 2024-11-15

### Added
- **Theme Detection page**: bar chart, word cloud, bubble scatter map, theme detail cards with sample quotes.
- **Sentiment Analysis page**: area chart, radar chart, source breakdown, rating distribution, full classified review list.
- **Module-singleton state** in `useAnalysis.ts`: analysis results persist across navigation without Redux.

---

## [0.3.0] — 2024-11-01

### Added
- **Review Upload page**: drag-and-drop file upload with progress simulation, source picker, platform badges.
- **Review Input page**: paste-in text area with live sentiment/theme preview, line detection.
- **Analysis engine** (`analysisEngine.ts`): keyword-based sentiment classification, theme detection, pain point identification, feature recommendation generation.

---

## [0.2.0] — 2024-10-15

### Added
- **App layout** with collapsible sidebar, sticky header, dark mode toggle.
- **Dashboard page**: KPI cards, sentiment trend area chart, theme distribution bar, NPS gauge, top pain points table.
- **React Router v7** routing with nested `AppLayout` wrapper.
- **Tailwind CSS v4** with `@theme {}` design tokens and `.dark {}` overrides.

---

## [0.1.0] — 2024-10-01

### Added
- Initial project scaffold with Vite 8, React 19, TypeScript 5, Tailwind CSS v4.
- Component library: `Card`, `Button`, `Badge`, `Progress`, `Textarea`, `Select`.
- Dark mode foundation with CSS custom properties.
