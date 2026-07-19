import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BrainCircuit, Code2, Layers, Zap, ArrowLeft,
  BarChart3, Database, Palette, Shield, ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CHART } from '@/lib/chartColors'

const stack = [
  { name: 'React 19 + TypeScript', desc: 'Component architecture with strict types throughout', color: CHART.blue, icon: Code2 },
  { name: 'Vite 8', desc: 'Lightning-fast HMR and optimized production builds', color: CHART.positive, icon: Zap },
  { name: 'Tailwind CSS v4', desc: 'Plugin-based build with @theme token system — no config file', color: '#06b6d4', icon: Palette },
  { name: 'Recharts', desc: 'Composable chart library for AreaChart, PieChart, ScatterChart, and more', color: CHART.warning, icon: BarChart3 },
  { name: 'Radix UI', desc: 'Accessible unstyled primitives: Tabs, Select, Tooltip, Dialog, and more', color: CHART.primary, icon: Layers },
  { name: 'React Router v7', desc: 'Client-side routing with nested layouts and NavLink active states', color: '#f97316', icon: Database },
]

const architecture = [
  {
    title: 'Mock AI Engine',
    desc: 'src/lib/analysisEngine.ts implements keyword-based sentiment classification, regex pain point detection, and theme extraction. No API key or backend required.',
    badge: 'Client-only',
  },
  {
    title: 'Module Singleton State',
    desc: 'useAnalysis.ts uses a module-level let _state to persist analysis results across page navigation without Redux or Zustand.',
    badge: 'State management',
  },
  {
    title: 'Tailwind v4 Tokens',
    desc: 'Design tokens live in @theme {} inside index.css. Colors, radii, and shadows are CSS custom properties — dark mode overrides them in .dark {}.',
    badge: 'Theming',
  },
  {
    title: 'Hardcoded Hex for Charts',
    desc: 'All Recharts SVG fill attributes use hex values from chartColors.ts instead of CSS variables, which SVG cannot resolve natively.',
    badge: 'Chart fix',
  },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <motion.div className="space-y-8 max-w-4xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-1">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </Button>

      {/* Hero card */}
      <div className="rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #1e1130 0%, #0f1117 60%, #111827 100%)', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: '#8b5cf6' }}>
            <BrainCircuit className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Feedback Analyzer</h1>
            <p className="text-sm mt-0.5" style={{ color: '#a78bfa' }}>Production-ready SaaS demo · 2024</p>
          </div>
        </div>
        <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#d1d5db' }}>
          A complete product management tool that turns raw customer feedback into actionable insights.
          Built as a demonstration of modern React + TypeScript patterns with a production-quality UI —
          featuring sentiment analysis, theme detection, RICE prioritization, roadmap views, and report export.
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {['React 19', 'TypeScript', 'Tailwind v4', 'Recharts', 'Radix UI', 'React Router v7'].map(t => (
            <Badge key={t} style={{ backgroundColor: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }}>
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {/* Project goals */}
      <Card>
        <CardHeader>
          <CardTitle>Project Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
            This project demonstrates what a modern SaaS dashboard looks like when built entirely on the client side —
            no backend, no API keys, no database. It shows that with the right tooling (Vite, Tailwind v4, Recharts, Radix UI),
            a single developer can ship a polished, accessible, and fully responsive application.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: Shield, color: CHART.positive, title: 'Accessibility-first', desc: 'ARIA labels, keyboard navigation, focus indicators, screen reader support' },
              { icon: Zap, color: CHART.warning, title: 'Performance-conscious', desc: 'useMemo for expensive computations, isAnimationActive={false} for headless rendering' },
              { icon: Palette, color: CHART.primary, title: 'Design-consistent', desc: 'Token-based theming via CSS custom properties, dark mode throughout' },
              { icon: Code2, color: CHART.blue, title: 'TypeScript-strict', desc: 'No any casts, proper type imports, strict null checks, no unused locals' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="h-4 w-4" aria-hidden="true" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stack.map(({ name, desc, color, icon: Icon }) => (
              <div key={name} className="flex gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="h-4 w-4" aria-hidden="true" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Architecture decisions */}
      <Card>
        <CardHeader>
          <CardTitle>Key Architecture Decisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {architecture.map(({ title, desc, badge }) => (
            <div key={title} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold">{title}</h3>
                <Badge variant="secondary" className="text-xs">{badge}</Badge>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card>
        <CardHeader>
          <CardTitle>Known Limitations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {[
              'All AI analysis is mock/heuristic — keyword matching, not real ML models',
              'State is module-singleton and resets on page reload (no localStorage persistence)',
              'Export produces real JSON only; PDF/Excel/PPTX are simulated with a progress animation',
              'Review data is not persisted between sessions',
              'Not connected to any live review APIs (G2, App Store, etc.)',
            ].map(l => (
              <li key={l} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--color-muted-foreground)' }} aria-hidden="true" />
                {l}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/dashboard')}>
          Open Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate('/help')}>
          Read the Help Guide
        </Button>
        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => window.open('https://github.com', '_blank')}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          View Source
        </Button>
      </div>
    </motion.div>
  )
}
