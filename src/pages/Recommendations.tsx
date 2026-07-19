import { useState, useEffect } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Sparkles, Target, Zap, CheckCircle2, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CHART, tooltipStyle, axisStyle } from '@/lib/chartColors'
import { mockFeatures } from '@/data/mockData'
import type { Feature } from '@/types'
import { SkeletonPage } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

const statusConfig = {
  'in-progress': { label: 'In Progress', color: CHART.primary, variant: 'default' as const },
  planned: { label: 'Planned', color: CHART.warning, variant: 'warning' as const },
  completed: { label: 'Completed', color: CHART.positive, variant: 'positive' as const },
  backlog: { label: 'Backlog', color: CHART.neutral, variant: 'neutral' as const },
}

// Interactive RICE Calculator
function RICECalculator() {
  const [vals, setVals] = useState({ reach: 50, impact: 5, confidence: 80, effort: 4 })
  const score = Math.round((vals.reach * vals.impact * (vals.confidence / 100)) / vals.effort)
  const maxScore = Math.round((100 * 10 * 1) / 1)

  const fields = [
    { key: 'reach' as const, label: 'Reach', desc: '# of users affected per quarter', min: 1, max: 1000, suffix: 'users' },
    { key: 'impact' as const, label: 'Impact', desc: 'How much does it move the needle?', min: 0.25, max: 10, suffix: '/10', step: 0.25 },
    { key: 'confidence' as const, label: 'Confidence', desc: 'How sure are you of estimates?', min: 10, max: 100, suffix: '%', step: 10 },
    { key: 'effort' as const, label: 'Effort', desc: 'Engineering weeks to ship', min: 1, max: 52, suffix: 'wks' },
  ]

  const tier = score >= 500 ? { label: 'High Priority', color: CHART.positive } :
               score >= 200 ? { label: 'Medium Priority', color: CHART.warning } :
               { label: 'Low Priority', color: CHART.neutral }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" style={{ color: CHART.primary }} />
          Interactive RICE Calculator
        </CardTitle>
        <CardDescription>Adjust sliders to score a new feature request in real time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            {fields.map(({ key, label, desc, min, max, suffix, step = 1 }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">{label}</label>
                  <span className="text-sm font-bold" style={{ color: CHART.primary }}>{vals[key]}{suffix}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={vals[key]}
                  onChange={e => setVals(v => ({ ...v, [key]: parseFloat(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: CHART.primary }}
                />
                <div className="flex justify-between text-xs mt-0.5" style={{ color: '#d1d5db' }}>
                  <span>{min}{suffix}</span>
                  <span>{max}{suffix}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl p-8" style={{ backgroundColor: '#f5f3ff' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-muted-foreground)' }}>RICE Score</p>
            <p className="text-6xl font-bold" style={{ color: CHART.primary }}>{score.toLocaleString()}</p>
            <p className="text-sm mt-2 font-semibold" style={{ color: tier.color }}>{tier.label}</p>
            <div className="w-full mt-6">
              <Progress value={(score / maxScore) * 100} className="h-3" />
              <p className="text-xs text-center mt-1" style={{ color: 'var(--color-muted-foreground)' }}>vs max possible ({maxScore.toLocaleString()})</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              {[
                { label: 'Reach', value: `${vals.reach}` },
                { label: 'Impact', value: `${vals.impact}/10` },
                { label: 'Confidence', value: `${vals.confidence}%` },
                { label: 'Effort', value: `${vals.effort}wk` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
                  <p className="text-sm font-bold" style={{ color: CHART.primary }}>{value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-muted-foreground)' }}>
              Formula: (Reach × Impact × Confidence) ÷ Effort
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ feature, rank }: { feature: Feature; rank: number }) {
  const [expanded, setExpanded] = useState(false)
  const status = statusConfig[feature.status]

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
            #{rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={status.variant}>{status.label}</Badge>
                <Badge variant="outline">{feature.category}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setExpanded(e => !e)}>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            <h3 className="font-semibold">{feature.title}</h3>
            {expanded && <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{feature.description}</p>}

            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { label: 'Reach', value: feature.reach, suffix: '%', color: '#8b5cf6' },
                { label: 'Impact', value: feature.impact, suffix: '/10', color: '#06b6d4' },
                { label: 'Conf.', value: feature.confidence, suffix: '%', color: CHART.positive },
                { label: 'Effort', value: feature.effort, suffix: 'wk', color: CHART.warning },
              ].map(({ label, value, suffix, color }) => (
                <div key={label} className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
                  <p className="text-sm font-bold" style={{ color }}>{value}<span className="text-xs font-normal" style={{ color: 'var(--color-muted-foreground)' }}>{suffix}</span></p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>RICE Score</p>
                <p className="text-xl font-bold" style={{ color: CHART.primary }}>{feature.riceScore.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Target</p>
                <p className="text-sm font-semibold">{feature.quarter}</p>
              </div>
            </div>
            <Progress value={(feature.riceScore / 1600) * 100} className="mt-2 h-1.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Recommendations() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const sorted = [...mockFeatures].sort((a, b) => b.riceScore - a.riceScore)

  const riceChart = sorted.map(f => ({
    name: f.title.length > 20 ? f.title.slice(0, 20) + '…' : f.title,
    score: f.riceScore,
    fill: statusConfig[f.status].color,
  }))

  if (loading) return <SkeletonPage />

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Features', value: mockFeatures.length, icon: Sparkles, color: CHART.primary },
          { label: 'In Progress', value: mockFeatures.filter(f => f.status === 'in-progress').length, icon: Zap, color: CHART.warning },
          { label: 'Planned', value: mockFeatures.filter(f => f.status === 'planned').length, icon: Target, color: CHART.blue },
          { label: 'Completed', value: mockFeatures.filter(f => f.status === 'completed').length, icon: CheckCircle2, color: CHART.positive },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: `${color}20` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RICE chart */}
      <Card>
        <CardHeader>
          <CardTitle>RICE Score Ranking</CardTitle>
          <CardDescription>RICE = (Reach × Impact × Confidence) ÷ Effort — higher = ship first</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={riceChart} layout="vertical" margin={{ left: 0, right: 50, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
              <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={135} tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [typeof v === 'number' ? v.toLocaleString() : String(v), 'RICE Score']} />
              <Bar isAnimationActive={false} dataKey="score" name="RICE Score" radius={[0, 4, 4, 0]}>
                {riceChart.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.entries(statusConfig).map(([, { label, color }]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span style={{ color: 'var(--color-muted-foreground)' }}>{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive calculator */}
      <RICECalculator />

      {/* Feature list */}
      <div>
        <h2 className="text-base font-semibold mb-4">All Feature Recommendations (Prioritized)</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sorted.map((feature, idx) => (
            <FeatureCard key={feature.id} feature={feature} rank={idx + 1} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
