# Architecture Diagrams — AI Feedback Analyzer

All diagrams use Mermaid syntax. Render in GitHub, GitLab, Notion, or any Mermaid-compatible viewer.

---

## 1. System Context Diagram

The highest-level view — who uses the system and what it interacts with.

```mermaid
C4Context
    title AI Feedback Analyzer — System Context

    Person(pm, "Product Manager", "Has customer reviews from multiple platforms. Needs prioritized product insights.")
    Person(founder, "Startup Founder", "Reads raw reviews. Needs a backlog without a data team.")

    System(aifa, "AI Feedback Analyzer", "Client-side SPA. Classifies sentiment, clusters themes, identifies pain points, generates RICE roadmap.")

    System_Ext(g2, "G2 / Capterra", "Source of exported review CSVs")
    System_Ext(appstore, "App Store / Play Store", "Source of exported review CSVs")
    System_Ext(trustpilot, "Trustpilot", "Source of exported review CSVs")
    System_Ext(vercel, "Vercel / Netlify", "Static file hosting — serves HTML, JS, CSS")
    System_Ext(fonts, "Google Fonts CDN", "Serves Inter typeface")

    Rel(pm, aifa, "Pastes reviews or uploads CSV", "Browser")
    Rel(founder, aifa, "Loads sample dataset, explores insights", "Browser")
    Rel(g2, pm, "Exports review CSV")
    Rel(appstore, pm, "Exports review CSV")
    Rel(trustpilot, pm, "Exports review CSV")
    Rel(vercel, aifa, "Delivers static files", "HTTPS")
    Rel(fonts, aifa, "Provides font assets", "HTTPS")
```

---

## 2. Container Diagram

What the system is made of — the major deployable units and how they communicate.

```mermaid
C4Container
    title AI Feedback Analyzer — Containers

    Person(user, "User")

    Container_Boundary(browser, "User's Browser") {
        Container(spa, "React SPA", "React 19, TypeScript, Vite", "Renders UI, routes between pages, manages state")
        Container(sw, "Service Worker", "JavaScript", "Caches assets for offline use. Cache-first for static, network-first for navigation.")
        ContainerDb(ls, "localStorage", "Browser API", "Persists theme preference (dark/light)")
    }

    Container_Boundary(host, "Static File Host (Vercel)") {
        Container(cdn, "CDN Edge Network", "Vercel Edge", "Serves HTML, JS chunks, CSS, SVG assets globally")
        Container(html, "index.html", "HTML", "App shell with SEO meta, OG tags, manifest link")
        Container(chunks, "JS Chunks", "Rollup output", "vendor-react (216KB), vendor-charts (393KB), vendor-motion (33KB), index.js (83KB), 12 lazy page chunks")
        Container(assets, "Public Assets", "Static files", "manifest.json, sw.js, sitemap.xml, app-logo.svg, favicon.svg")
    }

    Rel(user, cdn, "Navigates to URL", "HTTPS")
    Rel(cdn, spa, "Delivers assets", "HTTPS")
    Rel(spa, sw, "Registers on prod load")
    Rel(sw, cdn, "Fetches and caches assets", "HTTPS")
    Rel(spa, ls, "Reads/writes theme")
```

---

## 3. Component Diagram (Layer View)

How the internal React layers relate — from shell to leaves.

