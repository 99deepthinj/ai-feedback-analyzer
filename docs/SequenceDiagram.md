# Sequence Diagrams — AI Feedback Analyzer

Every major user flow represented as a sequence diagram. These trace exact code paths through the component tree.

---

## 1. App Initialization Sequence

From URL entry to first paint.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Vercel as "Vercel CDN"
    participant SW as "Service Worker (sw.js)"
    participant React as "React Runtime"
    participant Router as "React Router"
    participant Layout as "AppLayout"
    participant Dashboard

    User->>Browser: Navigate to /dashboard
    Browser->>Vercel: GET /dashboard
    Vercel-->>Browser: 200 index.html (SPA fallback)
    Browser->>Vercel: GET /assets/index.js (83KB)
    Browser->>Vercel: GET /assets/vendor-react.js (216KB)
    Note over Browser,Vercel: Parallel chunk fetches

    Browser->>SW: Attempt service worker registration (PROD only)
    SW-->>Browser: Registered

    Browser->>React: ReactDOM.createRoot('#root')
    React->>React: Render <StrictMode><ToastProvider><App />
    React->>Router: BrowserRouter initializes, reads window.location
    Router->>Router: Match /dashboard → AppLayout > Dashboard
    Router->>Layout: Render <AppLayout />
    Layout->>Layout: useIsMobile() — matchMedia('(max-width:767px)')
    Layout->>Layout: useState(sidebarOpen: true)
    Layout-->>Browser: Paint sidebar + header shell

    Layout->>Dashboard: Render <Dashboard /> via <Outlet />
    Dashboard->>Dashboard: useAnalysis() → useState(_state) — reads module singleton
    Note over Dashboard: _state preloaded with 15 mock reviews
    Dashboard->>Dashboard: useCounter(target, 1200) — RAF animation loop starts
    Dashboard-->>Browser: Paint KPI cards, charts, exec summary

    Browser-->>User: App visible (~1 second on fast 3G)
```

---

## 2. Text Input Analysis Sequence

User pastes reviews and clicks Analyze.

```mermaid
sequenceDiagram
    actor User
    participant Textarea as "ReviewInput.tsx"
    participant Preview as "PreviewLine components"
    participant Engine as "analysisEngine.ts"
    participant State as "useAnalysis singleton"
    participant Router as "React Router navigate()"
    participant Dashboard

    User->>Textarea: Pastes 50 review lines
    Textarea->>Textarea: setText(value) — controlled input update

    loop For each line > 20 chars (on every keystroke)
        Textarea->>Preview: Render <PreviewLine text={line} />
        Preview->>Engine: classifySentiment(text) — synchronous
        Engine-->>Preview: 'positive' | 'negative' | 'neutral'
        Preview-->>Textarea: Render colored badge inline
    end

    User->>Textarea: Click "Analyze Reviews"
    Textarea->>Textarea: setAnalyzing(true)
    Textarea->>Textarea: setTimeout(1800ms) — simulated delay

    Note over Textarea,Engine: After 1800ms...

    Textarea->>Engine: parseReviewsFromText(text)
    Engine->>Engine: split('\n'), filter < 20 chars
    loop For each valid line
        Engine->>Engine: classifySentiment(line) → Sentiment
        Engine->>Engine: detectThemes(line) → string[]
        Engine->>Engine: estimateRating(line, sentiment) → number
        Engine->>Engine: Build Review object { id, text, source, date, rating, sentiment, themes }
    end
    Engine-->>Textarea: Review[] (parsed)

    Textarea->>State: analyzeText(rawText)
    State->>Engine: parseReviewsFromText(rawText)
    State->>Engine: buildThemeSummary([...mockReviews, ...parsed])
    Engine-->>State: Theme[]
    State->>Engine: detectPainPoints([...mockReviews, ...parsed])
    Engine-->>State: PainPoint[]
    State->>State: _state = { reviews, themes, painPoints, isAnalyzed: true }
    State->>State: setState(_state) — triggers re-render of ReviewInput

    Textarea->>Textarea: setAnalyzing(false), showToast('Analysis complete')
    Textarea->>Router: navigate('/dashboard')

    Router->>Dashboard: Mount Dashboard component
    Dashboard->>State: useAnalysis() → useState(_state) — reads updated singleton
    Dashboard-->>User: Dashboard renders with real analysis data
