# Elevator Pitches & Explanations — AI Feedback Analyzer

Scripts calibrated for real conversation. Memorize the 30-second version. Know the 2-minute cold. Have the 5-minute ready for when someone genuinely wants to go deep.

---

## 30-Second Elevator Pitch

**Context:** You have 30 seconds — a recruiter, a PM, a senior engineer in a coffee queue.

---

> "I built a tool called AI Feedback Analyzer. The problem it solves: product managers collect hundreds of reviews from G2, App Store, Trustpilot — and then spend hours manually synthesizing them. My tool lets you paste those reviews and in under a minute you get a sentiment breakdown, theme clusters, pain point rankings, and a RICE-prioritized feature roadmap.
>
> What's interesting technically is it runs entirely in your browser — no backend, no API key, no data leaves your device. The initial load is 83 kilobytes despite having eight chart types and fourteen pages, because I implemented Vite code splitting and React lazy loading.
>
> It's live — you can actually try it right now at [url]."

**Word count:** ~100 words. At a normal speaking pace that's 35–40 seconds. Trim if needed.

**What this accomplishes:**
- Opens with the problem, not the tech stack
- Gets specific fast (G2, App Store, Trustpilot — these are real, recognizable platforms)
- Has one concrete technical fact (83KB) that signals engineering depth
- Ends with a clear call to action

---

## 2-Minute Explanation

**Context:** A recruiter or interviewer says "tell me about a project you're proud of." You have their full attention.

---

> "Sure — I'll walk you through AI Feedback Analyzer.
>
> **The problem:** Product managers at startups are drowning in customer feedback. They get reviews from G2, Capterra, the App Store, Trustpilot — sometimes hundreds a month. Making sense of it all is a completely manual process: copying into spreadsheets, reading line by line, trying to spot patterns. Dedicated tools like Medallia exist but cost thirty thousand dollars a year and require sharing your customer data with a third party.
>
> **What I built:** A web app where you paste your reviews — or upload a CSV — and get structured insights in under sixty seconds. Sentiment breakdown across positive, negative, and neutral. Theme clusters showing which product areas are mentioned most. Pain points ranked by severity and estimated user impact. RICE-scored feature recommendations. And a product roadmap you can view as a Kanban board, a timeline, or a Gantt chart. There's also a real export flow — PDF, CSV, JSON.
>
> **The technical core of it:** The entire analysis pipeline runs client-side in TypeScript. I built a custom NLP engine — no ML library, no API call — that classifies sentiment via keyword scoring, detects themes via keyword clustering across nine product domains, and identifies pain points via regex pattern matching. It processes a hundred reviews in under fifty milliseconds.
>
> **The interesting engineering problems:** First was bundle size. Recharts alone is 393 kilobytes. I used Vite's manual chunk splitting and React lazy loading to bring the initial bundle down to 83 kilobytes — so first load is fast, and chart libraries only download when you actually navigate to a chart page. Second was dark mode — I built it on CSS custom properties rather than React state, so the entire theme switches with a single class toggle and zero re-renders. Third was animation — I used Framer Motion's shared layout animations so the sidebar's active nav indicator slides smoothly between items as you navigate, rather than jumping.
>
> **Why it matters to me as a PM candidate:** I didn't just build a tech demo. I thought through the product surface — what does a PM actually need to take 200 reviews and walk into a planning meeting with something actionable? That forced me to make real prioritization decisions: no backend because privacy is a genuine constraint for enterprise users; sample datasets with real Indian quick-commerce brands because I wanted anyone to be able to demo it in ten seconds without needing their own data; RICE scoring because that's the framework PMs actually use.
>
> You can try it live right now — I can pull it up."

**Word count:** ~380 words. At a normal speaking pace that's approximately 2 minutes.

---

## 5-Minute Technical Deep-Dive

**Context:** A technical interviewer, a senior engineer, or a hiring manager who wants to understand the project at depth. This version respects their intelligence and goes into real specifics.

---