```mermaid
graph TB
    subgraph Entry["Entry Layer"]
        main["main.tsx\nReactDOM.createRoot\nStrictMode\nToastProvider"]
    end

    subgraph Shell["App Shell Layer"]
        App["App.tsx\nBrowserRouter\nRoute definitions\nLazy imports"]
    end

    subgraph Layout["Layout Layer"]
        AppLayout["AppLayout.tsx\nSidebar state\nuseIsMobile\nAnimatePresence\nOutlet"]
        Sidebar["Sidebar.tsx\nNav groups\nlayoutId animation\nReview count badge"]
        Header["Header.tsx\nCommandPalette\nShortcutsModal\nDark mode toggle\n3× keydown listener"]
    end

    subgraph Pages_Eager["Eager Pages"]
        Landing["Landing.tsx\n682 lines\nMarketing page\nNo AppLayout"]
        Dashboard["Dashboard.tsx\n785 lines\nKpiCard × 4\nExecutiveSummaryCard\nHealthIndicator\nWelcomeHeader\n6 charts"]
    end

    subgraph Pages_Lazy["Lazy Pages (Suspense-wrapped)"]
        Input["ReviewInput\nPreviewLine\nDataset picker"]
        Upload["ReviewUpload\nDrag-drop\nparseCSV\nFileReader"]
        Sentiment["SentimentAnalysis\n4 charts"]
        Themes["ThemeDetection\nWordCloud\nScatter"]
        Pain["PainPoints\nSeverity cards\nImpact matrix"]
        Recs["Recommendations\nRICECalculator\nFeatureCard"]
        Road["Roadmap\nKanban\nTimeline\nGantt"]
        Reviews["Reviews\nFilter bar\nPagination\nDensity toggle"]
        Export["Export\nFormat picker\nBlob download\nwindow.print"]
        Help["Help"] 
        About["About"]
        NotFound["NotFound\nNo AppLayout"]
    end

    subgraph UIKit["UI Primitive Layer (components/ui/)"]
        Button["Button\n6 variants"]
        Card["Card family\nHeader/Title/Description/Content"]
        Badge["Badge\n4 variants"]
        Skeleton["Skeleton\nSkeletonCard\nSkeletonChart\nSkeletonPage\nEmptyState"]
        Toast["ToastProvider\nToastContainer\nToastContext"]
        Radix["Radix UI wrappers\nProgress · Select · Tabs · Tooltip · Accordion"]
    end

    subgraph DataLayer["Data & Logic Layer"]
        useAnalysis["useAnalysis()\nModule singleton\nanalyzeText\nreset"]
        useDarkMode["useDarkMode()\nlocalStorage\nprefers-color-scheme\n.dark class"]
        useToast["useToast()\nContext wrapper"]
        Engine["analysisEngine.ts\nclassifySentiment\ndetectThemes\nestimateRating\nparseReviewsFromText\nbuildThemeSummary\ndetectPainPoints"]
        Summary["executiveSummary.ts\ngenerateExecutiveSummary"]
        Colors["chartColors.ts\nCHART constants\ntooltipStyle\naxisStyle"]
        Mock["mockData.ts\n15 reviews\n12 themes\n8 pain points\n8 features\nchart arrays"]
        Samples["sampleDatasets.ts\nZepto · Swiggy\nZomato · Blinkit\nGeneric SaaS"]
        Types["types/index.ts\nReview · Theme\nPainPoint · Feature\nSentiment · DashboardStats"]
    end

    main --> App
    App --> Layout
    App --> Pages_Eager
    App --> Pages_Lazy
    Layout --> UIKit
    Pages_Eager --> UIKit
    Pages_Lazy --> UIKit
    Pages_Eager --> DataLayer
    Pages_Lazy --> DataLayer
    Layout --> DataLayer
```

---

## 4. Deployment Architecture

```mermaid
graph LR
    subgraph Dev["Development"]
        LocalDev["npm run dev\nvite dev server\nHMR on :5173"]
        TSCheck["tsc --noEmit\nType checking"]
        Lint["npm run lint\noxlint"]
    end

    subgraph Build["Build Pipeline"]
        BuildCmd["npm run build\ntsc -b && vite build"]
        Dist["dist/\nindex.html\nassets/\n  index.js (83KB)\n  vendor-react (216KB)\n  vendor-charts (393KB)\n  vendor-motion (33KB)\n  vendor.js (206KB)\n  [12 lazy page chunks]"]
    end

    subgraph Deploy["Deployment Options"]
        Vercel["Vercel\nAuto-detect Vite\nEdge CDN\nHTTPS auto\nSPA fallback built-in"]
        Netlify["Netlify\nnpm run build\npublic/_redirects\n/* /index.html 200"]
        Docker["Docker\nnginx:alpine\nCOPY dist → /usr/share/nginx/html\nExpose :80"]
        GHPages["GitHub Pages\nnpm run build\ngh-pages -d dist"]
    end

    subgraph PWA["PWA Layer"]
        Manifest["manifest.json\nname · icons · shortcuts\ndisplay_override\ntheme_color"]
        SW["sw.js\nInstall: precache / · /dashboard\nActivate: delete old caches\nFetch: cache-first static\nnetwork-first navigation"]
    end

    LocalDev --> TSCheck --> Lint --> BuildCmd --> Dist
    Dist --> Vercel
    Dist --> Netlify
    Dist --> Docker
    Dist --> GHPages
    Dist --> PWA
```

