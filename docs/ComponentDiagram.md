# Component Diagrams — AI Feedback Analyzer

Detailed component breakdowns: props, state, hooks, and relationships for every major component.

---

## 1. Full Component Tree (Hierarchical)

```mermaid
graph TD
    Root["ReactDOM.createRoot\n#root"]
    SM["React.StrictMode"]
    TP["ToastProvider\nstate: Toast[]\ndispatch: ADD · REMOVE"]
    App["App\nBrowserRouter\nRoutes"]

    Root --> SM --> TP --> App

    App --> LandingRoute["Route path='/'"]
    App --> AppLayoutRoute["Route element=AppLayout"]
    App --> NFRoute["Route path='*'"]

    LandingRoute --> Landing
    NFRoute --> NotFound

    AppLayoutRoute --> AL["AppLayout\nstate: sidebarOpen, isMobile\neffect: auto-close on mobile nav"]

    AL --> Sidebar_c["Sidebar\nprops: isOpen\nhook: useAnalysis (review count)\nmotion: width spring 240↔60\nlayoutId: sidebar-indicator"]

    AL --> Header_c["Header\nstate: cmdOpen, shortcutsOpen\nhook: useDarkMode\n3× useEffect keydown listeners"]

    Header_c --> CommandPalette_c["CommandPalette\nprops: isOpen, onClose\nstate: query, activeIdx\neffect: keydown (arrows, enter, esc)\nfilter: NAV_ITEMS by query"]

    Header_c --> ShortcutsModal_c["ShortcutsModal\nprops: isOpen, onClose\neffect: Escape key handler\ntable: grouped shortcuts"]

    AL --> Outlet_c["Outlet\n(active page renders here)"]

    Outlet_c --> Dashboard_c["Dashboard\nstate: lastAnalyzedAt\nhook: useAnalysis"]
    Dashboard_c --> WelcomeHeader_c["WelcomeHeader\nprops: lastAnalyzed\ncomputes: greeting, date, timeAgo"]
    Dashboard_c --> ExecSummary_c["ExecutiveSummaryCard\nhook: useAnalysis\ncalls: generateExecutiveSummary"]
    Dashboard_c --> KpiCard_c["KpiCard ×4\nprops: label, value, icon, color, trend\nhook: useCounter (RAF animation)"]
    Dashboard_c --> HealthIndicator_c["HealthIndicator\nhook: useAnalysis\ncomputes: positive rate, coverage, velocity"]
    Dashboard_c --> Charts_c["Recharts ×6\nAreaChart · PieChart · BarChart\nLineChart · RadarChart (mock data)"]

    Outlet_c --> ReviewInput_c["ReviewInput\nstate: text, analyzing\nhook: useAnalysis\nhook: useToast"]
    ReviewInput_c --> PreviewLine_c["PreviewLine ×N\nprops: text\ncalls: classifySentiment\nrenders: colored badge"]

    Outlet_c --> ReviewUpload_c["ReviewUpload\nstate: file, parsed, status, progress\nhook: useAnalysis\ncalls: parseCSV, FileReader"]

    Outlet_c --> Reviews_c["Reviews\nstate: search, sentiment, source\n  rating, dateFrom, dateTo\n  sort, page, compact, loading\nhook: useAnalysis, useToast\nmemo: filtered results"]
    Reviews_c --> StarDisplay_c["StarDisplay\nprops: rating\nrenders: 5 star icons"]

    Outlet_c --> Export_c["Export\nstate: selected, status, enabledSections\nhook: useAnalysis, useToast\ncalls: window.print, Blob download"]
```

---

## 2. AppLayout Component

