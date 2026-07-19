# Contributing to AI Feedback Analyzer

Thank you for considering a contribution! This document explains how to get started.

## Development Setup

```bash
git clone https://github.com/your-username/ai-feedback-analyzer.git
cd ai-feedback-analyzer
npm install
npm run dev        # starts Vite dev server at http://localhost:5173
```

**Requirements:** Node 18+, npm 9+.

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppLayout, Sidebar, Header
│   └── ui/           # Card, Button, Badge, Skeleton, Toast, etc.
├── data/
│   ├── mockData.ts   # Static chart data (trend lines, distributions)
│   └── sampleDatasets.ts  # Brand-specific review corpora
├── hooks/
│   ├── useAnalysis.ts     # Module-singleton state for analyzed data
│   ├── useDarkMode.ts     # localStorage-persisted dark mode
│   └── useToast.ts        # Context-based toast trigger
├── lib/
│   ├── analysisEngine.ts  # Keyword NLP: sentiment, themes, pain points
│   ├── chartColors.ts     # Hardcoded hex colors for Recharts SVG
│   ├── executiveSummary.ts # Deterministic summary generator
│   └── utils.ts           # cn() helper
├── pages/            # One file per route
└── types/index.ts    # Shared TypeScript interfaces
```

## Making Changes

1. **Fork** the repo and create a branch: `git checkout -b feat/your-feature`
2. Make your changes. Keep PRs focused — one feature or fix per PR.
3. Run `npm run build` and confirm zero TypeScript errors before submitting.
4. Open a PR with a clear title and description.

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `docs:` | Documentation only |
| `chore:` | Build, tooling, or dependency updates |
| `style:` | Formatting, whitespace (no logic change) |

Examples:
```
feat: add Flipkart sample dataset
fix: prevent division by zero in SentimentAnalysis when no reviews loaded
docs: update README deployment section with Railway instructions
```

## Code Style

- **TypeScript strict** — no `any`, no non-null assertions (`!`)
- **No comments unless the WHY is non-obvious** — self-documenting names preferred
- **No external state management** — module singleton in `useAnalysis.ts`
- **Chart colors** — always use `CHART.*` from `chartColors.ts`, never CSS vars inside SVG
- **Tailwind + inline styles** — Tailwind for layout/spacing, inline `style={}` for dynamic colors

## Adding a New Page

1. Create `src/pages/YourPage.tsx`
2. Add the route in `src/App.tsx`
3. Add the nav item in `src/components/layout/Sidebar.tsx`
4. Add the page title in `src/components/layout/AppLayout.tsx` (`pageTitles`)
5. Add loading skeleton (600ms `useEffect` pattern)

## Adding a Sample Dataset

In `src/data/sampleDatasets.ts`, add a new entry to `SAMPLE_DATASETS`:

```ts
yourapp: {
  label: 'Your App',
  emoji: '🚀',
  description: 'Short description shown on hover',
  reviews: [
    'The onboarding is confusing and takes too long to complete.',
    'Love the new dashboard — charts are beautiful and fast!',
    // aim for 15–20 reviews that hit the analysisEngine keyword patterns
  ],
}
```

Then add a button for it in `src/pages/ReviewInput.tsx` (the dataset picker card renders all entries automatically via `Object.entries(SAMPLE_DATASETS)`).

## Reporting Issues

Please open a GitHub Issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser and OS version

## License

By contributing, you agree your contributions will be licensed under the [MIT License](LICENSE).
