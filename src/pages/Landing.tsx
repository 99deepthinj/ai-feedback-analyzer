import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3, BrainCircuit, AlertCircle, Sparkles, Map, Download,
  ArrowRight, CheckCircle2, Star, Zap, TrendingUp, MessageSquare,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: BarChart3,
    color: '#6D5DF6',
    bg: 'rgba(109,93,246,0.1)',
    title: 'Sentiment Analysis',
    description: 'Classify every review as positive, negative, or neutral with trend charts and per-source breakdowns.',
  },
  {
    icon: BrainCircuit,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.1)',
    title: 'Theme Detection',
    description: 'Surface recurring topics like Onboarding, Performance, and Pricing automatically from raw text.',
  },
  {
    icon: AlertCircle,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
    title: 'Pain Point Radar',
    description: 'Identify critical issues ranked by severity and affected user percentage.',
  },
  {
    icon: Sparkles,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    title: 'RICE Prioritization',
    description: 'Score feature requests by Reach × Impact × Confidence ÷ Effort with interactive sliders.',
  },
  {
    icon: Map,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    title: 'Product Roadmap',
    description: 'Visualize planned and shipped features across Kanban, Timeline, and Gantt views.',
  },
  {
    icon: Download,
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.1)',
    title: 'Export Reports',
    description: 'One-click PDF, CSV, or JSON export. Save to PDF directly from the print dialog.',
  },
]

const stats = [
  { value: '5', label: 'Sample Datasets', icon: MessageSquare },
  { value: '9+', label: 'Analysis Views', icon: BarChart3 },
  { value: '100%', label: 'Client-Side', icon: Zap },
  { value: '0', label: 'API Keys Needed', icon: CheckCircle2 },
]