```mermaid
graph LR
    subgraph AppLayout["AppLayout.tsx"]
        subgraph State["Local State"]
            SO["sidebarOpen: boolean\ninitial: true"]
        end

        subgraph Hooks["Hooks"]
            UIM["useIsMobile()\nmatchMedia max-width:767px\nMediaQueryList listener"]
            UL["useLocation()\nlistens to pathname changes"]
        end

        subgraph Effects["useEffect"]
            EF1["[location.pathname, isMobile]\nisMobile → setSidebarOpen(false)"]
        end

        subgraph Computed["Computed"]
            CM["contentMargin\nisMobile ? 0\n: sidebarOpen ? 240 : 60"]
        end

        subgraph Render["Render Output"]
            DIV["<div className='flex h-screen'>"]
            DIV --> SB["<Sidebar isOpen={sidebarOpen} />"]
            DIV --> MAIN["<motion.div\nanimate={{ marginLeft: contentMargin }}\ntransition: spring"]
            MAIN --> HDR["<Header\nsidebarOpen\nonToggle={() => setSidebarOpen(!sidebarOpen)} />"]
            MAIN --> CONTENT["<main role='main' id='main-content'>\n<AnimatePresence mode='wait'>\n  <motion.div key={location.pathname}>\n    <Outlet />\n  </motion.div>\n</AnimatePresence>"]

            subgraph Mobile["Mobile Backdrop (AnimatePresence)"]
                BD["<motion.div\ninitial: opacity 0\nanimate: opacity 1\nexit: opacity 0\nonClick: setSidebarOpen(false)>"]
            end
        end
    end

    SO --> CM
    UIM -->|"isMobile"| EF1
    UL -->|"pathname"| EF1
    EF1 --> SO
    CM --> MAIN
```

---

## 3. Sidebar Component

```mermaid
graph TD
    subgraph Sidebar["Sidebar.tsx — props: { isOpen }"]

        subgraph NavData["Static Data"]
            NAV["navItems[]\n{ to, label, icon, group }"]
            SEC["secondaryItems[]\n{ to, label, icon }"]
            GRP["groups[]\n{ key, label }"]
        end

        subgraph Hooks["Hooks"]
            UA["useAnalysis()\n→ reviews.length (for badge)"]
            UL["useLocation()\n→ pathname for active state"]
        end

        subgraph Motion["Framer Motion"]
            MW["motion.aside\nvariants: open(240) / closed(60)\nanimate: isOpen ? 'open' : 'closed'\ntransition: spring(stiffness:280, damping:25)"]
        end

        subgraph NavItem["Per NavItem"]
            NL["NavLink to={item.to}\nclassName: isActive → apply active styles"]
            ICON["item.icon — Lucide component\nstyle: color transitions"]
            LABEL["motion.span\nvariants: open(opacity:1) / closed(opacity:0, x:-8)\ntransitionEnd: display none"]
            ACTIVE["layoutId='sidebar-indicator'\nshared layout animation\nslides between active items"]
        end

        subgraph Footer["Footer (isOpen only)"]
            BADGE["Badge: {reviews.length} reviews\ncalculated from useAnalysis()"]
            BRAND["'AI Feedback'\nZap icon"]
        end
    end

    NavData --> NavItem
    Hooks --> NavItem
    Hooks --> Footer
    Motion --> NavItem
```

---

## 4. Header Component

```mermaid
graph TD
    subgraph Header["Header.tsx (408 lines — should be split)"]

        subgraph HeaderState["State"]
            CS["cmdOpen: boolean"]
            SS["shortcutsOpen: boolean"]
        end

        subgraph HeaderHooks["Hooks"]
            DM["useDarkMode() → { isDark, toggle }"]
            UA["useAnalysis() → reviews.length"]
            NAV["useNavigate()"]
        end

        subgraph KeyListeners["useEffect × 3 (should be 1)"]
            KL1["Listener 1: ⌘K → setCmdOpen\nEscape → close both"]
            KL2["Listener 2: ⌘D/I/E → navigate\n(quick-nav shortcuts)"]
            KL3["Listener 3: ? → setShortcutsOpen\n(when not in input/textarea)"]
        end

        subgraph CommandPalette["CommandPalette (embedded)"]
            CPState["state: query, activeIdx"]
            CPEffect["useEffect: ArrowUp/Down/Enter/Esc"]
            CPFilter["useMemo: filter NAV_ITEMS by query"]
            CPRender["Input + AnimatePresence results list"]
        end

        subgraph ShortcutsModal["ShortcutsModal (embedded)"]
            SMEffect["useEffect: Escape to close"]
            SMRender["Grouped keyboard shortcuts table"]
        end

        subgraph HeaderRender["Render Output"]
            HR["<header>\n  <button> hamburger toggle\n  <h1> page title (from route)\n  <button> ? shortcuts\n  <button> dark mode\n  <span> review count badge\n  <button> ⌘K command palette trigger"]
        end
    end

    HeaderState --> HeaderRender
    HeaderHooks --> HeaderRender
    KeyListeners --> HeaderState
    CommandPalette --> HR
    ShortcutsModal --> HR
```