> "I'll give you the full picture of AI Feedback Analyzer — the product decisions, the architecture, and the engineering problems I found most interesting.
>
> **The product problem first.** Product managers at startups collect reviews from multiple sources — G2, Capterra, the App Store, Play Store, Trustpilot. The synthesis process is completely manual. Even a PM at a Series B company is typically copy-pasting into a spreadsheet, reading through individually, and producing a document based on recall rather than systematic analysis. The existing solutions — Medallia, Qualtrics, Dovetail — are expensive and require you to share sensitive customer data with an external service. I built something that solves the core workflow, runs locally, and costs nothing.
>
> **Architecture at a high level.** It's a fully client-side SPA — React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7. No backend. No database. No authentication. Data lives in a module-level singleton that persists across route navigation, and resets on page refresh. I'm aware that's not production-grade state management — I wrote about the Zustand migration path in the architecture document — but for a single-user demo running in one tab, it's correct enough and dramatically simpler.
>
> **The analysis engine.** I built a custom TypeScript NLP pipeline with four stages. First, text parsing — split on newlines, filter lines under 20 characters, create Review objects with a deterministic ID from Date.now() plus index. Second, sentiment classification — keyword scoring across 40 positive and negative terms, with a simple score-positive-negative giving you positive, negative, or neutral. Third, theme detection — substring matching against nine product domain keyword sets: Onboarding, UI/UX, Performance, Mobile, Integrations, Analytics, Support, Pricing, AI Features. Fourth, pain point identification — seven regex patterns matched against negative-sentiment reviews, each with a severity level and an affected user estimate. All of this runs in under 50 milliseconds for 100 reviews on a modern device.
>
> The honest limitation: this is keyword matching, not transformer-based NLP. On well-written, clearly positive or negative reviews — which is most of what you get from review platforms — accuracy is high. On mixed-sentiment reviews like 'I love the interface but the performance is terrible,' the score depends on which words appear. I documented the Claude API migration path in the README: replacing classifySentiment with an Anthropic API call requires changing one function, costs about a cent per 100 reviews, and you'd get proper semantic understanding. The architecture is designed for that migration.
>
> **Performance engineering.** The bundle size problem was the most interesting engineering challenge. Recharts and D3 dependencies together are 393 kilobytes. React DOM and React Router are 216 kilobytes. Framer Motion is 33 kilobytes. Naively bundled, that's over 900 kilobytes — a nine-second first load on a 3G connection. I solved it in two ways. First, Vite's manualChunks function assigns each library group to a named chunk, so they're separate files with separate content hashes. App code changes don't invalidate the Recharts cache. Second, React.lazy() wraps all 12 secondary pages — they're not downloaded until the user navigates to them. The initial bundle is 83 kilobytes. The chart libraries load the first time you open a chart page and are cached after that.
>
> **Design system.** Tailwind CSS v4 uses CSS-first configuration — design tokens live in an @theme block in index.css as CSS custom properties. Dark mode works by adding a .dark class to document.documentElement, which overrides the light-mode variable values. No React state change. No re-renders. The OS preference is read once at initialization via window.matchMedia, persisted in localStorage, and applied before first paint. I specifically avoided the pattern where dark mode is stored in React state and applied with a className prop — that causes a flash of the wrong theme on load.
>
> **Animation system.** Framer Motion's layoutId is the feature I found most impressive. The sidebar has a group of nav items, and the active one has a background highlight. As you navigate between routes, the active item changes — but instead of the old highlight disappearing and the new one appearing, Framer Motion animates the highlight sliding between them. This is because both highlights share the same layoutId string. Framer Motion detects that the old element unmounted and the new element mounted in a different position, and interpolates between them automatically. It's four lines of code and it makes the navigation feel significantly more polished.
>
> **What I'd do differently at production scale.** The module singleton for state breaks in multi-tab scenarios and doesn't survive page refreshes. I'd replace it with Zustand with the persist middleware — localStorage serialization in one line. The artificial 600ms skeleton delays would go — they're deceptive; the data is synchronously available. The analysis engine runs on the main thread and would block UI for very large datasets — that moves to a Web Worker. And the mock data that gets mixed into every analysis run would be removed entirely; it contaminates real user data with fictional reviews.
>
> I documented all of this in the architecture document — including the future database schema, the auth flow, and the Claude API integration cost estimates — because I think the gap between a demo and a production system is as important to understand as the demo itself.
>
> Any specific part you want to go deeper on?"

**Word count:** ~870 words. At a normal speaking pace that's approximately 5–6 minutes.

---

## One-Line Versions (for different contexts)

**On a resume objective:**
> "Built a production React 19 + TypeScript SPA that classifies sentiment, clusters themes, and generates RICE roadmaps from customer reviews client-side — 83KB initial bundle, full dark mode, PWA, 14 routes, 8 chart types."

**In a cold email:**
> "I recently built AI Feedback Analyzer — a tool that goes from raw customer reviews to a prioritized product roadmap in 60 seconds, runs in the browser with no backend, and has an architecture I'm proud of. You can try it at [url] and read the full writeup at [github]."

**On GitHub profile bio:**
> "Built AI Feedback Analyzer — React 19 + TypeScript + Tailwind v4 SPA that turns customer reviews into product insights. 83KB bundle, 14 routes, 8 chart types, 0 backend."

**At a hackathon intro:**
> "AI Feedback Analyzer — paste your reviews, get a RICE-prioritized product roadmap in 60 seconds. Runs in the browser, no data leaves your device."

---

## Handling Hard Follow-Up Questions

**"Is it actually AI?"**
> "The current engine is keyword-based NLP — it's fast, deterministic, and works without an API key. The architecture is explicitly designed to swap in Claude or OpenAI for real semantic understanding. I documented the migration in the README — it's a three-function replacement with cost estimates. I was deliberate about this: 'client-side keyword matching' is honest, 'AI-powered' as a marketing claim needs an asterisk."

**"What would you do differently?"**
> "Three things. First, the state management — a module singleton works for a demo but breaks across tabs and doesn't survive refreshes; I'd use Zustand with localStorage persistence. Second, the artificial loading delays — I added 600ms skeletons to mimic AI processing time, which is deceptive UX; they'd go in production. Third, the mock data always mixing into real user uploads — that contaminates analysis results, which is a product correctness bug."

**"Why no tests?"**
> "Honest answer: I prioritized shipping a complete product surface over test coverage. The analysis engine functions — classifySentiment, detectThemes, detectPainPoints — are pure functions that are trivially testable with Vitest. That's the first thing I'd add. Integration tests for the useAnalysis hook state transitions are the second. I know the gap."

**"How would you scale this to real users?"**
> "File uploads go to S3. Analysis jobs go to a BullMQ queue backed by Redis. The analysis worker calls Claude API instead of the local keyword engine. Results persist in PostgreSQL with workspace-level row security. The frontend switches from the module singleton to API calls. I drew out the full architecture in the ARCHITECTURE.md — database schema, auth flow, API endpoints, rate limiting, even webhook event types. The current codebase is designed for that migration: the analysis engine is three pure functions in one file."
