# Technical Presentation Script — AI Feedback Analyzer

A structured walkthrough for a 15-minute demo to engineers or product managers. Every section is self-contained — you can cut it short or dive deeper on any slide without losing the thread.

---

## Pre-Talk Checklist

Before you begin:

- [ ] App is open in a browser tab: `/dashboard`
- [ ] Dark mode is ON (looks better on a projector)
- [ ] Sidebar is OPEN (not collapsed)
- [ ] A second tab has the GitHub repo open
- [ ] If demoing live analysis: have text copied (use the Swiggy dataset, it's the most recognizable)
- [ ] Terminal closed (you don't need it during the talk)
- [ ] Incognito mode if you want to demo first-visit experience

---

## Opening (0:00 – 1:00)

**Slide: Problem statement**

> "I want to start with a scenario that every PM in this room has been in.
>
> You get an email from your CEO on a Monday morning. They've just read through 50 one-star App Store reviews and they're concerned. They ask: 'What are customers actually complaining about? What should we fix first?'
>
> You have 200 reviews across G2, Trustpilot, the App Store, and the Play Store. What do you do?
>
> If you're at a well-funded company, you have Medallia or Dovetail — 30 thousand dollars a year, a six-week onboarding, and a dedicated analyst. If you're at a startup, you open a spreadsheet and start reading.
>
> That is the problem I set out to solve."

**[Click to next slide]**

---

## What It Does (1:00 – 3:00)

**Slide: Feature overview — navigate the app live**

> "Let me show you the app. This is the Dashboard — you're seeing a real analysis of 150 customer reviews from Indian quick-commerce apps: Zepto, Swiggy, Zomato, Blinkit."

**[Point to KPI cards]**

> "The top row gives you the headline numbers — total reviews processed, average rating, sentiment distribution, how many theme clusters were detected.

**[Point to Executive Summary card]**

> "This card generates a written executive summary from the data — one paragraph a PM could paste directly into a Slack message to their CEO. No editing needed."

**[Navigate to /sentiment — pause for page to load]**

> "The Sentiment Analysis page breaks down positive, negative, and neutral by source and over time. The chart on the right is a six-month trend — you can see whether satisfaction is improving or deteriorating."

**[Navigate to /themes]**

> "Theme Detection clusters reviews by product area — Performance, Onboarding, Mobile, Pricing, and so on. The bar chart shows which themes appear most, and you can expand any card to see the actual quotes behind it."

**[Navigate to /pain-points]**

> "Pain Points are the negative themes ranked by severity. Each one has an estimated user impact and a recommended action. This is the list you bring into a sprint planning meeting."

**[Navigate to /recommendations]**

> "Recommendations uses RICE scoring — Reach, Impact, Confidence, Effort — to prioritize features. The score is calculated from the pain point data, not pulled from a spreadsheet. You can see the breakdown for each feature."

**[Navigate to /roadmap]**

> "And the Roadmap puts all of that into a visual plan — Kanban, timeline, or Gantt. These three views are the same data rendered differently for different audiences."

**Transition:**

> "So that's the product. Now let me tell you how it's built."

---

## Architecture (3:00 – 6:00)

**Slide: Architecture diagram (use ArchitectureDiagram.md diagram 1 or 2)**

> "The architecture is deliberately simple. This is a fully client-side single-page application. There is no backend. No database. No API keys. No data leaves the browser.

> The tech stack is React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router v7, Recharts for charts, and Framer Motion for animation.

> The app ships as a set of static files hosted on Vercel's CDN edge network. A service worker caches the app shell for offline use.

> Data flow is one-directional. The user inputs reviews. A TypeScript analysis engine runs in the browser. Results are stored in a module-level singleton. React components read from that singleton. When the analysis updates, the singleton updates and the UI re-renders."

**[Open DevTools Network tab briefly — show the chunks]**

> "One thing worth noting about the bundle. The total uncompressed JavaScript is about 930 kilobytes. But the initial load is 83 kilobytes. That's because Recharts — which powers the eight chart types in the app — is 393 kilobytes on its own. It loads lazily the first time you navigate to a chart page, and is cached after that.

> The code splitting is done with Vite's manualChunks configuration and React.lazy() wrapping all 12 secondary pages. The initial bundle is just the app shell, the Dashboard, and the routing layer."

---

## The Analysis Engine (6:00 – 9:00)

**Slide: Analysis engine — open analysisEngine.ts in editor if available**

> "The core of the application is the analysis engine — a TypeScript module with four stages.

> **Stage 1: Text parsing.** The engine takes a raw string, splits on newlines, filters out lines under 20 characters, and creates a Review object for each valid line. Each review gets a deterministic ID, a timestamp, and a source label.

> **Stage 2: Sentiment classification.** For each review, the engine scores the text against a list of 40 positive keywords and 40 negative keywords. If the score is positive, the review is classified as positive. Negative score, negative. Zero, neutral. Simple — but it works well on review platform text, which is typically clearly positive or clearly negative.

> **Stage 3: Theme detection.** The engine matches the review text against nine product domain keyword sets: Onboarding, UI/UX, Performance, Mobile, Integrations, Analytics, Support, Pricing, AI Features. A review can match multiple themes. The results are aggregated across all reviews to build the theme summary.

> **Stage 4: Pain point identification.** Seven regex patterns — things like 'crashed', 'can't login', 'charged twice' — are matched against negative-sentiment reviews. Each match creates a pain point with a severity level and an estimated affected user count.

> The whole pipeline runs in under 50 milliseconds for 100 reviews."

**[Pause]**

> "I want to be honest about what this is and isn't. It's keyword matching, not large language model inference. On clearly positive or clearly negative reviews — which is most of what you get from review platforms — it's quite accurate. On mixed-sentiment reviews like 'I love the interface but the performance is terrible,' the score depends on which words appear first.

> The architecture is designed to swap in Claude or OpenAI when you want real semantic understanding. Replacing the classifySentiment function with a Claude API call requires changing one function, costs roughly a cent per 100 reviews, and gets you proper semantic NLP. I documented the migration path and cost estimates in the README."

---

## Engineering Deep-Dive (9:00 – 12:00)

**Slide: Three interesting engineering problems**

Choose one or two of these depending on your audience and time.

---

### Problem 1: Bundle size

> "Recharts and its D3 dependencies are 393 kilobytes. React DOM plus React Router are 216 kilobytes. Framer Motion is 33 kilobytes. Naively bundled, that's a nine-second first load on a 3G connection.

> I solved it in two stages. First, Vite's manualChunks function groups dependencies into named chunks with separate content hashes — so a change to app code doesn't invalidate the Recharts cache. Second, React.lazy() wraps all 12 secondary pages so they only download when the user actually navigates to them.

> The result: 83 kilobytes initial bundle. Chart libraries load on first visit to a chart page and are browser-cached after that."

---

### Problem 2: Dark mode without React re-renders

> "Most dark mode implementations store the theme in React state and use a className prop. The problem: on initial load, React hasn't rendered yet, so you get a flash of the wrong theme before the correct one applies.

> I built dark mode on CSS custom properties. Design tokens live in index.css as CSS variables — things like `--color-background` and `--color-foreground`. The .dark class on document.documentElement overrides those values. Switching themes is one classList toggle. Zero React re-renders. Zero flash.

> The OS preference is read once at initialization via window.matchMedia, persisted to localStorage, and applied before first paint."

---

### Problem 3: Shared layout animation

> "The sidebar has a row of navigation items. When you navigate between routes, the active item changes. I wanted the highlight indicator to slide smoothly between items rather than disappearing and reappearing.

> Framer Motion's layoutId makes this trivial. The active nav item renders a motion.div with layoutId='sidebar-indicator'. When you navigate, the old indicator's element unmounts and the new one mounts in a different position. Framer Motion detects that the same layoutId appeared in a new location and animates between them automatically. It's four lines of code."

**[Demo this live — click between sidebar items slowly and point to the sliding indicator]**

---

## What I'd Do Differently (12:00 – 13:30)

**Slide: Known limitations**

> "I want to be transparent about the gaps, because they're as important to understand as what works.

> **State management.** The module singleton works for a single-tab demo but breaks across multiple tabs, in React StrictMode's double-invocation, and doesn't survive page refresh. In production I'd replace it with Zustand with the persist middleware. One create() call, localStorage serialization in one line.

> **Mock data contamination.** The app loads 15 mock reviews by default so there's something to display before the user uploads data. But when the user analyzes their own reviews, those 15 mock reviews get merged in. That contaminates real analysis results with fictional data. It's a product correctness bug I'd fix before launch.

> **No tests.** The analysis engine functions are pure — given the same text, they always return the same result. They're trivially unit testable with Vitest. I prioritized shipping a complete product surface over test coverage. The analysis engine is the first thing I'd test.

> **Artificial delays.** The 600ms skeleton screens simulate AI processing time. The data is actually synchronously available — the delay is theater. It's deceptive UX. I'd remove it in production."

---

## Product Thinking (13:30 – 15:00)

**Slide: Why these decisions (for PM audiences)**

> "A few product decisions I'm proud of.

> **No backend.** Privacy is a real constraint for enterprise users. If you're a PM at a bank or healthcare company, you cannot upload customer feedback to a third-party SaaS. Running entirely in the browser means there's no data sharing agreement to sign and no audit to pass.

> **Sample datasets with real brands.** I wanted anyone to be able to demo the app in ten seconds without needing their own data. The sample datasets use Zepto, Swiggy, Zomato, and Blinkit — brands that a lot of my target users recognize. This isn't just a technical convenience. It's a product decision about time-to-value.

> **RICE scoring for recommendations.** I could have generated a list of 'potential improvements.' Instead I used RICE — the framework product teams actually use — so the output maps directly to how decisions get made. A PM can take the recommendations page into a planning meeting without translating it.

> **Export to PDF and CSV.** The insights only matter if they can leave the tool. PDF export uses window.print() with print-specific CSS — native browser rendering, no library dependency, pixel-perfect charts. CSV export is a Blob download with proper quote escaping."

---

## Q&A Prep

**"Why TypeScript for the analysis engine instead of Python?"**
> "The analysis runs client-side. Python requires a backend. If I moved analysis server-side, I'd need to build an API layer, handle authentication, think about rate limiting, and choose a hosting strategy. TypeScript in the browser eliminates all of that and keeps the privacy guarantee."

**"How accurate is the sentiment classification?"**
> "On clear positive/negative text — which is most of what review platforms produce — high enough to be useful. On mixed sentiment, it depends on which keywords appear. The honest framing: it's a triage tool, not a replacement for human reading. It gets you from 200 reviews to 15 pain points worth investigating. A human still reads those 15."

**"What would you add if you had two more weeks?"**
> "In order: Zustand for state management, unit tests for the engine, removing mock data contamination, and a real Claude API integration behind a feature flag so I can demo both modes. The architecture is ready for all four of those — no structural changes needed."

**"How would you monetize this?"**
> "Freemium with a usage limit — 50 reviews free, paid tier for bulk uploads and the Claude API integration. Enterprise tier with SSO and the ability to connect directly to review platforms via their APIs instead of CSV export. The current architecture actually makes the pricing straightforward: the free tier can stay fully client-side; the paid tier adds a thin API layer."

**"Is this production-ready?"**
> "It's portfolio-ready. For production, I'd need: Zustand state management, test coverage on the engine, removal of mock data contamination, real error boundaries, and accessibility audit of every chart (SVG accessibility is genuinely hard). I'd also want to replace the artificial skeleton delays with real loading states. Six weeks of focused work would get it there."

---

## Closing

> "The project is open source on GitHub — the link is in my resume. The live version is at [url]. The architecture document, sequence diagrams, component diagrams, and flowcharts are all in the docs/ folder of the repository.

> If you want to go deeper on any of this — the Vite code splitting setup, the Framer Motion animation, the analysis engine, the product decisions — I'm happy to continue.

> Thank you."

---

## Slide Deck Outline

If you're making slides, this is the structure:

| Slide | Content | Duration |
|---|---|---|
| 1 | Title slide | 0:00 |
| 2 | The problem — PM with 200 reviews | 0:30 |
| 3 | Live demo — Dashboard | 1:00 |
| 4 | Live demo — Analysis pages | 2:00 |
| 5 | Architecture diagram | 3:00 |
| 6 | Bundle size / code splitting | 4:30 |
| 7 | Analysis engine — four stages | 6:00 |
| 8 | Engineering problem 1: bundle | 8:00 |
| 9 | Engineering problem 2: dark mode | 9:30 |
| 10 | Engineering problem 3: animation | 10:30 |
| 11 | Known limitations | 12:00 |
| 12 | Product thinking | 13:30 |
| 13 | Thank you + links | 15:00 |

**Recommended slide tools:** Figma Slides, Pitch, or Marp (Markdown-to-slides, good for a technical audience). Keep slides sparse — one idea per slide, large text, no bullet soup.