---

## 5. Dashboard Component (Composition View)

```mermaid
graph TD
    subgraph Dashboard["Dashboard.tsx (785 lines)"]

        subgraph DashHooks["Hooks"]
            DUA["useAnalysis()\n→ reviews, themes, painPoints"]
            DNav["useNavigate()"]
        end

        subgraph DashState["State"]
            DLS["lastAnalyzedAt: number | null\n(tracks _lastAnalyzed module var)"]
        end

        subgraph DashEffect["useEffect([reviews.length])"]
            DFX["When reviews.length changes\n_lastAnalyzed = Date.now()\nsetLastAnalyzedAt(Date.now())"]
        end

        subgraph Sub1["WelcomeHeader"]
            WH_P["props: lastAnalyzed"]
            WH_C["Computes:\n- hour → Sun/Sunset/Moon icon\n- greeting: Good morning/afternoon/evening\n- formatted date: 'Sunday, 20 July'\n- timeAgo(lastAnalyzed) → relative string"]
        end

        subgraph Sub2["ExecutiveSummaryCard"]
            ES_H["hook: useAnalysis"]
            ES_C["calls: generateExecutiveSummary(reviews, themes, painPoints)"]
            ES_R["Renders: prose paragraph\nCopy-to-clipboard button\n'AI Generated' badge"]
        end

        subgraph Sub3["KpiCard"]
            KP_P["props: label, rawValue, icon, color, format, trend, trendLabel"]
            KP_H["hook: useCounter(rawValue, 1200)\n→ RAF-animated number 0→value"]
            KP_R["Renders: icon, animated number,\npercentage or plain, trend arrow"]
        end

        subgraph Sub4["HealthIndicator"]
            HI_H["hook: useAnalysis"]
            HI_C["Computes:\n- positiveRate: pos/total\n- responseCoverage: reviewed sources / 5\n- issueVelocity: criticalPainPoints"]
            HI_R["Gradient progress bar + 3 stat cells"]
        end

        subgraph Sub5["useCounter"]
            UC_P["params: target, duration=1200"]
            UC_R["useRef(rafId)\nuseEffect: RAF loop\n  progress = min(elapsed/duration, 1)\n  displayed = Math.round(eased * target)\n  requestAnimationFrame(animate)\nreturns: current (displayed value)"]
        end

        subgraph MockCharts["Charts (hardcoded mock data — known issue)"]
            MC1["AreaChart: sentimentTrendData (6 months)"]
            MC2["PieChart: sentiment split from real useAnalysis"]
            MC3["BarChart: sourceDistribution (mock)"]
            MC4["LineChart: npsData (mock)"]
            MC5["PieChart: ratingDistribution (mock)"]
        end
    end

    DashHooks --> DashEffect
    DashEffect --> DashState
    DashState --> Sub1
    DashHooks --> Sub2 & Sub3 & Sub4 & MockCharts
    Sub3 --> Sub5
```

---

## 6. UI Primitive Components