```

---

## 3. CSV File Upload Sequence

```mermaid
sequenceDiagram
    actor User
    participant DropZone as "ReviewUpload.tsx"
    participant FR1 as "FileReader (preview)"
    participant ParseCSV as "parseCSV()"
    participant FR2 as "FileReader (analyze)"
    participant State as "useAnalysis"
    participant Toast as "ToastContainer"

    User->>DropZone: Drop file.csv onto drop zone
    DropZone->>DropZone: handleDrop(e) — e.preventDefault()
    DropZone->>DropZone: processFile(file)
    DropZone->>DropZone: Validate: file.name.match(/\.(csv|txt)$/i)
    DropZone->>DropZone: setStatus('reading'), setProgress(20)

    DropZone->>FR1: new FileReader().readAsText(file)
    FR1-->>DropZone: onload event — e.target.result = fullText

    DropZone->>ParseCSV: parseCSV(fullText)
    ParseCSV->>ParseCSV: split('\n'), slice(1) — skip header
    loop For each CSV row
        ParseCSV->>ParseCSV: Match /"([^"]{20,})"/ — quoted long cell
        ParseCSV->>ParseCSV: Fallback: split(',').find(c => c.length > 20)
    end
    ParseCSV-->>DropZone: string[] — review texts

    DropZone->>DropZone: setParsed({ name, size, rowCount, preview[0..3] })
    DropZone->>DropZone: setProgress(60), setStatus('idle')
    DropZone-->>User: Show file preview card with row count

    User->>DropZone: Click "Analyze N Reviews"
    DropZone->>DropZone: setStatus('analyzing'), setProgress(70)

    DropZone->>FR2: new FileReader().readAsText(file)
    Note over FR2: File read AGAIN — second disk read
    FR2-->>DropZone: onload — fullText again

    DropZone->>ParseCSV: parseCSV(fullText) — parse again
    DropZone->>DropZone: setProgress(90), setTimeout(800ms)

    Note over DropZone,State: After 800ms...
    DropZone->>State: analyzeText(rows.join('\n'))
    State-->>DropZone: count (number of reviews added)

    DropZone->>DropZone: setAddedCount(count), setProgress(100), setStatus('done')
    DropZone->>Toast: addToast({ title: 'Upload complete', variant: 'success' })
    Toast-->>User: Success toast appears bottom-right, auto-dismisses 4s
    DropZone-->>User: Success banner with review count
