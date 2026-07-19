# System Architecture Document
## AI Feedback Analyzer

**Version:** 1.0.0  
**Stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · Framer Motion 12 · Recharts 3 · React Router 7

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Component Diagram](#2-component-diagram)
3. [Folder Hierarchy](#3-folder-hierarchy)
4. [Data Flow Diagram](#4-data-flow-diagram)
5. [React Rendering Flow](#5-react-rendering-flow)
6. [Routing Flow](#6-routing-flow)
7. [Theme System](#7-theme-system)
8. [Analysis Engine Flow](#8-analysis-engine-flow)
9. [Export Flow](#9-export-flow)
10. [State Management](#10-state-management)
11. [Future Backend Architecture](#11-future-backend-architecture)
12. [Future Database Schema](#12-future-database-schema)
13. [Future Authentication](#13-future-authentication)
14. [Future API Layer](#14-future-api-layer)

---

## 1. High-Level Architecture

The application is a **fully client-side Single-Page Application**. No backend server exists. All data processing, state management, and rendering happen in the user's browser. Deployment is a static file host.

```mermaid
graph TB
    subgraph Client["Browser (User's Device)"]
        subgraph App["React SPA"]
            Router["React Router v7<br/>Client-side routing"]
            State["Module Singleton<br/>useAnalysis hook"]
            Engine["Analysis Engine<br/>Pure JS — no ML"]
            UI["Component Tree<br/>Pages + Layout + UI"]
            Charts["Recharts<br/>SVG data visualization"]
            Animations["Framer Motion<br/>Layout & transitions"]
        end
        SW["Service Worker<br/>Cache-first strategy"]
        Storage["localStorage<br/>Theme preference only"]
    end

    subgraph Static["Static File Host (Vercel / Netlify)"]
        HTML["index.html"]
        JS["JS Chunks<br/>vendor-react · vendor-charts<br/>vendor-motion · lazy pages"]
        CSS["index.css<br/>Tailwind v4 output"]
        Assets["public/<br/>manifest.json · sw.js<br/>sitemap.xml · SVG icons"]
    end

    subgraph External["External (Build Time Only)"]
        Fonts["Google Fonts CDN<br/>Inter typeface"]
    end

    Browser["User's Browser"] --> Static
    Static --> App
    App --> SW
    App --> Storage
    Fonts -.->|"preconnect / stylesheet"| Browser
```

### Key architectural decisions

| Decision | Choice | Rationale |
|---|---|---|
| Rendering strategy | CSR (client-side only) | No backend needed; data stays local to the browser |
| Bundler | Vite 8 (Rolldown/Rust) | Fastest HMR, native ESM, built-in code splitting |
| Routing | React Router v7 (BrowserRouter) | Nested layouts, type-safe routes, Suspense integration |
| State | Module-level singleton | Zero setup; fits a single-user, single-tab demo |
| Styling | Tailwind CSS v4 | CSS-first config, zero runtime overhead |
| Charts | Recharts 3 | React-native SVG, good Recharts ecosystem |
| Animations | Framer Motion 12 | layoutId, AnimatePresence, spring physics |
| PWA | Service Worker + manifest | Offline support, installable on mobile |

---

## 2. Component Diagram

```mermaid
graph TD
    subgraph Entry["Entry Point"]
        Main["main.tsx<br/>StrictMode + ToastProvider"]
    end

    subgraph AppShell["App Shell (App.tsx)"]
        BrowserRouter["BrowserRouter"]
        Routes["Routes"]
    end

    subgraph Layouts["Layouts"]
        AppLayout["AppLayout<br/>Sidebar + Header + Outlet"]
        FullPage["Full Page<br/>Landing · NotFound"]
    end

    subgraph Shell["Shell Components (layout/)"]
        Sidebar["Sidebar<br/>Nav groups · Active indicator<br/>Review count badge"]
        Header["Header<br/>Command palette (⌘K)<br/>Shortcuts modal (?)<br/>Dark mode toggle"]
    end

    subgraph Pages_Main["Main Pages (pages/)"]
        Landing["Landing"]
        Dashboard["Dashboard<br/>WelcomeHeader · KpiCards<br/>HealthIndicator · Charts<br/>ExecutiveSummaryCard"]
    end

    subgraph Pages_Input["Input Pages"]
        ReviewInput["ReviewInput<br/>Textarea · PreviewLine<br/>Sample datasets"]
        ReviewUpload["ReviewUpload<br/>Drag-drop · FileReader<br/>parseCSV · Progress"]
    end

    subgraph Pages_Analysis["Analysis Pages (lazy-loaded)"]
        Sentiment["SentimentAnalysis<br/>AreaChart · RadarChart<br/>BarChart × 2"]
        Themes["ThemeDetection<br/>WordCloud · ScatterChart<br/>BarChart"]
        PainPoints["PainPoints<br/>PainPointCard · ScatterChart<br/>Impact-effort matrix"]
        Recs["Recommendations<br/>FeatureCard · RICECalculator<br/>BarChart"]
        Roadmap["Roadmap<br/>KanbanView · TimelineView<br/>GanttView"]
        Reviews["Reviews<br/>Filter bar · Paginated list<br/>Density toggle · CSV export"]
    end

    subgraph Pages_Util["Utility Pages (lazy-loaded)"]
        Export["Export<br/>Format selector · Section toggle<br/>PDF · CSV · JSON · Blob download"]
        Help["Help"]
        About["About"]
        NotFound["NotFound (404)"]
    end

    subgraph UIKit["UI Primitives (components/ui/)"]
        Button["Button"]
        Card["Card / CardHeader / CardContent"]
        Badge["Badge"]
        Skeleton["Skeleton · SkeletonPage · EmptyState"]
        Toast["ToastProvider · ToastContainer"]
        Progress["Progress"]
        Tabs["Tabs"]
        Tooltip["Tooltip"]
    end

    subgraph Hooks["Hooks (hooks/)"]
        useAnalysis["useAnalysis()<br/>reviews · themes · painPoints<br/>analyzeText · reset"]
        useDarkMode["useDarkMode()<br/>isDark · toggle"]
        useToast["useToast()<br/>addToast"]
    end

    Main --> AppShell
    AppShell --> Layouts
    Layouts --> AppLayout
    AppLayout --> Sidebar
    AppLayout --> Header
    AppLayout --> Pages_Main
    AppLayout --> Pages_Input
    AppLayout --> Pages_Analysis
    AppLayout --> Pages_Util
    Pages_Main & Pages_Analysis & Pages_Util --> UIKit
    Pages_Main & Pages_Analysis & Pages_Input --> Hooks
```

---

## 3. Folder Hierarchy

```
ai-feedback-analyzer/
│
├── public/                         # Static assets — served as-is
│   ├── index.html                  # (actually at root, not public/)
│   ├── app-logo.svg                # PWA icon + README logo
│   ├── favicon.svg                 # Browser tab icon
│   ├── icons.svg                   # Sprite sheet (unused currently)
│   ├── manifest.json               # PWA Web App Manifest
│   ├── sitemap.xml                 # XML sitemap for crawlers
│   └── sw.js                       # Service Worker (cache-first)
│
├── src/
│   ├── main.tsx                    # React root — StrictMode, ToastProvider, mountDOM
│   ├── App.tsx                     # Router, route definitions, lazy imports
│   ├── App.css                     # 3D perspective animation for landing hero
│   ├── index.css                   # Tailwind v4 import, CSS variables, @media print
│   │
│   ├── types/
│   │   └── index.ts                # Shared interfaces: Review, Theme, PainPoint,
│   │                               #   Feature, Sentiment, DashboardStats
│   │
│   ├── lib/                        # Pure utility functions — no React, no side effects
│   │   ├── analysisEngine.ts       # classifySentiment, detectThemes, estimateRating,
│   │   │                           #   parseReviewsFromText, buildThemeSummary, detectPainPoints
│   │   ├── chartColors.ts          # CHART constants, tooltipStyle, axisStyle
│   │   ├── executiveSummary.ts     # generateExecutiveSummary — template-based prose
│   │   └── utils.ts                # cn() — clsx + tailwind-merge
│   │
│   ├── hooks/                      # Reusable React hooks
│   │   ├── useAnalysis.ts          # Module singleton state + analyzeText + reset
│   │   ├── useDarkMode.ts          # localStorage + prefers-color-scheme + .dark class
│   │   └── useToast.ts             # Thin wrapper: useContext(ToastContext)
│   │
│   ├── data/                       # Static data — mock + sample datasets
│   │   ├── mockData.ts             # 15 mockReviews, mockThemes, mockPainPoints,
│   │   │                           #   mockFeatures, sentimentTrendData, ratingDistribution
│   │   └── sampleDatasets.ts       # Zepto, Swiggy, Zomato, Blinkit, Generic SaaS
│   │                               #   review strings for the input page dataset picker
│   │
│   ├── components/
│   │   ├── layout/                 # App shell — rendered on every authenticated page
│   │   │   ├── AppLayout.tsx       # useIsMobile, sidebar state, mobile backdrop,
│   │   │   │                       #   AnimatePresence page transitions, Outlet
│   │   │   ├── Sidebar.tsx         # Nav groups, Framer Motion width animation,
│   │   │   │                       #   layoutId active indicator, review count badge
│   │   │   └── Header.tsx          # CommandPalette, ShortcutsModal, dark mode toggle,
│   │   │                           #   3 × window keydown listeners
│   │   │
│   │   └── ui/                     # Design system primitives
│   │       ├── badge.tsx           # Variants: positive · negative · neutral · secondary
│   │       ├── button.tsx          # Variants: default · outline · ghost · secondary · destructive
│   │       ├── card.tsx            # Card · CardHeader · CardTitle · CardDescription · CardContent
│   │       ├── progress.tsx        # Radix Progress wrapper
│   │       ├── select.tsx          # Radix Select wrapper
│   │       ├── skeleton.tsx        # Skeleton · SkeletonCard · SkeletonChart ·
│   │       │                       #   SkeletonPage · EmptyState
│   │       ├── tabs.tsx            # Radix Tabs wrapper
│   │       ├── textarea.tsx        # Styled textarea primitive
│   │       ├── toast-context.ts    # Toast interface, ToastContextValue, createContext
│   │       ├── toast.tsx           # ToastProvider (useReducer), ToastContainer,
│   │       │                       #   auto-dismiss, 3 variants, Framer Motion animations
│   │       └── tooltip.tsx         # Radix Tooltip wrapper
│   │
│   └── pages/                      # Route-level components
│       ├── Landing.tsx             # Full-page marketing page (eager-loaded)
│       ├── Dashboard.tsx           # Main app view (eager-loaded) — 785 lines
│       ├── ReviewInput.tsx         # Paste text input + live preview (lazy)
│       ├── ReviewUpload.tsx        # Drag-drop CSV/TXT upload (lazy)
│       ├── SentimentAnalysis.tsx   # Charts: Area, Radar, Bar × 2 (lazy)
│       ├── ThemeDetection.tsx      # WordCloud, Scatter, Bar (lazy)
│       ├── PainPoints.tsx          # Pain point cards, impact/effort matrix (lazy)
│       ├── Recommendations.tsx     # RICE calculator, feature cards, bar chart (lazy)
│       ├── Roadmap.tsx             # Kanban · Timeline · Gantt views (lazy)
│       ├── Reviews.tsx             # Filterable paginated review list (lazy)
│       ├── Export.tsx              # Format selector, real PDF/CSV/JSON download (lazy)
│       ├── Help.tsx                # Guide + FAQ accordion (lazy)
│       ├── About.tsx               # Tech stack + architecture notes (lazy)
│       └── NotFound.tsx            # 404 full-page (lazy, outside AppLayout)
│
├── index.html                      # Shell HTML — SEO meta, OG tags, manifest link
├── vite.config.ts                  # Plugins, alias, manualChunks code splitting
├── tsconfig.json                   # Project references
├── tsconfig.app.json               # App compiler options — strict, verbatimModuleSyntax
├── tsconfig.node.json              # Vite config compiler options
├── package.json                    # Dependencies + scripts
├── README.md                       # Portfolio documentation
├── ARCHITECTURE.md                 # This file
├── CHANGELOG.md                    # Version history
├── CONTRIBUTING.md                 # Development guide
└── .env.example                    # Environment variable template
```

---

## 4. Data Flow Diagram

```mermaid
flowchart TD
    subgraph Input["Data Input Layer"]
        Paste["User pastes text\nReviewInput.tsx"]
        Upload["User uploads CSV/TXT\nReviewUpload.tsx"]
        Sample["User selects sample dataset\nsampleDatasets.ts"]
        Mock["Initial mock data\nmockData.ts — 15 reviews"]
    end

    subgraph Engine["Analysis Engine (lib/analysisEngine.ts)"]
        Parse["parseReviewsFromText(rawText)\n→ split on newlines\n→ filter lines < 20 chars\n→ assign id, date, source"]
        Sentiment["classifySentiment(text)\n→ count positive/negative keywords\n→ score > 0 = positive\n→ score < 0 = negative"]
        Themes["detectThemes(text)\n→ match against THEME_KEYWORDS map\n→ return up to 4 matched themes"]
        Rating["estimateRating(text, sentiment)\n→ regex for star patterns\n→ fallback: text.length % 2 seed"]
        ThemeSummary["buildThemeSummary(reviews)\n→ group by theme name\n→ count pos/neg per theme\n→ compute percentage"]
        PainDetect["detectPainPoints(reviews)\n→ match PAIN_POINT_PATTERNS regexes\n→ filter negative sentiment\n→ compute frequency %"]
    end

    subgraph State["State Layer (hooks/useAnalysis.ts)"]
        Singleton["Module singleton: _state\n{ reviews, themes, painPoints, isAnalyzed }"]
        ReactState["React useState()\nper-component copy of _state"]
    end

    subgraph Summary["Summary Generation (lib/executiveSummary.ts)"]
        ExecSummary["generateExecutiveSummary()\n→ compute dominant sentiment\n→ extract top 3 themes\n→ count critical pain points\n→ return template prose string"]
    end

    subgraph Consumers["UI Consumers"]
        Dash["Dashboard.tsx\nKPI cards, charts, executive summary"]
        SentPage["SentimentAnalysis.tsx\nSentiment breakdowns (partial — some hardcoded)"]
        ThemePage["ThemeDetection.tsx\nWord cloud, scatter"]
        PainPage["PainPoints.tsx\nSeverity cards, impact matrix"]
        RecPage["Recommendations.tsx\nRICE scores (currently static mockFeatures)"]
        RoadPage["Roadmap.tsx\nKanban/Timeline/Gantt (currently static mockFeatures)"]
        RevPage["Reviews.tsx\nFilterable list, CSV export"]
        ExpPage["Export.tsx\nPDF/CSV/JSON download"]
    end

    Mock -->|"initial _state"| Singleton
    Paste --> Parse
    Upload --> Parse
    Sample --> Parse
    Parse --> Sentiment
    Parse --> Themes
    Parse --> Rating
    Sentiment & Themes & Rating -->|"Review objects"| ThemeSummary
    Sentiment & Themes & Rating -->|"Review objects"| PainDetect
    ThemeSummary -->|"Theme[]"| Singleton
    PainDetect -->|"PainPoint[]"| Singleton
    Parse -->|"Review[]"| Singleton
    Singleton --> ReactState
    ReactState --> Consumers
    ReactState --> ExecSummary
    ExecSummary --> Dash
```

---

## 5. React Rendering Flow

```mermaid
sequenceDiagram
    participant Browser
    participant main.tsx
    participant App.tsx
    participant AppLayout
    participant Sidebar
    participant Header
    participant Page as "Active Page<br/>(e.g. Dashboard)"
    participant useAnalysis

    Browser->>main.tsx: Load index.html → parse JS bundle
    main.tsx->>main.tsx: ReactDOM.createRoot('#root')
    main.tsx->>App.tsx: Render <StrictMode><ToastProvider><App />
    App.tsx->>App.tsx: BrowserRouter initializes<br/>matches current URL
    App.tsx->>AppLayout: Render layout shell
    AppLayout->>AppLayout: useIsMobile() — MediaQueryList listener
    AppLayout->>Sidebar: Render <Sidebar isOpen={sidebarOpen} />
    AppLayout->>Header: Render <Header />
    Header->>Header: Register 3 × window keydown listeners
    App.tsx->>Page: Render matched page via <Outlet />
    Page->>useAnalysis: const { reviews, themes } = useAnalysis()
    useAnalysis->>useAnalysis: useState(_state) — reads module singleton
    useAnalysis-->>Page: { reviews, themes, painPoints, ... }
    Page->>Page: Compute derived data (useMemo)
    Page-->>Browser: Paint DOM

    Note over Browser,Page: User uploads reviews
    Page->>useAnalysis: analyzeText(rawText)
    useAnalysis->>useAnalysis: parseReviewsFromText → buildThemeSummary
    useAnalysis->>useAnalysis: _state = newState (mutation)
    useAnalysis->>useAnalysis: setState(newState) → triggers re-render
    Page-->>Browser: Re-paint with new data
```

---

## 6. Routing Flow

```mermaid
flowchart TD
    URL["URL entered / link clicked"]
    Router["BrowserRouter\nlistens to History API"]
    Match["Routes tree — match path"]

    URL --> Router --> Match

    Match -->|"/"| Landing["Landing.tsx\nFull page — no AppLayout\nEager loaded"]

    Match -->|"/dashboard\n/input /upload\n/sentiment /themes\n/pain-points /recommendations\n/roadmap /reviews\n/export /help /about"| AppLayout["AppLayout\nSidebar + Header + Outlet"]

    AppLayout -->|"/dashboard"| Dashboard["Dashboard.tsx\nEager loaded — no Suspense"]
    AppLayout -->|"all others"| Suspense["<Suspense fallback=<SkeletonPage />>"]
    Suspense -->|"chunk not cached"| Network["Network: fetch JS chunk\n(vendor-charts, vendor-motion, etc.)"]
    Network --> LazyPage["Lazy page component renders"]
    Suspense -->|"chunk cached"| LazyPage

    Match -->|"/feedback"| Alias["Alias → ReviewInput\n(should be 301 redirect)"]
    Match -->|"* (no match)"| NotFound["NotFound.tsx\nFull page — no AppLayout\nLazy loaded"]

    subgraph ChunkMap["Lazy Chunk Sizes (gzipped)"]
        C1["ReviewInput → 7.5 KB"]
        C2["Recommendations → 2.9 KB"]
        C3["Export → 3.3 KB"]
        C4["Reviews → 3.0 KB"]
        C5["Help → 3.8 KB"]
        C6["All others → 1–2.6 KB"]
    end
```

### Route table

| Path | Component | Layout | Load strategy |
|---|---|---|---|
| `/` | Landing | None | Eager |
| `/dashboard` | Dashboard | AppLayout | Eager |
| `/input` | ReviewInput | AppLayout | Lazy |
| `/upload` | ReviewUpload | AppLayout | Lazy |
| `/sentiment` | SentimentAnalysis | AppLayout | Lazy |
| `/themes` | ThemeDetection | AppLayout | Lazy |
| `/pain-points` | PainPoints | AppLayout | Lazy |
| `/recommendations` | Recommendations | AppLayout | Lazy |
| `/roadmap` | Roadmap | AppLayout | Lazy |
| `/reviews` | Reviews | AppLayout | Lazy |
| `/export` | Export | AppLayout | Lazy |
| `/help` | Help | AppLayout | Lazy |
| `/about` | About | AppLayout | Lazy |
| `/feedback` | ReviewInput (alias) | AppLayout | Lazy |
| `*` | NotFound | None | Lazy |

---

## 7. Theme System

```mermaid
flowchart TD
    subgraph Detection["Theme Detection (useDarkMode.ts)"]
        LS["localStorage.getItem('theme')\n'dark' | 'light' | null"]
        OS["window.matchMedia\n('prefers-color-scheme: dark')"]
        Init["useState initializer\nRuns once on mount"]
    end

    subgraph Toggle["Toggle"]
        Button["Dark mode button\n(Header.tsx)"]
        Hook["useDarkMode().toggle()"]
        SetState["setIsDark(!isDark)"]
    end

    subgraph Apply["Apply (useEffect)"]
        AddClass["document.documentElement\n.classList.add('dark')"]
        RemoveClass["document.documentElement\n.classList.remove('dark')"]
        SaveLS["localStorage.setItem('theme', 'dark'|'light')"]
    end

    subgraph CSS["CSS Variable Resolution (index.css)"]
        LightVars[":root {\n  --color-background: #ffffff;\n  --color-foreground: #09090b;\n  --color-card: #ffffff;\n  --color-muted: #f4f4f5;\n  --color-border: #e4e4e7;\n  --color-primary: #6d5df6;\n  --color-muted-foreground: #71717a;\n}"]
        DarkVars[".dark {\n  --color-background: #09090b;\n  --color-foreground: #fafafa;\n  --color-card: #111113;\n  --color-muted: #1c1c1e;\n  --color-border: #27272a;\n  --color-primary: #7c6ff7;\n  --color-muted-foreground: #a1a1aa;\n}"]
    end

    subgraph Consumers["Style Consumers"]
        TailwindVars["Tailwind classes\nbg-[var(--color-card)]\ntext-[var(--color-foreground)]"]
        InlineStyles["Inline style props\nstyle={{ color: 'var(--color-muted-foreground)' }}"]
        ChartColors["chartColors.ts\ntooltipStyle uses CSS var() references"]
    end

    LS -->|"stored value"| Init
    OS -->|"system preference"| Init
    Init --> SetState
    Button --> Hook --> SetState
    SetState -->|"isDark = true"| AddClass --> SaveLS
    SetState -->|"isDark = false"| RemoveClass --> SaveLS
    AddClass --> DarkVars
    RemoveClass --> LightVars
    LightVars & DarkVars --> TailwindVars
    LightVars & DarkVars --> InlineStyles
    LightVars & DarkVars --> ChartColors
```

### CSS variable map

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-background` | `#ffffff` | `#09090b` | Page background |
| `--color-foreground` | `#09090b` | `#fafafa` | Primary text |
| `--color-card` | `#ffffff` | `#111113` | Card surfaces |
| `--color-muted` | `#f4f4f5` | `#1c1c1e` | Subtle backgrounds |
| `--color-border` | `#e4e4e7` | `#27272a` | Dividers, input borders |
| `--color-primary` | `#6d5df6` | `#7c6ff7` | Brand purple |
| `--color-muted-foreground` | `#71717a` | `#a1a1aa` | Secondary text |
| `--color-ring` | `#6d5df6` | `#7c6ff7` | Focus rings |

---

## 8. Analysis Engine Flow

```mermaid
flowchart TD
    subgraph Input["Raw Input"]
        Raw["rawText: string\n(newline-separated reviews)"]
    end

    subgraph Step1["Step 1 — parseReviewsFromText()"]
        Split["Split on /\\n+/"]
        Trim["Trim whitespace\nStrip leading/trailing quotes"]
        Filter["Filter: length > 20 chars"]
        Map["Map each line → Review object"]
    end

    subgraph Step2["Step 2 — Per-review classification"]
        SentimentFn["classifySentiment(text)\n\nfor each POSITIVE_WORD: score++\nfor each NEGATIVE_WORD: score--\nscore > 0 → 'positive'\nscore < 0 → 'negative'\nscore = 0 → 'neutral'"]
        ThemeFn["detectThemes(text)\n\nfor each THEME_KEYWORDS entry:\n  if any keyword in text.toLowerCase()\n    → include theme\nReturn first 4 matches"]
        RatingFn["estimateRating(text, sentiment)\n\nRegex: /(\d)[\s/-]?(?:star|\/5|out of 5)/i\nFallback:\n  positive → 4 or 5 (text.length % 2)\n  negative → 1 or 2\n  neutral  → 3"]
    end

    subgraph Step3["Step 3 — buildThemeSummary(reviews)"]
        GroupThemes["Group reviews by theme name\nCount total, positive, negative"]
        SortThemes["Sort by count descending"]
        ComputePct["Compute percentage of total reviews"]
        AssignSentiment["Assign theme sentiment:\n  pos > neg → positive\n  neg > pos → negative\n  else     → neutral"]
    end

    subgraph Step4["Step 4 — detectPainPoints(reviews)"]
        MatchPatterns["For each PAIN_POINT_PATTERN:\n  Filter reviews where:\n    - pattern.test(review.text)\n    - review.sentiment === 'negative'"]
        FreqCalc["frequency = matching.length / total × 100"]
        BuildPP["Build PainPoint object\nwith title, severity, affectedUsers estimate"]
        FilterEmpty["Filter out patterns with 0 matches"]
    end

    subgraph Output["State Output"]
        StateUpdate["_state = {\n  reviews: [...mockReviews, ...parsed],\n  themes: Theme[],\n  painPoints: PainPoint[],\n  isAnalyzed: true\n}"]
    end

    Raw --> Split --> Trim --> Filter --> Map
    Map --> SentimentFn
    Map --> ThemeFn
    Map --> RatingFn
    SentimentFn & ThemeFn & RatingFn -->|"Review[]"| GroupThemes
    GroupThemes --> SortThemes --> ComputePct --> AssignSentiment
    SentimentFn & ThemeFn & RatingFn -->|"Review[]"| MatchPatterns
    MatchPatterns --> FreqCalc --> BuildPP --> FilterEmpty
    AssignSentiment -->|"Theme[]"| StateUpdate
    FilterEmpty -->|"PainPoint[]"| StateUpdate

    subgraph Keywords["Keyword Sets"]
        PosWords["POSITIVE_WORDS (20)\nlove · great · amazing\nexcellent · perfect · fast\nreliable · helpful · easy..."]
        NegWords["NEGATIVE_WORDS (20)\nterrible · awful · broken\nslow · confusing · bug\ncrash · unusable · hate..."]
        ThemeKW["THEME_KEYWORDS (9 themes)\nOnboarding · UI/UX · Performance\nMobile · Integrations · Analytics\nSupport · Pricing · AI Features"]
        PainPat["PAIN_POINT_PATTERNS (7)\nconfusing onboarding (critical)\nmobile app issues (critical)\nperformance slow (high)\npoor search (high)\nbulk actions (high)\nexport limits (medium)\npricing (medium)"]
    end

    SentimentFn -.-> PosWords & NegWords
    ThemeFn -.-> ThemeKW
    MatchPatterns -.-> PainPat
```

---

## 9. Export Flow

```mermaid
flowchart TD
    User["User selects format\n+ configures sections"]

    subgraph PDF["PDF Export"]
        PrintCall["window.print()\nafter 400ms delay"]
        MediaPrint["@media print CSS\n→ hide sidebar, header\n→ full-width content\n→ page-break-inside: avoid"]
        PrintDialog["Browser print dialog\n'Save as PDF' option"]
        PDFFile["PDF file on disk"]
    end

    subgraph CSV["CSV Export (real)"]
        CSVHeader["Build header row:\nID, Text, Source, Date, Rating, Sentiment, Themes"]
        CSVRows["Map reviews → CSV rows\nEscape quotes: replace ' with ''"]
        CSVBlob["new Blob([csv], { type: 'text/csv' })"]
        CSVUrl["URL.createObjectURL(blob)"]
        CSVAnchor["<a href=url download=filename>\na.click() → browser saves file"]
        CSVCleanup["setTimeout → URL.revokeObjectURL()\n(free memory after 100ms)"]
    end

    subgraph JSON["JSON Export (real)"]
        JSONData["Build data object:\n{ generatedAt, totalReviews,\n  reviews[], themes[], painPoints[],\n  sections[] }"]
        JSONBlob["new Blob([JSON.stringify(data, null, 2)],\n{ type: 'application/json' })"]
        JSONAnchor["Same anchor click pattern as CSV"]
    end

    subgraph Simulated["Simulated (Excel / PPTX)"]
        FakeProgress["setStatus('generating')\n2.5s setTimeout"]
        FakeDone["setStatus('done')\nshowToast('Export complete')"]
    end

    Toast["useToast().addToast()\n→ success notification"]

    User -->|"pdf"| PDF
    User -->|"csv"| CSV
    User -->|"json"| JSON
    User -->|"excel or pptx"| Simulated

    PrintCall --> MediaPrint --> PrintDialog --> PDFFile
    CSVHeader --> CSVRows --> CSVBlob --> CSVUrl --> CSVAnchor --> CSVCleanup
    JSONData --> JSONBlob --> JSONAnchor

    PDF & CSV & JSON --> Toast
    Simulated --> FakeProgress --> FakeDone --> Toast
```

---

## 10. State Management

```mermaid
flowchart TD
    subgraph Current["Current Implementation"]
        ModuleSingleton["Module-level singleton\nlet _state: AnalysisState\n\nDeclared once at module import time\nLives for full page lifetime\nAll useAnalysis() calls share it"]

        Hook["useAnalysis() hook\nconst [state, setState] = useState(_state)\n\nReads from singleton on mount\nWrites back via setState for current component\nOther mounted components do NOT update"]

        DarkLS["useDarkMode()\nReads: localStorage.getItem('theme')\nWrites: localStorage.setItem()\nApplies: document.documentElement.classList"]

        ToastCtx["ToastContext + useReducer\nIn-memory array of active toasts\nauto-dismiss via setTimeout\nPropagates to all consumers via Context"]
    end

    subgraph Problems["Known Problems"]
        P1["Multi-tab isolation — each tab\nhas its own module instance"]
        P2["Stale state — mounted siblings\ndon't re-render on _state mutation"]
        P3["StrictMode double-mount\nmay see dirty _state"]
        P4["No persistence — refresh\nresets to mockReviews"]
    end

    subgraph Future["Recommended: Zustand Store"]
        ZustandStore["create<AnalysisStore>((set, get) => ({\n  reviews: [],\n  themes: [],\n  painPoints: [],\n  isAnalyzed: false,\n\n  analyzeText: (rawText) => {\n    const parsed = parseReviewsFromText(rawText)\n    set({\n      reviews: parsed,\n      themes: buildThemeSummary(parsed),\n      painPoints: detectPainPoints(parsed),\n      isAnalyzed: true,\n    })\n  },\n\n  reset: () => set({ reviews: [], isAnalyzed: false }),\n}))"]

        PersistMiddleware["persist middleware\n→ localStorage serialization\n→ reviews survive page refresh"]

        DevtoolsMiddleware["devtools middleware\n→ Redux DevTools support\n→ time-travel debugging"]
    end

    Current --> Problems
    Problems -.->|"migration path"| Future
```

### State inventory

| State | Location | Persisted | Scope |
|---|---|---|---|
| `reviews[]` | Module singleton | No — resets on refresh | App |
| `themes[]` | Module singleton | No | App |
| `painPoints[]` | Module singleton | No | App |
| `isDark` | `useDarkMode` + localStorage | Yes — localStorage | App |
| `sidebarOpen` | `AppLayout` useState | No | Layout |
| `isMobile` | `AppLayout` useIsMobile | No (derived) | Layout |
| `cmdOpen` | `Header` useState | No | Component |
| `shortcutsOpen` | `Header` useState | No | Component |
| `toasts[]` | `ToastProvider` useReducer | No | App |
| `search`, `filters`, `page` | `Reviews` useState | No | Page |
| `compact` (density) | `Reviews` useState | No | Page |
| `selected format` | `Export` useState | No | Page |
| `enabledSections` | `Export` useState | No | Page |

---

## 11. Future Backend Architecture

```mermaid
graph TB
    subgraph Client["Browser Client"]
        ReactApp["React SPA\n(current codebase)"]
        LocalState["Zustand store\n(local analysis cache)"]
    end

    subgraph CDN["CDN / Edge"]
        EdgeCache["Vercel Edge Network\nStatic assets + API routes"]
    end

    subgraph API["API Layer (Node.js / Next.js App Router)"]
        AuthMiddleware["Auth middleware\nJWT verification"]
        ReviewsAPI["/api/reviews\nGET · POST · DELETE"]
        AnalysisAPI["/api/analysis\nPOST — trigger job\nGET — poll status"]
        ExportAPI["/api/export\nGET /pdf · /csv · /json"]
        WorkspaceAPI["/api/workspaces\nMulti-tenant data isolation"]
    end

    subgraph AI["AI / ML Layer"]
        ClaudeAPI["Anthropic Claude API\nclaude-sonnet-5\n\nSentiment classification\nTheme extraction\nExecutive summary generation\nFeature prioritization suggestions"]
        Embeddings["OpenAI Embeddings\ntext-embedding-3-small\n\nSemantic deduplication\nSimilar review clustering"]
    end

    subgraph Queue["Job Queue"]
        BullMQ["BullMQ (Redis-backed)\nAnalysis jobs\nExport generation\nEmail delivery"]
    end

    subgraph Storage["Storage"]
        Postgres["PostgreSQL (Supabase)\nUsers · Workspaces · Reviews\nAnalyses · Features"]
        S3["S3 / R2 (Cloudflare)\nRaw uploaded files\nGenerated PDF exports"]
        Redis["Redis (Upstash)\nJob queue · Session cache\nRate limiting counters"]
    end

    subgraph Observability["Observability"]
        Sentry["Sentry\nError tracking"]
        PostHog["PostHog\nProduct analytics · Feature flags"]
        Datadog["Datadog\nAPI latency · Job queue depth"]
    end

    ReactApp <-->|"HTTPS + Auth headers"| EdgeCache
    EdgeCache <--> AuthMiddleware
    AuthMiddleware --> ReviewsAPI & AnalysisAPI & ExportAPI & WorkspaceAPI
    AnalysisAPI -->|"Enqueue job"| BullMQ
    BullMQ -->|"Process"| ClaudeAPI
    BullMQ -->|"Process"| Embeddings
    ReviewsAPI & AnalysisAPI --> Postgres
    ExportAPI --> S3
    BullMQ --> S3
    AuthMiddleware --> Redis
    ReactApp --> Sentry
    ReactApp --> PostHog
    API --> Datadog
```

---

## 12. Future Database Schema

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string name
        string avatar_url
        string plan "free | pro | enterprise"
        timestamp created_at
        timestamp last_seen_at
    }

    WORKSPACES {
        uuid id PK
        string name
        string slug UK
        uuid owner_id FK
        string plan
        int review_quota_monthly
        timestamp created_at
    }

    WORKSPACE_MEMBERS {
        uuid workspace_id FK
        uuid user_id FK
        string role "owner | admin | member | viewer"
        timestamp joined_at
    }

    REVIEW_SETS {
        uuid id PK
        uuid workspace_id FK
        uuid created_by FK
        string name
        string description
        string source_type "manual | csv | api | integration"
        int review_count
        timestamp created_at
        timestamp analyzed_at
    }

    REVIEWS {
        uuid id PK
        uuid review_set_id FK
        text content
        string source "G2 | App Store | Trustpilot | ..."
        string external_id
        int rating
        date review_date
        string sentiment "positive | negative | neutral"
        float sentiment_confidence
        string[] themes
        jsonb metadata
        timestamp created_at
    }

    ANALYSES {
        uuid id PK
        uuid review_set_id FK
        uuid created_by FK
        string status "pending | processing | complete | failed"
        string model "claude-sonnet-5 | keyword"
        jsonb results
        string executive_summary
        float processing_seconds
        timestamp created_at
        timestamp completed_at
    }

    THEMES {
        uuid id PK
        uuid analysis_id FK
        string name
        int mention_count
        float percentage
        string sentiment
        string trend "up | down | stable"
        string[] example_review_ids
    }

    PAIN_POINTS {
        uuid id PK
        uuid analysis_id FK
        string title
        text description
        string severity "critical | high | medium | low"
        float frequency_pct
        int affected_users_estimate
        string[] theme_ids FK
    }

    FEATURES {
        uuid id PK
        uuid workspace_id FK
        string title
        text description
        int reach
        int impact
        int confidence
        int effort
        float rice_score
        string status "backlog | planned | in-progress | completed"
        string quarter
        string category
        uuid[] pain_point_ids
        timestamp created_at
        timestamp updated_at
    }

    EXPORTS {
        uuid id PK
        uuid workspace_id FK
        uuid created_by FK
        string format "pdf | csv | json | excel | pptx"
        string status "generating | ready | expired"
        string file_url
        int file_size_bytes
        timestamp created_at
        timestamp expires_at
    }

    USERS ||--o{ WORKSPACE_MEMBERS : "belongs to"
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : "has"
    WORKSPACES ||--o{ REVIEW_SETS : "owns"
    REVIEW_SETS ||--o{ REVIEWS : "contains"
    REVIEW_SETS ||--o{ ANALYSES : "produces"
    ANALYSES ||--o{ THEMES : "generates"
    ANALYSES ||--o{ PAIN_POINTS : "identifies"
    WORKSPACES ||--o{ FEATURES : "manages"
    WORKSPACES ||--o{ EXPORTS : "creates"
```

### Index strategy

```sql
-- Hot query paths
CREATE INDEX idx_reviews_set_id ON reviews(review_set_id);
CREATE INDEX idx_reviews_sentiment ON reviews(review_set_id, sentiment);
CREATE INDEX idx_reviews_source ON reviews(review_set_id, source);
CREATE INDEX idx_reviews_date ON reviews(review_set_id, review_date DESC);
CREATE INDEX idx_analyses_workspace ON analyses(review_set_id, status);
CREATE INDEX idx_features_workspace ON features(workspace_id, status);

-- Full-text search on review content
CREATE INDEX idx_reviews_fts ON reviews USING gin(to_tsvector('english', content));
```

---

## 13. Future Authentication

```mermaid
sequenceDiagram
    participant Browser
    participant App as "React App"
    participant API as "API (Next.js)"
    participant Auth as "Auth Provider<br/>(Supabase Auth / Auth.js)"
    participant DB as "PostgreSQL"
    participant Redis

    Note over Browser,Redis: Sign-up / Sign-in flow
    Browser->>App: Click "Sign in with Google"
    App->>Auth: Redirect to OAuth provider
    Auth->>Auth: User authenticates with Google
    Auth-->>App: Redirect back with code
    App->>API: POST /auth/callback { code }
    API->>Auth: Exchange code for tokens
    Auth-->>API: { access_token, refresh_token, user }
    API->>DB: Upsert user record
    API->>Redis: SET session:{id} { user_id, workspace_id } TTL 7d
    API-->>App: Set HttpOnly cookie { session_id }
    App-->>Browser: Redirect to /dashboard

    Note over Browser,Redis: Authenticated API request
    Browser->>API: GET /api/reviews (cookie: session_id)
    API->>Redis: GET session:{session_id}
    Redis-->>API: { user_id, workspace_id }
    API->>DB: SELECT * FROM reviews WHERE workspace_id = ?
    DB-->>API: Review rows
    API-->>Browser: JSON response

    Note over Browser,Redis: Token refresh
    Browser->>API: Any request (expired session)
    API->>Redis: GET session:{id} → null (expired)
    API-->>Browser: 401 Unauthorized
    Browser->>App: Intercept 401
    App->>Auth: Refresh token
    Auth-->>App: New access token
    App->>API: Retry original request
```

### Auth strategy decisions

| Concern | Decision | Rationale |
|---|---|---|
| Provider | Supabase Auth | Handles OAuth, magic links, JWT — minimal custom code |
| Session storage | HttpOnly cookie (not localStorage) | Prevents XSS token theft |
| Session duration | 7-day sliding window | Balance security vs. UX |
| MFA | TOTP (Google Authenticator) | Required for Enterprise plan |
| Row-level security | Postgres RLS policies | `workspace_id` on every query — data isolation at DB level |
| API keys | SHA-256 hashed in DB | For server-to-server integrations |

### Postgres Row Level Security

```sql
-- Users can only read reviews in their workspace
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY reviews_workspace_isolation ON reviews
  FOR ALL
  USING (
    review_set_id IN (
      SELECT id FROM review_sets
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = auth.uid()
      )
    )
  );
```

---

## 14. Future API Layer

```mermaid
graph LR
    subgraph Clients["Clients"]
        Web["Web App\n(React SPA)"]
        Mobile["Mobile App\n(React Native — future)"]
        Integrations["Integrations\n(Zapier, Make, Slack)"]
        PublicAPI["Developer API\n(direct API key usage)"]
    end

    subgraph Gateway["API Gateway"]
        RateLimit["Rate limiting\n(Redis sliding window)\nFree: 100 req/min\nPro: 1000 req/min"]
        AuthMiddleware["Auth middleware\nJWT or API key"]
        RequestLog["Request logging\n(Datadog)"]
    end

    subgraph Routes["REST Endpoints"]
        direction TB

        R1["POST /api/review-sets\nCreate a new review set"]
        R2["POST /api/review-sets/:id/reviews\nBulk upload reviews (JSON array)"]
        R3["GET /api/review-sets/:id/reviews\n?sentiment=&source=&page=&limit=\nFilterable paginated list"]
        R4["POST /api/review-sets/:id/analyze\nTrigger analysis job → returns job_id"]
        R5["GET /api/jobs/:id\nPoll analysis job status"]
        R6["GET /api/review-sets/:id/analysis\nFetch completed analysis results"]
        R7["GET /api/workspaces/:id/features\nList features with RICE scores"]
        R8["POST /api/workspaces/:id/features\nCreate feature from pain point"]
        R9["GET /api/exports\nList past exports"]
        R10["POST /api/exports\nGenerate export { format, review_set_id, sections }"]
        R11["GET /api/exports/:id/download\nRedirect to signed S3 URL"]
    end

    subgraph Workers["Background Workers (BullMQ)"]
        AnalysisWorker["analysis-worker\n1. Fetch reviews from DB\n2. Call Claude API for sentiment\n3. Extract themes via embeddings\n4. Detect pain points\n5. Generate executive summary\n6. Write results to DB\n7. Emit job:complete event"]
        ExportWorker["export-worker\n1. Query filtered reviews\n2. Generate file (CSV/JSON/PDF)\n3. Upload to S3\n4. Update export record with URL\n5. Send email notification"]
    end

    subgraph ClaudePrompts["Claude API Prompts"]
        SentimentPrompt["Sentiment batch:\n'Classify the sentiment of each review.\nReturn JSON: { id, sentiment, confidence }'\n~1000 reviews per request\n~$0.003 per 1000 reviews"]
        SummaryPrompt["Executive summary:\n'Given these themes and pain points,\nwrite a 3-paragraph executive summary\nfor a product manager audience.'\n~$0.01 per analysis"]
        InsightPrompt["Feature suggestions:\n'Based on these pain points,\nsuggest 5 features with RICE estimates.'\n~$0.02 per analysis"]
    end

    Clients --> Gateway
    Gateway --> Routes
    R4 --> AnalysisWorker
    R10 --> ExportWorker
    AnalysisWorker --> ClaudePrompts
```

### API response envelope

```typescript
// All API responses follow this shape
interface APIResponse<T> {
  data: T | null
  error: {
    code: string           // "UNAUTHORIZED" | "QUOTA_EXCEEDED" | "NOT_FOUND" | ...
    message: string        // Human-readable
    details?: unknown      // Validation errors, etc.
  } | null
  meta: {
    request_id: string     // For support/debugging
    timestamp: string      // ISO 8601
    version: string        // API version: "2025-01-01"
  }
}

// Paginated list responses
interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    has_next: boolean
  }
}
```

### Rate limiting strategy

```
Free plan:    100 requests/minute · 500 reviews/analysis · 1 workspace
Pro plan:    1000 requests/minute · 10,000 reviews/analysis · 5 workspaces
Enterprise:  Custom limits · Unlimited reviews · SSO · SLA
```

### Webhook events (future)

```typescript
// Events emitted to customer webhook URLs
type WebhookEvent =
  | { type: 'analysis.completed'; data: { review_set_id: string; analysis_id: string } }
  | { type: 'analysis.failed';    data: { review_set_id: string; error: string } }
  | { type: 'export.ready';       data: { export_id: string; download_url: string } }
  | { type: 'quota.warning';      data: { used: number; limit: number; reset_at: string } }
```

---

## Bundle size breakdown

| Chunk | Size (raw) | Size (gzip) | Contents |
|---|---|---|---|
| `index.js` | 83 KB | 21 KB | App shell, router, layouts, hooks, Dashboard |
| `vendor-charts` | 393 KB | 103 KB | Recharts + D3 dependencies |
| `vendor-react` | 216 KB | 69 KB | React DOM + React Router |
| `vendor` | 206 KB | 71 KB | Other node_modules |
| `vendor-motion` | 33 KB | 11 KB | Framer Motion |
| Lazy pages (×12) | 2–20 KB each | 1–8 KB each | All secondary pages |
| **Total transferred** | **~930 KB** | **~283 KB** | First load (all chunks) |
| **Initial load** | **83 KB** | **21 KB** | Before any navigation |

---

*Document generated 2026-07-20. Reflects codebase at v1.0.0.*