---

## 5. State Architecture Diagram

```mermaid
graph TD
    subgraph Current["Current State Model"]
        subgraph ModSingleton["Module Singleton (useAnalysis.ts)"]
            LState["let _state: AnalysisState\n= { reviews: mockReviews,\n    themes: mockThemes,\n    painPoints: mockPainPoints,\n    isAnalyzed: true }"]
        end

        subgraph ReactLocal["Per-Component React State"]
            RS1["Component A\nuseState(_state) → stateA"]
            RS2["Component B\nuseState(_state) → stateB"]
            RS3["Component C\nuseState(_state) → stateC"]
        end

        subgraph Problem["Problem: No Broadcast"]
            Mut["analyzeText() mutates _state\nCalls setState on Component A only\nB and C remain stale\nuntil remount"]
        end

        LState --> RS1 & RS2 & RS3
        RS1 -->|"analyzeText()"| Mut
        Mut -.->|"❌ does NOT update"| RS2 & RS3
    end

    subgraph Future["Recommended: Zustand"]
        ZStore["create() store\n{ reviews, themes, painPoints\n  analyzeText(), reset() }"]
        ZSub1["Component A\nuseAnalysis(state => state.reviews)"]
        ZSub2["Component B\nuseAnalysis(state => state.themes)"]
        ZSub3["Component C\nuseAnalysis(state => state.painPoints)"]
        ZDispatch["analyzeText() calls set()\nAll subscribers re-render\nAutomatically"]
        ZPersist["persist middleware\nserializes to localStorage\nSurvives page refresh"]

        ZStore --> ZSub1 & ZSub2 & ZSub3
        ZSub1 -->|"set()"| ZDispatch
        ZDispatch -->|"✅ updates all"| ZSub1 & ZSub2 & ZSub3
        ZStore --- ZPersist
    end

    subgraph OtherState["Other State (correct as-is)"]
        DarkMode["useDarkMode()\n→ localStorage\n→ document.documentElement.classList"]
        ToastCtx["ToastContext + useReducer\n→ React Context\n→ broadcasts to all consumers"]
        LocalUI["Component-local useState\nsidebarOpen · compact · page\nsearch · filters · status"]
    end
```

---

## 6. Bundle Composition Diagram

```mermaid
pie title JS Bundle Composition (Total: ~931KB uncompressed)
    "vendor-charts (Recharts + D3)" : 393
    "vendor-react (React DOM + Router)" : 216
    "vendor (other node_modules)" : 206
    "vendor-motion (Framer Motion)" : 33
    "index.js (app shell + Dashboard)" : 83
```

```mermaid
pie title What Loads on First Visit (83KB initial)
    "React core (in index.js)" : 45
    "App shell + routing" : 20
    "Dashboard component" : 12
    "Hooks + utilities + types" : 6
```

---

## 7. Layer Dependencies (no circular dependencies)

```mermaid
graph BT
    Types["types/index.ts"] 
    Utils["lib/utils.ts"]
    Colors["lib/chartColors.ts"]
    Engine["lib/analysisEngine.ts"]
    Summary["lib/executiveSummary.ts"]
    Mock["data/mockData.ts"]
    Samples["data/sampleDatasets.ts"]
    
    HookAnalysis["hooks/useAnalysis.ts"]
    HookDark["hooks/useDarkMode.ts"]
    HookToast["hooks/useToast.ts"]
    
    UIKit["components/ui/*"]
    Layout["components/layout/*"]
    Pages["pages/*"]

    Types --> Engine
    Types --> Summary
    Types --> Mock
    Types --> HookAnalysis
    Engine --> HookAnalysis
    Mock --> HookAnalysis
    Colors --> Pages
    Utils --> UIKit
    Utils --> Layout
    UIKit --> Layout
    UIKit --> Pages
    HookAnalysis --> Pages
    HookDark --> Layout
    HookToast --> Pages
    Summary --> Pages
    Samples --> Pages
    Layout --> Pages
```

All dependencies flow upward — no circular imports.