```mermaid
graph LR
    subgraph Button["Button.tsx"]
        B_V["variants:\ndefault · outline · ghost\nsecondary · destructive · link"]
        B_S["sizes: sm · default · lg · icon"]
        B_I["impl: cva() (class-variance-authority)\ncn() for className merge"]
    end

    subgraph Card["Card.tsx"]
        C_C["Card — rounded-2xl border shadow-sm"]
        C_H["CardHeader — flex col gap-1.5 p-6"]
        C_T["CardTitle — font-semibold leading-none"]
        C_D["CardDescription — text-sm muted"]
        C_CO["CardContent — p-6 pt-0"]
    end

    subgraph Badge["Badge.tsx"]
        BA_V["variants:\npositive (green)\nnegative (red)\nneutral (gray)\nsecondary (muted)"]
        BA_I["cva() base: inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"]
    end

    subgraph Skeleton["skeleton.tsx"]
        SK["Skeleton\n→ animate-pulse rounded-md\n→ bg-[var(--color-muted)]"]
        SKC["SkeletonCard → Card + Skeleton rows"]
        SKCH["SkeletonChart → Skeleton bars"]
        SKP["SkeletonPage → grid of SkeletonCard"]
        ES["EmptyState\nprops: icon, title, description\n  actionLabel?, actionTo?\nrenders: icon box + text + optional Link CTA"]
    end

    subgraph Toast["toast.tsx + toast-context.ts"]
        TC["toast-context.ts\nToast interface\nToastContextValue interface\ncreateContext with no-op defaults"]
        TP2["ToastProvider\nuseReducer(reducer, [])\naddToast: dispatch ADD + setTimeout REMOVE\ndismiss: dispatch REMOVE\nToastContext.Provider value={addToast,toasts,dismiss}"]
        TCO["ToastContainer\nuseContext(ToastContext)\nAnimatePresence over toasts[]\nmotion.div: slide + fade\n3 variants: icon + border + accent bar"]
    end
```

---

## 7. Analysis Pages — Shared Pattern

Every analysis page follows this exact structure:

```mermaid
graph TD
    subgraph AnalysisPagePattern["Analysis Page Pattern (Sentiment · Themes · PainPoints · Recommendations · Roadmap)"]

        subgraph Imports["Imports"]
            I1["Recharts components"]
            I2["Lucide icons"]
            I3["Card, Badge, Button (UI kit)"]
            I4["CHART, tooltipStyle, axisStyle (chartColors)"]
            I5["useAnalysis (real data)"]
            I6["mockData (chart arrays — partial)"]
            I7["SkeletonPage"]
            I8["motion from framer-motion"]
        end

        subgraph LocalState["Local State"]
            LS1["loading: boolean (true)"]
            LS2["page-specific UI state\n(selected tab, expanded card, etc.)"]
        end

        subgraph LoadEffect["useEffect([], [])"]
            LE["setTimeout(() => setLoading(false), 600)\nreturn clearTimeout"]
        end

        subgraph EarlyReturn["Early Return"]
            ER["if (loading) return <SkeletonPage />"]
        end

        subgraph PageRender["Page Render"]
            PR["<motion.div\ninitial: opacity 0, y 8\nanimate: opacity 1, y 0\ntransition: duration 0.25, easeInOut>"]
            PR --> GRID["Stat cards grid\n(from useAnalysis or mock)"]
            PR --> CHARTS["Chart grid\n(ResponsiveContainer + chart type)"]
            PR --> DETAIL["Detail cards / table\n(from useAnalysis)"]
        end
    end

    Imports --> LocalState
    LocalState --> LoadEffect
    LoadEffect --> EarlyReturn
    EarlyReturn --> PageRender
```

---

## 8. Props and Data Flow Map

```mermaid
graph LR
    subgraph DataSources["Data Sources"]
        MS["_state module singleton\n{ reviews[], themes[], painPoints[] }"]
        MD["mockData.ts\nsentimentTrendData\nratingDistribution\nnpsData\nmockFeatures"]
    end

    subgraph HookBoundary["Hook Boundary"]
        UA["useAnalysis()\nreturns { ...state, analyzeText, reset }"]
    end

    subgraph DirectConsumers["Components using useAnalysis()"]
        Dash2["Dashboard → reviews, themes, painPoints"]
        RI2["ReviewInput → analyzeText"]
        RU2["ReviewUpload → analyzeText, reset"]
        Rev["Reviews → reviews"]
        Exp["Export → reviews, themes, painPoints"]
        ES2["ExecutiveSummaryCard → reviews, themes, painPoints"]
        HI2["HealthIndicator → reviews, painPoints"]
        SB2["Sidebar → reviews.length"]
    end

    subgraph MockConsumers["Components using mockData directly (known issue)"]
        SAM["SentimentAnalysis → sentimentTrendData, ratingDistribution"]
        RdM["Roadmap → mockFeatures"]
        RecM["Recommendations → mockFeatures"]
    end

    MS --> UA
    UA --> DirectConsumers
    MD --> MockConsumers
```
