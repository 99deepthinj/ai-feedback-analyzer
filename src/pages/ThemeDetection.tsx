import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CHART, tooltipStyle, axisStyle } from '@/lib/chartColors'
import { useAnalysis } from '@/hooks/useAnalysis'
import { SkeletonPage } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4" style={{ color: CHART.positive }} />
  if (trend === 'down') return <TrendingDown className="h-4 w-4" style={{ color: CHART.negative }} />
  return <Minus className="h-4 w-4" style={{ color: CHART.neutral }} />
}

// Simple word cloud component using sized spans
function WordCloud({ themes }: { themes: Array<{ name: string; count: number; sentiment: string }> }) {
  const max = Math.max(...themes.map(t => t.count))
  return (
    <div className="flex flex-wrap gap-2 p-4 justify-center items-center min-h-[160px]">
      {themes.map(t => {
        const size = 12 + Math.round((t.count / max) * 20)
        const color = t.sentiment === 'positive' ? CHART.positive : t.sentiment === 'negative' ? CHART.negative : CHART.neutral
        return (
          <span
            key={t.name}
            className="font-semibold cursor-default select-none transition-opacity hover:opacity-80"
            style={{ fontSize: size, color }}
            title={`${t.name}: ${t.count} mentions`}
          >
            {t.name}
          </span>
        )
      })}
    </div>
  )
}

export default function ThemeDetection() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const { themes, reviews } = useAnalysis()

  const barData = themes.map(t => ({
    name: t.name,
    count: t.count,
    fill: t.sentiment === 'positive' ? CHART.positive : t.sentiment === 'negative' ? CHART.negative : CHART.neutral,
  }))

  // Deterministic y-positions derived from name hash to avoid Math.random() in render
  const bubbleData = useMemo(() => themes.map(t => {
    const nameHash = t.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const jitter = (nameHash % 20)
    const base = t.sentiment === 'positive' ? 70 : t.sentiment === 'negative' ? 10 : 40
    return { x: t.count, y: base + jitter, z: t.count * 3, name: t.name }
  }), [themes])

  if (loading) return <SkeletonPage />

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Theme stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Themes', value: themes.length, color: CHART.primary },
          { label: 'Positive Themes', value: themes.filter(t => t.sentiment === 'positive').length, color: CHART.positive },
          { label: 'Negative Themes', value: themes.filter(t => t.sentiment === 'negative').length, color: CHART.negative },
          { label: 'Total Mentions', value: themes.reduce((s, t) => s + t.count, 0), color: CHART.warning },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar chart + Word cloud */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Theme Volume</CardTitle>
            <CardDescription>Mention count colored by sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 50, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar isAnimationActive={false} dataKey="count" name="Mentions" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Cloud</CardTitle>
            <CardDescription>Size = frequency · Color = sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <WordCloud themes={themes.map(t => ({ name: t.name, count: t.count, sentiment: t.sentiment }))} />
            <div className="flex justify-center gap-4 mt-2">
              {[['Positive', CHART.positive], ['Negative', CHART.negative], ['Neutral', CHART.neutral]].map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scatter map */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Sentiment Map</CardTitle>
          <CardDescription>Bubble size = volume · Y axis = positivity score (higher = more positive)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis type="number" dataKey="x" name="Volume" tick={axisStyle} axisLine={false} tickLine={false}
                label={{ value: 'Mention Volume', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#6b7280' }} />
              <YAxis type="number" dataKey="y" name="Positivity" tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]}
                label={{ value: 'Positivity', angle: -90, position: 'insideLeft', offset: 12, fontSize: 11, fill: '#6b7280' }} />
              <ZAxis type="number" dataKey="z" range={[60, 500]} />
              <Tooltip
                contentStyle={tooltipStyle}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const p = payload[0].payload
                  return (
                    <div className="rounded-lg border p-2 text-xs" style={{ ...tooltipStyle }}>
                      <p className="font-semibold">{p.name ?? '—'}</p>
                      <p style={{ color: 'var(--color-muted-foreground)' }}>Volume: {p.x} mentions</p>
                      <p style={{ color: 'var(--color-muted-foreground)' }}>Positivity: {Math.round(p.y)}%</p>
                    </div>
                  )
                }}
              />
              <Scatter isAnimationActive={false} data={bubbleData} fill={CHART.primary} fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Theme detail cards */}
      <div>
        <h2 className="text-base font-semibold mb-4">Theme Breakdown</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {themes.map(theme => (
            <Card key={theme.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{theme.count} mentions · {theme.percentage}% of reviews</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendIcon trend={theme.trend} />
                    <Badge variant={theme.sentiment === 'positive' ? 'positive' : theme.sentiment === 'negative' ? 'negative' : 'neutral'}>
                      {theme.sentiment}
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={theme.percentage}
                  className="h-2"
                  indicatorClassName={theme.sentiment === 'positive' ? '!bg-emerald-500' : theme.sentiment === 'negative' ? '!bg-red-500' : '!bg-slate-400'}
                />

                {/* Sample quotes */}
                <div className="mt-3 space-y-2">
                  {reviews
                    .filter(r => r.themes.includes(theme.name))
                    .slice(0, 2)
                    .map(r => (
                      <div key={r.id} className="rounded-md p-2" style={{ backgroundColor: 'var(--color-muted)' }}>
                        <p className="text-xs line-clamp-2">"{r.text}"</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{r.source} · {r.date}</p>
                      </div>
                    ))}
                  {reviews.filter(r => r.themes.includes(theme.name)).length === 0 && (
                    <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>No matching reviews in current dataset</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