const testimonials = [
  {
    quote: 'Cut our feedback review time from days to minutes. The theme detection is surprisingly accurate for a client-side tool.',
    author: 'Sarah Chen',
    role: 'Senior PM · Fintech SaaS',
    stars: 5,
    avatar: 'SC',
  },
  {
    quote: 'The RICE calculator is exactly what we needed. We finally have a shared scoring system the whole team agrees on.',
    author: 'Marcus Webb',
    role: 'Head of Product · B2B Platform',
    stars: 5,
    avatar: 'MW',
  },
  {
    quote: 'Exported a full stakeholder report in 30 seconds. The PDF export with charts is genuinely impressive.',
    author: 'Priya Nair',
    role: 'Product Lead · Enterprise SaaS',
    stars: 5,
    avatar: 'PN',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#09090B', color: '#F5F5F5' }}
    >
      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #6D5DF6, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-60 h-[500px] w-[500px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #7C6CFF, transparent 70%)' }}
        />
      </div>

      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5"
        style={{
          background: 'rgba(9,9,11,0.85)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
          >
            <Zap className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-[13px] font-semibold text-white">AI Feedback Analyzer</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/help')}
            className="hidden sm:inline-flex items-center text-[13px] px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ color: '#A1A1AA' }}
          >
            Docs
          </button>
          <button
            onClick={() => navigate('/about')}
            className="hidden sm:inline-flex items-center text-[13px] px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ color: '#A1A1AA' }}
          >
            About
          </button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="text-[13px] h-8 px-4 gap-1.5"
            style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
          >
            Launch App
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-28 pb-24 text-center max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          <motion.div variants={fadeUp}>
            <Badge
              className="mb-2 px-3 py-1 text-[11px] font-medium"
              style={{
                background: 'rgba(109,93,246,0.12)',
                border: '1px solid rgba(109,93,246,0.25)',
                color: '#A78BFA',
              }}
            >
              <Zap className="h-3 w-3 mr-1 inline" aria-hidden="true" />
              AI-Powered · Zero API Keys · Fully Client-Side
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold leading-[1.08] tracking-tight"
          >
            Turn Customer Reviews
            <br />
            <span
              className="gradient-text"
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #7C6CFF 50%, #6D5DF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              into Product Strategy
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[17px] max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#71717A' }}
          >
            Paste or upload reviews from G2, App Store, Capterra, or anywhere.
            Get instant sentiment analysis, theme detection, pain points, and
            RICE-prioritized feature recommendations — all in your browser.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="min-w-[180px] text-[15px] font-semibold h-12 gap-2"
              style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
            >
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
              Open Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/input')}
              className="min-w-[180px] text-[15px] font-semibold h-12"
              style={{
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#E5E7EB',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              Try With Sample Data
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs" style={{ color: '#52525B' }}>
            No account · No backend · No tracking
          </motion.p>
        </motion.div>

        {/* Dashboard preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
          className="mt-16 relative"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              boxShadow: '0 0 0 1px rgba(109,93,246,0.1), 0 40px 80px rgba(0,0,0,0.4)',
            }}
          >
            {/* Fake browser chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex gap-1.5">
                {['#EF4444', '#F59E0B', '#10B981'].map((c) => (
                  <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.6 }} aria-hidden="true" />
                ))}
              </div>
              <div
                className="flex-1 rounded-md px-3 py-1 text-[11px] text-center"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#52525B', maxWidth: 280, margin: '0 auto' }}
              >
                ai-feedback-analyzer.vercel.app/dashboard
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="p-5">
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Total Reviews', value: '1,523', color: '#6D5DF6' },
                  { label: 'Avg Rating', value: '3.8 / 5', color: '#F59E0B' },
                  { label: 'NPS Score', value: '47', color: '#10B981' },
                  { label: 'Critical Issues', value: '2', color: '#EF4444' },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-[10px] mb-1" style={{ color: '#52525B' }}>{label}</p>
                    <p className="text-lg font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Chart mockup */}
              <div
                className="rounded-xl p-4 mb-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-[11px] font-medium mb-3" style={{ color: '#71717A' }}>Sentiment Trend</p>
                <div className="flex items-end gap-1 h-16">
                  {[55, 72, 48, 65, 80, 60, 74, 82, 70, 85, 78, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
                      className="flex-1 rounded-t-sm"
                      style={{ background: i % 3 === 0 ? '#EF4444' : '#10B981', opacity: 0.7 }}
                    />
                  ))}
                </div>
              </div>

              {/* Theme pills */}
              <div className="flex flex-wrap gap-1.5">
                {['Onboarding', 'Performance', 'Mobile', 'Support', 'Pricing', 'UI/UX'].map((t, i) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                    style={{
                      background: `rgba(${i % 2 === 0 ? '109,93,246' : '16,185,129'},0.15)`,
                      color: i % 2 === 0 ? '#A78BFA' : '#34D399',
                      border: `1px solid rgba(${i % 2 === 0 ? '109,93,246' : '16,185,129'},0.2)`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Glow below preview */}
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-3/4 blur-[60px] pointer-events-none"
            style={{ background: 'rgba(109,93,246,0.2)' }}
            aria-hidden="true"
          />
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border p-5 text-center card-hover"
              style={{
                borderColor: 'rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <Icon className="h-5 w-5 mx-auto mb-2 opacity-40" aria-hidden="true" style={{ color: '#A78BFA' }} />
              <p className="text-2xl font-extrabold" style={{ color: '#A78BFA' }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: '#52525B' }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <Badge
              className="mb-4 px-3 py-1 text-[11px]"
              style={{
                background: 'rgba(109,93,246,0.12)',
                border: '1px solid rgba(109,93,246,0.2)',
                color: '#A78BFA',
              }}
            >
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-white">Everything a PM needs</h2>
            <p className="mt-3 text-base" style={{ color: '#71717A' }}>
              From raw feedback to shipping decisions, all in one browser tab
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map(({ icon: Icon, color, bg, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="rounded-2xl border p-6 cursor-default"
                style={{
                  borderColor: 'rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                  style={{ background: bg }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" style={{ color }} />
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#71717A' }}>{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <Badge
              className="mb-4 px-3 py-1 text-[11px]"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.2)',
                color: '#34D399',
              }}
            >
              How it works
            </Badge>
            <h2 className="text-3xl font-bold text-white">Three steps to insights</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector lines */}
            <div
              className="absolute top-8 left-1/3 right-1/3 h-px hidden sm:block"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(109,93,246,0.3), transparent)' }}
              aria-hidden="true"
            />

            {[
              {
                step: '01',
                title: 'Import Reviews',
                desc: 'Paste text or upload a CSV from G2, App Store, Capterra, or any platform. Or load a branded sample dataset.',
                color: '#6D5DF6',
              },
              {
                step: '02',
                title: 'AI Analysis',
                desc: 'The client-side engine classifies sentiment, detects themes, identifies pain points, and generates recommendations.',
                color: '#8B5CF6',
              },
              {
                step: '03',
                title: 'Take Action',
                desc: 'Prioritize by RICE score, plan your roadmap, and export a PDF or CSV stakeholder report in one click.',
                color: '#A78BFA',
              },
            ].map(({ step, title, desc, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="text-center"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold mx-auto mb-5"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    color,
                  }}
                >
                  {step}
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#71717A' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-white">What PMs are saying</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {testimonials.map(({ quote, author, role, stars, avatar }) => (
              <motion.div
                key={author}
                variants={fadeUp}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: 'rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex mb-4" aria-label={`${stars} stars`}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#A1A1AA' }}>"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
                    aria-hidden="true"
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{author}</p>
                    <p className="text-xs" style={{ color: '#52525B' }}>{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(109,93,246,0.15) 0%, rgba(139,92,246,0.08) 100%)',
              border: '1px solid rgba(109,93,246,0.2)',
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(109,93,246,0.3) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
              >
                <Sparkles className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to understand your users?
              </h2>
              <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: '#A1A1AA' }}>
                Demo data is pre-loaded. Paste your own reviews and see insights instantly — no setup required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="min-w-[200px] text-[15px] font-semibold h-12 gap-2"
                  style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
                >
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                  Launch App
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/input')}
                  className="min-w-[200px] text-[15px] font-semibold h-12"
                  style={{
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: '#E5E7EB',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  Paste Reviews
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-xs" style={{ color: '#52525B' }}>
                {['No account required', 'No data leaves your browser', 'MIT open source'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: '#10B981' }} aria-hidden="true" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
            >
              <Zap className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium" style={{ color: '#52525B' }}>
              AI Feedback Analyzer · MIT License
            </span>
          </div>

          <nav className="flex items-center gap-1" aria-label="Footer links">
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Docs', path: '/help' },
              { label: 'About', path: '/about' },
            ].map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                style={{ color: '#52525B' }}
              >
                {label}
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
