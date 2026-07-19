import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CHART, tooltipStyle, axisStyle } from '@/lib/chartColors'
import { useAnalysis } from '@/hooks/useAnalysis'
import { sentimentTrendData, ratingDistribution } from '@/data/mockData'
import { SkeletonPage } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

const sentimentBySource = [
  { source: 'G2', positive: 55, negative: 28, neutral: 17 },
  { source: 'App Store', positive: 38, negative: 42, neutral: 20 },
  { source: 'Capterra', positive: 48, negative: 30, neutral: 22 },
  { source: 'Trustpilot', positive: 35, negative: 45, neutral: 20 },
  { source: 'Play Store', positive: 29, negative: 55, neutral: 16 },
]

const radarData = [
  { subject: 'UI/UX', positive: 45, negative: 72 },
  { subject: 'Performance', positive: 30, negative: 68 },
  { subject: 'Support', positive: 80, negative: 15 },
  { subject: 'Integrations', positive: 75, negative: 20 },
  { subject: 'Pricing', positive: 25, negative: 60 },
  { subject: 'Mobile', positive: 22, negative: 70 },
]

const ratingColors = [CHART.negative, '#f97316', CHART.warning, '#84cc16', CHART.positive]

export default function SentimentAnalysis() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const { reviews } = useAnalysis()

  const pos = reviews.filter(r => r.sentiment === 'positive')
  const neg = reviews.filter(r => r.sentiment === 'negative')
  const neu = reviews.filter(r => r.sentiment === 'neutral')
  const total = reviews.length || 1  // guard division by zero

  const cards = [
    { label: 'Positive', count: pos.length, pct: Math.round(pos.length / total * 100), icon: TrendingUp, color: CHART.positive, bg: '#ecfdf5' },
    { label: 'Negative', count: neg.length, pct: Math.round(neg.length / total * 100), icon: TrendingDown, color: CHART.negative, bg: '#fef2f2' },
    { label: 'Neutral', count: neu.length, pct: Math.round(neu.length / total * 100), icon: Minus, color: CHART.neutral, bg: '#f8fafc' },
  ]

  // Key insights — spread before sort to avoid mutating module-level array
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'
  const topPositiveSource = [...sentimentBySource].sort((a, b) => b.positive - a.positive)[0]
  const topNegativeSource = [...sentimentBySource].sort((a, b) => b.negative - a.negative)[0]

  if (loading) return <SkeletonPage />

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ label, count, pct, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>{pct}%</p>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{count} of {total} reviews</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Average Rating', value: `${avgRating} / 5`, sub: 'Across all reviews' },
          { label: 'Most Positive Source', value: topPositiveSource.source, sub: `${topPositiveSource.positive}% positive reviews` },
          { label: 'Most Negative Source', value: topNegativeSource.source, sub: `${topNegativeSource.negative}% negative reviews` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-muted)' }}>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Trend + Radar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sentiment Over Time</CardTitle>
            <CardDescription>Monthly percentage breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={sentimentTrendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  {[['gp2', CHART.positive], ['gn2', CHART.negative], ['gu2', CHART.neutral]].map(([id, c]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area isAnimationActive={false} type="monotone" dataKey="positive" name="Positive %" stroke={CHART.positive} fill="url(#gp2)" strokeWidth={2} />
                <Area isAnimationActive={false} type="monotone" dataKey="negative" name="Negative %" stroke={CHART.negative} fill="url(#gn2)" strokeWidth={2} />
                <Area isAnimationActive={false} type="monotone" dataKey="neutral" name="Neutral %" stroke={CHART.neutral} fill="url(#gu2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sentiment by Category</CardTitle>
            <CardDescription>Positive vs negative by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={CHART.grid} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Radar isAnimationActive={false} name="Positive" dataKey="positive" stroke={CHART.positive} fill={CHART.positive} fillOpacity={0.2} />
                <Radar isAnimationActive={false} name="Negative" dataKey="negative" stroke={CHART.negative} fill={CHART.negative} fillOpacity={0.2} />
                <Legend />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* By Source + Rating Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment by Source</CardTitle>
            <CardDescription>Stacked breakdown per platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sentimentBySource} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="source" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar isAnimationActive={false} dataKey="positive" name="Positive" fill={CHART.positive} stackId="a" />
                <Bar isAnimationActive={false} dataKey="neutral" name="Neutral" fill={CHART.neutral} stackId="a" />
                <Bar isAnimationActive={false} dataKey="negative" name="Negative" fill={CHART.negative} stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Star rating frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ratingDistribution} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="rating" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar isAnimationActive={false} dataKey="count" name="Reviews" radius={[4, 4, 0, 0]}>
                  {ratingDistribution.map((_, i) => <Cell key={i} fill={ratingColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Review table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews — Classified</CardTitle>
          <CardDescription>{reviews.length} reviews with AI sentiment labels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {reviews.map(review => (
              <div key={review.id} className="flex gap-3 rounded-lg border p-4" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge variant={review.sentiment === 'positive' ? 'positive' : review.sentiment === 'negative' ? 'negative' : 'neutral'}>
                      {review.sentiment}
                    </Badge>
                    <Badge variant="secondary">{review.source}</Badge>
                    <span className="text-xs" style={{ color: '#f59e0b' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{review.date}</span>
                  </div>
                  <p className="text-sm">{review.text}</p>
                  {review.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {review.themes.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
