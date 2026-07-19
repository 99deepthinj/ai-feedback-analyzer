import { useState, useEffect } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, ReferenceLine,
} from 'recharts'
import { AlertCircle, AlertTriangle, Info, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CHART, tooltipStyle, axisStyle } from '@/lib/chartColors'
import { useAnalysis } from '@/hooks/useAnalysis'
import type { PainPoint } from '@/types'
import { SkeletonPage } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

const severityConfig = {
  critical: { label: 'Critical', icon: AlertCircle, color: CHART.negative, bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.25)' },
  high:     { label: 'High',     icon: AlertTriangle, color: CHART.warning,  bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.25)' },
  medium:   { label: 'Medium',   icon: Info,          color: CHART.blue,     bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.2)' },
  low:      { label: 'Low',      icon: Info,          color: CHART.neutral,  bg: 'var(--color-muted)',    border: 'var(--color-border)' },
}

// Mock impact/effort data for scatter
const impactEffortData = [
  { name: 'Confusing onboarding', impact: 9, effort: 5, severity: 'critical' },
  { name: 'Mobile app issues', impact: 8, effort: 13, severity: 'critical' },
  { name: 'Performance issues', impact: 9, effort: 8, severity: 'high' },
  { name: 'Bulk actions', impact: 7, effort: 5, severity: 'high' },
  { name: 'Poor search', impact: 8, effort: 8, severity: 'high' },
  { name: 'Limited exports', impact: 6, effort: 5, severity: 'medium' },
  { name: 'Pricing concerns', impact: 5, effort: 3, severity: 'medium' },
  { name: 'HubSpot integration', impact: 7, effort: 8, severity: 'medium' },
]

function PainPointCard({ pp }: { pp: PainPoint }) {
  const cfg = severityConfig[pp.severity]
  const Icon = cfg.icon
  return (
    <Card style={{ border: `1px solid ${cfg.border}`, backgroundColor: cfg.bg }}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: cfg.color }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold">{pp.title}</h3>
              <Badge variant={pp.severity === 'critical' ? 'destructive' : pp.severity === 'high' ? 'warning' : pp.severity === 'medium' ? 'secondary' : 'neutral'}>
                {cfg.label}
              </Badge>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--color-muted-foreground)' }}>{pp.description}</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity className="h-3.5 w-3.5" style={{ color: 'var(--color-muted-foreground)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Frequency</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={pp.frequency} className="h-1.5 flex-1" />
                  <span className="text-xs font-medium">{pp.frequency}%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="h-3.5 w-3.5" style={{ color: 'var(--color-muted-foreground)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Affected</span>
                </div>
                <p className="text-sm font-semibold">{pp.affectedUsers.toLocaleString()} users</p>
              </div>
            </div>

            {pp.themes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {pp.themes.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#374151' }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PainPoints() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const { painPoints } = useAnalysis()

  const display = painPoints.length > 0 ? painPoints : [
    { id: '0', title: 'No pain points detected', description: 'Add more reviews to detect pain points automatically.', severity: 'low' as const, frequency: 0, affectedUsers: 0, themes: [] }
  ]

  const bySeverity = (s: string) => display.filter(p => p.severity === s)

  const barData = display.map(p => ({
    name: p.title.length > 22 ? p.title.slice(0, 22) + '…' : p.title,
    frequency: p.frequency,
    fill: severityConfig[p.severity].color,
  }))

  const scatterColors: Record<string, string> = {
    critical: CHART.negative, high: CHART.warning, medium: CHART.blue, low: CHART.neutral,
  }

  if (loading) return <SkeletonPage />

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Severity summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(['critical', 'high', 'medium', 'low'] as const).map(s => {
          const cfg = severityConfig[s]
          const Icon = cfg.icon
          const count = bySeverity(s).length
          return (
            <Card key={s} style={{ border: `1px solid ${cfg.border}`, backgroundColor: cfg.bg }}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="h-8 w-8" style={{ color: cfg.color }} />
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Frequency bar + Impact/Effort scatter */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pain Point Frequency</CardTitle>
            <CardDescription>How often each issue appears in reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 60, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Frequency']} />
                <Bar isAnimationActive={false} dataKey="frequency" name="Frequency %" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact vs Effort Matrix</CardTitle>
            <CardDescription>Top-left = quick wins · Top-right = big bets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis type="number" dataKey="effort" name="Effort" domain={[0, 16]} tick={axisStyle} axisLine={false} tickLine={false}
                  label={{ value: 'Effort (weeks)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#6b7280' }} />
                <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 10]} tick={axisStyle} axisLine={false} tickLine={false}
                  label={{ value: 'Impact', angle: -90, position: 'insideLeft', offset: 12, fontSize: 11, fill: '#6b7280' }} />
                <ZAxis range={[80, 80]} />
                <ReferenceLine x={8} stroke="#d1d5db" strokeDasharray="4 4" />
                <ReferenceLine y={6} stroke="#d1d5db" strokeDasharray="4 4" />
                <Tooltip
                  contentStyle={tooltipStyle}
                  content={({ payload }) => {
                    if (!payload?.length) return null
                    const p = payload[0].payload
                    return (
                      <div className="rounded-lg border p-2 text-xs" style={tooltipStyle}>
                        <p className="font-semibold">{p.name}</p>
                        <p style={{ color: 'var(--color-muted-foreground)' }}>Impact: {p.impact}/10</p>
                        <p style={{ color: 'var(--color-muted-foreground)' }}>Effort: {p.effort} weeks</p>
                      </div>
                    )
                  }}
                />
                <Scatter isAnimationActive={false} data={impactEffortData} shape={(props) => {
                  const { cx, cy, payload } = props as { cx: number; cy: number; payload: { severity: string } }
                  return <circle cx={cx} cy={cy} r={9} fill={scatterColors[payload.severity]} fillOpacity={0.8} />
                }} />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-1">
              {Object.entries(scatterColors).map(([s, c]) => (
                <div key={s} className="flex items-center gap-1.5 text-xs capitalize" style={{ color: 'var(--color-muted-foreground)' }}>
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />{s}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pain point cards by severity */}
      {(['critical', 'high', 'medium'] as const).map(severity => {
        const items = bySeverity(severity)
        if (!items.length) return null
        const cfg = severityConfig[severity]
        const Icon = cfg.icon
        return (
          <div key={severity}>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Icon className="h-5 w-5" style={{ color: cfg.color }} />
              {cfg.label} Priority
              <span className="ml-1 text-sm font-normal" style={{ color: 'var(--color-muted-foreground)' }}>({items.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {items.map(pp => <PainPointCard key={pp.id} pp={pp} />)}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
