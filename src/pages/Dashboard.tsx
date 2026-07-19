import { useState, useEffect, useRef } from 'react'
import type { ElementType } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Star, MessageSquare, AlertCircle,
  ThumbsUp, Sparkles, Copy, Check, ArrowUpRight,
  Clock, Sun, Sunset, Moon, Activity, ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CHART, tooltipStyle, axisStyle } from '@/lib/chartColors'
import { useAnalysis } from '@/hooks/useAnalysis'
import { generateExecutiveSummary } from '@/lib/executiveSummary'
import { sentimentTrendData, ratingDistribution, sourceDistribution, npsData } from '@/data/mockData'

// Module-level last-analyzed tracker
let _lastAnalyzed: number | null = null

function timeAgo(ms: number): string {
  const secs = Math.floor((Date.now() - ms) / 1000)
  if (secs < 60) return 'Just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

// Animated counter hook
function useCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return value
}

function WelcomeHeader({ lastAnalyzed }: { lastAnalyzed: number | null }) {
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const GreetingIcon = hour < 12 ? Sun : hour < 18 ? Sunset : Moon

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div variants={fadeUp}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: avatar + greeting */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
            aria-hidden="true"
          >
            PM
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <GreetingIcon className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} aria-hidden="true" />
              <h2 className="text-xl font-bold leading-none" style={{ color: 'var(--color-foreground)' }}>
                {greeting}
              </h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Here's what your users are saying
            </p>
          </div>
        </div>

        {/* Right: date, last analyzed, action */}
        <div className="flex flex-col items-end gap-1.5">
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{dateStr}</p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {lastAnalyzed ? `Last analyzed: ${timeAgo(lastAnalyzed)}` : 'No analysis yet'}
            </span>
          </div>
          <button
            onClick={() => navigate('/input')}
            className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            style={{
              background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)',
              color: 'white',
            }}
          >
            Analyze New Data
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function HealthIndicator() {
  const { reviews, painPoints } = useAnalysis()
  const total = reviews.length
  const pos = reviews.filter((r) => r.sentiment === 'positive').length
  const positiveRate = total ? Math.round((pos / total) * 100) : 0
  const coverage = Math.min(Math.round((total / 50) * 100), 100)
  const velocity = painPoints.length

  return (
    <motion.div variants={fadeUp}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
              style={{ background: 'rgba(109,93,246,0.12)', border: '1px solid rgba(109,93,246,0.2)' }}
            >
              <Activity className="h-3.5 w-3.5" style={{ color: '#6D5DF6' }} aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Health Overview</CardTitle>
              <CardDescription>Overall feedback health indicators</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Gradient health bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                Overall Health Score
              </span>
              <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--color-foreground)' }}>
                {positiveRate}%
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ background: 'var(--color-muted)' }}
              role="progressbar"
              aria-valuenow={positiveRate}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${positiveRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${CHART.negative}, ${CHART.warning} 50%, ${CHART.positive})`,
                  backgroundSize: '300% 100%',
                  backgroundPosition: `${100 - positiveRate}% 0`,
                }}
              />
            </div>
          </div>

          {/* Three metric cells */}
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-center pr-4">
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ color: positiveRate >= 50 ? CHART.positive : CHART.negative }}
              >
                {positiveRate}%
              </p>
              <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                Positive Rate
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-bold tabular-nums" style={{ color: CHART.primary }}>
                {coverage}%
              </p>
              <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                Response Coverage
              </p>
            </div>
            <div className="text-center pl-4">
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ color: velocity > 3 ? CHART.negative : CHART.warning }}
              >
                {velocity}
              </p>
              <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                Issue Velocity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function KpiCard({
  title, rawValue, displayValue, subtitle, icon: Icon, trend, trendValue, color, delay = 0,
}: {
  title: string
  rawValue: number
  displayValue?: string
  subtitle: string
  icon: ElementType
  trend?: 'up' | 'down'
  trendValue?: string
  color: string
  delay?: number
}) {
  const animated = useCounter(rawValue)
  const shown = displayValue ?? animated.toLocaleString()

  return (
    <motion.div variants={fadeUp} transition={{ delay }}>
      <Card className="card-hover overflow-hidden relative">
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          aria-hidden="true"
        />
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted-foreground)' }}>
                {title}
              </p>
              <p className="text-2xl font-bold tabular-nums tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                {shown}
              </p>
              <p className="text-xs mt-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                {subtitle}
              </p>
              {trend && trendValue && (
                <div
                  className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md`}
                  style={{
                    background: trend === 'up' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: trend === 'up' ? '#10B981' : '#EF4444',
                  }}
                >
                  {trend === 'up'
                    ? <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
                  {trendValue}
                </div>
              )}
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}25` }}
            >
              <Icon className="h-5 w-5" aria-hidden="true" style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ExecutiveSummaryCard() {
  const { reviews, themes, painPoints } = useAnalysis()
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const summary = generateExecutiveSummary(reviews, themes, painPoints)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 900)
    return () => clearTimeout(t)
  }, [reviews.length])

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <motion.div variants={fadeUp}>
      <Card
        className="overflow-hidden relative"
        style={{
          borderColor: 'rgba(109,93,246,0.25)',
          background: 'linear-gradient(135deg, rgba(109,93,246,0.05) 0%, var(--color-card) 60%)',
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #6D5DF6, #8B5CF6, transparent)' }}
          aria-hidden="true"
        />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(109,93,246,0.15)', border: '1px solid rgba(109,93,246,0.2)' }}
              >
                <Sparkles className="h-4 w-4" style={{ color: '#6D5DF6' }} aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">AI Executive Summary</CardTitle>
                <CardDescription>
                  {reviews.length > 0
                    ? `Generated from ${reviews.length} reviews`
                    : 'Load reviews to generate summary'}
                </CardDescription>
              </div>
              <Badge
                className="ml-1 text-[10px] font-medium"
                style={{
                  background: 'rgba(109,93,246,0.12)',
                  border: '1px solid rgba(109,93,246,0.2)',
                  color: '#8B5CF6',
                }}
              >
                AI
              </Badge>
            </div>
            <button
              onClick={handleCopy}
              aria-label="Copy summary to clipboard"
              className="flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 transition-all hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              style={{
                background: 'var(--color-muted)',
                color: 'var(--color-muted-foreground)',
                border: '1px solid var(--color-border)',
              }}
            >
              {copied ? (
                <><Check className="h-3 w-3" aria-hidden="true" />Copied</>
              ) : (
                <><Copy className="h-3 w-3" aria-hidden="true" />Copy</>
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {!revealed ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-foreground-secondary)' }}
            >
              {summary}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

const sentimentPieData = [
  { name: 'Positive', value: 42, fill: CHART.positive },
  { name: 'Negative', value: 35, fill: CHART.negative },
  { name: 'Neutral', value: 23, fill: CHART.neutral },
]

export default function Dashboard() {
  const { reviews, themes } = useAnalysis()
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<number | null>(null)
  const recent = reviews.slice(0, 4)

  const total = reviews.length
  const avgRating = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '—'
  const pos = reviews.filter((r) => r.sentiment === 'positive').length
  const neg = reviews.filter((r) => r.sentiment === 'negative').length
  const nps = total ? Math.round(((pos - neg) / total) * 100) : 0

  // Track when data was last loaded
  useEffect(() => {
    if (reviews.length > 0) {
      _lastAnalyzed = Date.now()
      setLastAnalyzedAt(_lastAnalyzed)
    }
  }, [reviews.length])

  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Welcome Header */}
      <WelcomeHeader lastAnalyzed={lastAnalyzedAt} />

      {/* Executive Summary */}
      <ExecutiveSummaryCard />

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={stagger}
      >
        <KpiCard
          title="Total Reviews"
          rawValue={total}
          subtitle="Across all channels"
          icon={MessageSquare}
          trend="up"
          trendValue="+12% vs last month"
          color={CHART.primary}
          delay={0}
        />
        <KpiCard
          title="Avg Rating"
          rawValue={parseFloat(String(avgRating)) || 0}
          displayValue={`${avgRating} / 5`}
          subtitle="Weighted by source"
          icon={Star}
          trend="up"
          trendValue="+0.2 pts"
          color={CHART.warning}
          delay={0.04}
        />
        <KpiCard
          title="NPS Score"
          rawValue={nps}
          subtitle="Net Promoter Score"
          icon={ThumbsUp}
          trend="up"
          trendValue="+3 pts"
          color={CHART.positive}
          delay={0.08}
        />
        <KpiCard
          title="Critical Issues"
          rawValue={2}
          subtitle="Require immediate action"
          icon={AlertCircle}
          trend="down"
          trendValue="-1 resolved"
          color={CHART.negative}
          delay={0.12}
        />
      </motion.div>

      {/* Health Indicator */}
      <HealthIndicator />

      {/* Sentiment Trend + Donut */}
      <motion.div className="grid grid-cols-1 gap-4 lg:grid-cols-3" variants={stagger}>
        <motion.div className="lg:col-span-2" variants={fadeUp}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sentiment Trend</CardTitle>
                  <CardDescription>6-month rolling breakdown</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px]">Last 6 months</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={sentimentTrendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART.positive} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={CHART.positive} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART.negative} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={CHART.negative} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gNeu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART.neutral} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={CHART.neutral} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} />
                  <Area isAnimationActive={false} type="monotone" dataKey="positive" name="Positive" stroke={CHART.positive} fill="url(#gPos)" strokeWidth={2} />
                  <Area isAnimationActive={false} type="monotone" dataKey="negative" name="Negative" stroke={CHART.negative} fill="url(#gNeg)" strokeWidth={2} />
                  <Area isAnimationActive={false} type="monotone" dataKey="neutral" name="Neutral" stroke={CHART.neutral} fill="url(#gNeu)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sentiment Split</CardTitle>
              <CardDescription>Current distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    isAnimationActive={false}
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {sentimentPieData.map(({ name, value, fill }) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: fill }} aria-hidden="true" />
                      <span style={{ color: 'var(--color-muted-foreground)' }}>{name}</span>
                    </div>
                    <span className="font-semibold tabular-nums">{value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Rating + Sources + Themes */}
      <motion.div className="grid grid-cols-1 gap-4 lg:grid-cols-3" variants={stagger}>
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Star rating breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={ratingDistribution} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="rating" tick={axisStyle} axisLine={false} tickLine={false} width={52} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar isAnimationActive={false} dataKey="count" name="Reviews" radius={[0, 4, 4, 0]}>
                    {ratingDistribution.map((_, i) => (
                      <Cell key={i} fill={[CHART.negative, '#f97316', CHART.warning, '#84cc16', CHART.positive][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Review Sources</CardTitle>
              <CardDescription>Where feedback comes from</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    isAnimationActive={false}
                    data={sourceDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {sourceDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {sourceDistribution.map(({ source, count, fill }) => (
                  <div key={source} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: fill }} aria-hidden="true" />
                    <span style={{ color: 'var(--color-muted-foreground)' }} className="truncate">{source}</span>
                    <span className="ml-auto font-semibold tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Top Themes</CardTitle>
              <CardDescription>Most mentioned topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {themes.slice(0, 6).map((theme) => (
                  <div key={theme.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium truncate">{theme.name}</span>
                        <span className="text-[11px] ml-2 tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>
                          {theme.count}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-muted)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${theme.percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              theme.sentiment === 'positive'
                                ? CHART.positive
                                : theme.sentiment === 'negative'
                                ? CHART.negative
                                : CHART.neutral,
                          }}
                        />
                      </div>
                    </div>
                    <Badge
                      variant={
                        theme.sentiment === 'positive'
                          ? 'positive'
                          : theme.sentiment === 'negative'
                          ? 'negative'
                          : 'neutral'
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {theme.sentiment}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* NPS Trend + Recent Reviews */}
      <motion.div className="grid grid-cols-1 gap-4 lg:grid-cols-5" variants={stagger}>
        <motion.div className="lg:col-span-2" variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>NPS Trend</CardTitle>
              <CardDescription>Net Promoter Score · target 50+</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={npsData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 60]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="nps"
                    name="NPS"
                    stroke={CHART.primary}
                    strokeWidth={2.5}
                    dot={{ fill: CHART.primary, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-3" variants={fadeUp}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>Latest customer feedback</CardDescription>
                </div>
                <button
                  className="flex items-center gap-1 text-xs transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] rounded"
                  style={{ color: 'var(--color-primary)' }}
                  onClick={() => window.location.assign('/reviews')}
                >
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {recent.length === 0 ? (
                  <div className="py-8 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" aria-hidden="true" />
                    <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                      No reviews yet — paste some on the Review Input page
                    </p>
                  </div>
                ) : (
                  recent.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-3 rounded-xl p-3 transition-colors"
                      style={{ background: 'var(--color-muted)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <Badge
                            variant={
                              review.sentiment === 'positive'
                                ? 'positive'
                                : review.sentiment === 'negative'
                                ? 'negative'
                                : 'neutral'
                            }
                          >
                            {review.sentiment}
                          </Badge>
                          <span className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
                            {review.source}
                          </span>
                          <span className="text-[11px]" style={{ color: '#F59E0B' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </span>
                        </div>
                        <p className="text-xs line-clamp-2 leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