```

---

## 4. Dark Mode Toggle Sequence

```mermaid
sequenceDiagram
    actor User
    participant Header
    participant Hook as "useDarkMode()"
    participant LS as "localStorage"
    participant DOM as "document.documentElement"
    participant CSS as "CSS Variable Resolution"
    participant Components as "All Components"

    Note over Hook: On initial load (before first render)
    Hook->>LS: localStorage.getItem('theme')
    alt stored = 'dark'
        LS-->>Hook: 'dark'
        Hook->>Hook: useState(true) — initializer
    else stored = null
        LS-->>Hook: null
        Hook->>Hook: matchMedia('prefers-color-scheme:dark').matches
        Hook->>Hook: useState(result)
    end

    Hook->>DOM: classList.add/remove('dark') — in useEffect
    DOM->>CSS: .dark { --color-background: #09090b; ... } activated

    Note over Components: Components reference var(--color-card) etc.
    Components-->>User: Correct theme renders before first paint — no flash

    User->>Header: Click moon/sun icon
    Header->>Hook: toggle()
    Hook->>Hook: setIsDark(d => !d)
    Hook->>Hook: useEffect fires (isDark dependency)
    Hook->>DOM: classList.toggle('dark')
    Hook->>LS: localStorage.setItem('theme', 'dark'|'light')

    DOM->>CSS: All CSS custom properties swap values
    Note over CSS,Components: No React re-renders triggered
    Components-->>User: Theme switches instantly — 0ms flash
```

---

## 5. Command Palette Sequence (⌘K)

```mermaid
sequenceDiagram
    actor User
    participant Window as "window (global)"
    participant Header as "Header.tsx"
    participant Palette as "CommandPalette component"
    participant Router as "useNavigate()"

    User->>Window: Press ⌘K (or Ctrl+K)
    Window->>Header: keydown event fires
    Header->>Header: handler checks: e.metaKey && e.key === 'k'
    Header->>Header: e.preventDefault()
    Header->>Header: setCmdOpen(true)

    Header->>Palette: Render <CommandPalette isOpen={true} />
    Palette->>Palette: useEffect — window.addEventListener('keydown', palHandler)
    Palette-->>User: Modal appears with search input focused

    User->>Palette: Types "dash"
    Palette->>Palette: setQuery('dash')
    Palette->>Palette: Filter NAV_ITEMS where item.label.toLowerCase().includes('dash')
    Palette->>Palette: setActiveIdx(0) — reset selection
    Palette-->>User: Shows "Dashboard" result highlighted

    User->>Palette: Press Enter (or ArrowDown then Enter)
    Palette->>Palette: e.key === 'Enter' — take items[activeIdx]
    Palette->>Palette: setCmdOpen(false)
    Palette->>Router: navigate('/dashboard')
    Router-->>User: Navigates to /dashboard, palette closes

    alt User presses Escape instead
        User->>Palette: Press Escape
        Palette->>Header: Escape handler → setCmdOpen(false)
        Palette-->>User: Modal closes, focus returns to page
    end
```

---

## 6. Export Flow Sequence

```mermaid
sequenceDiagram
    actor User
    participant Export as "Export.tsx"
    participant State as "useAnalysis()"
    participant Toast as "useToast()"
    participant DOM as "Browser DOM/API"
    participant File as "File System"

    User->>Export: Select "CSV" format, click "Export CSV"
    Export->>State: const { reviews } = useAnalysis()
    State-->>Export: Review[] (current analysis state)

    Export->>Export: Build header: ['ID','Text','Source','Date','Rating','Sentiment','Themes']
    loop For each review
        Export->>Export: Escape quotes: text.replace(/"/g, '""')
        Export->>Export: Build CSV row array
    end
    Export->>Export: Join rows with '\n' → csvString

    Export->>DOM: new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    Export->>DOM: URL.createObjectURL(blob) → objectURL
    Export->>DOM: document.createElement('a')
    Export->>DOM: a.href = objectURL, a.download = 'feedback-reviews-2025-01-01.csv'
    Export->>DOM: document.body.appendChild(a)
    Export->>DOM: a.click() — triggers browser save dialog
    Export->>DOM: document.body.removeChild(a)
    Export->>DOM: setTimeout(100ms) → URL.revokeObjectURL(objectURL)

    Export->>Toast: addToast({ title: 'CSV downloaded', description: '150 reviews exported', variant: 'success' })
    Toast-->>User: Success notification, 4s auto-dismiss

    DOM-->>File: Browser saves reviews-2025-01-01.csv to Downloads

    alt User selects PDF instead
        User->>Export: Select "PDF", click "Print / Save PDF"
        Export->>Toast: addToast({ title: 'Opening print dialog', variant: 'default' })
        Export->>Export: setTimeout(400ms)
        Export->>DOM: window.print()
        DOM->>DOM: Apply @media print CSS\n(hide sidebar, header, nav)\n(full-width content)
        DOM-->>User: Browser print dialog opens
        User->>File: Select "Save as PDF" — browser generates PDF
    end
```

---

## 7. Toast Notification Sequence

```mermaid
sequenceDiagram
    participant Page as "Any Page Component"
    participant Hook as "useToast()"
    participant Context as "ToastContext"
    participant Provider as "ToastProvider (useReducer)"
    participant Container as "ToastContainer"
    participant User

    Page->>Hook: const { addToast } = useToast()
    Hook->>Context: useContext(ToastContext)
    Context-->>Hook: { addToast, toasts, dismiss }

    Page->>Hook: addToast({ title: 'Done', variant: 'success' })
    Hook->>Provider: addToast called (via context)
    Provider->>Provider: id = String(++_counter) → '1'
    Provider->>Provider: dispatch({ type: 'ADD', toast: { id:'1', title:'Done', variant:'success' } })
    Provider->>Provider: reducer: state = [...state, toast]
    Provider->>Provider: setTimeout(4000ms, dispatch REMOVE id:'1'))

    Provider->>Context: Re-render context with new toasts[]
    Context->>Container: <ToastContainer /> receives updated toasts
    Container-->>User: Toast animates in (opacity 0→1, x 32→0) via Framer Motion

    Note over Provider,Container: After 4000ms...
    Provider->>Provider: dispatch({ type: 'REMOVE', id: '1' })
    Provider->>Provider: reducer: state = state.filter(t => t.id !== '1')
    Container-->>User: Toast animates out via AnimatePresence exit prop

    alt User clicks dismiss (X button)
        User->>Container: Click X on toast id:'1'
        Container->>Hook: dismiss('1')
        Hook->>Provider: dismiss called (via context)
        Provider->>Provider: dispatch({ type: 'REMOVE', id: '1' })
        Note over Provider: setTimeout still pending — will dispatch REMOVE again\n(harmless — filter finds nothing to remove)
    end
```

---

## 8. Service Worker Cache Flow

```mermaid
sequenceDiagram
    participant Browser
    participant SW as "sw.js (Service Worker)"
    participant Cache as "CacheStorage 'aifa-v1'"
    participant Network as "Vercel CDN"

    Note over Browser,SW: Install event (first visit or SW update)
    SW->>Cache: caches.open('aifa-v1')
    SW->>Network: fetch('/')
    SW->>Network: fetch('/dashboard')
    SW->>Network: fetch('/manifest.json')
    SW->>Network: fetch('/app-logo.svg')
    Network-->>SW: Responses
    SW->>Cache: cache.addAll(PRECACHE) — store all 4 assets
    SW->>SW: self.skipWaiting() — activate immediately

    Note over Browser,SW: Activate event
    SW->>Cache: caches.keys() → ['aifa-v1', 'aifa-v0' (old)]
    SW->>Cache: Delete 'aifa-v0' (old cache)
    SW->>SW: clients.claim() — take control of all tabs

    Note over Browser,SW: Navigation request (user clicks link)
    Browser->>SW: fetch(mode='navigate', url='/sentiment')
    SW->>Network: fetch('/sentiment') — network-first for navigation
    alt Network succeeds
        Network-->>SW: 200 index.html (SPA fallback)
        SW-->>Browser: index.html — React Router handles /sentiment client-side
    else Network fails (offline)
        SW->>Cache: caches.match('/') — fallback to cached root
        Cache-->>SW: Cached index.html
        SW-->>Browser: Cached app shell — app works offline
    end

    Note over Browser,SW: Static asset request (JS chunk)
    Browser->>SW: fetch('/assets/vendor-charts.js')
    SW->>Cache: caches.match(request) — check cache first
    alt Cached
        Cache-->>SW: Cached vendor-charts.js
        SW-->>Browser: Serve from cache — instant
    else Not cached
        SW->>Network: fetch(request)
        Network-->>SW: vendor-charts.js
        SW->>Cache: cache.put(request, response.clone())
        SW-->>Browser: New response
    end
```

---

## 9. Sidebar Animation Sequence

```mermaid
sequenceDiagram
    actor User
    participant Header
    participant AppLayout
    participant Framer as "Framer Motion"
    participant Sidebar
    participant Content as "Main Content Area"

    User->>Header: Click hamburger / chevron icon
    Header->>AppLayout: setSidebarOpen(prev => !prev)
    AppLayout->>AppLayout: sidebarOpen = false (was true)
    AppLayout->>AppLayout: contentMargin = isMobile ? 0 : 60 (collapsed)

    AppLayout->>Framer: <motion.div animate={{ marginLeft: 60 }}>
    Framer->>Content: Animate marginLeft 240 → 60 (spring physics)

    AppLayout->>Sidebar: Pass isOpen={false}
    Sidebar->>Framer: <motion.aside animate="closed">
    Framer->>Sidebar: Animate width 240 → 60 (spring)

    loop For each nav item label
        Sidebar->>Framer: <motion.span variants={labelVariants} animate="closed">
        Framer->>Sidebar: Animate opacity 1→0, x 0→-8\ntransitionEnd: display 'none'
    end

    Sidebar-->>User: Labels hidden, icons visible, sidebar collapsed to 60px

    Note over User,Sidebar: User navigates on mobile
    User->>Content: Click a page link (mobile)
    Content->>AppLayout: navigate('/sentiment') via React Router
    AppLayout->>AppLayout: useEffect([location.pathname, isMobile])\nisMobile=true → setSidebarOpen(false)
    AppLayout->>Framer: AnimatePresence — backdrop exit animation
    Framer-->>User: Backdrop fades out, sidebar closes
```
