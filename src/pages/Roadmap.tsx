import { useState, useEffect } from 'react'
import type { ElementType } from 'react'
import { CheckCircle2, Circle, Clock, Archive, LayoutGrid, AlignLeft, BarChart2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CHART } from '@/lib/chartColors'
import { mockFeatures } from '@/data/mockData'
import { SkeletonPage } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

const quarters = ['Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'] as const

const statusConfig = {
  completed: { icon: CheckCircle2, color: CHART.positive, label: 'Done', variant: 'positive' as const },
  'in-progress': { icon: Clock, color: CHART.primary, label: 'In Progress', variant: 'default' as const },
  planned: { icon: Circle, color: CHART.warning, label: 'Planned', variant: 'warning' as const },
  backlog: { icon: Archive, color: CHART.neutral, label: 'Backlog', variant: 'neutral' as const },
}

// Gantt chart — simple horizontal bars by quarter
function GanttView() {
  const quarterIndex: Record<string, number> = { 'Q4 2024': 0, 'Q1 2025': 1, 'Q2 2025': 2, 'Q3 2025': 3 }
  const quarterLabels = ['Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025']

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gantt View</CardTitle>
        <CardDescription>Feature delivery timeline by quarter</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Quarter header */}
        <div className="grid mb-2" style={{ gridTemplateColumns: '180px repeat(4, 1fr)' }}>
          <div />
          {quarterLabels.map(q => (
            <div key={q} className="text-center text-xs font-semibold py-1.5 rounded-md mx-0.5" style={{ backgroundColor: 'var(--color-muted)', color: '#374151' }}>
              {q}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {mockFeatures.map(feature => {
            const cfg = statusConfig[feature.status]
            const Icon = cfg.icon
            const qi = quarterIndex[feature.quarter] ?? 0
            const span = feature.status === 'in-progress' ? 2 : 1

            return (
              <div key={feature.id} className="grid items-center gap-1" style={{ gridTemplateColumns: '180px repeat(4, 1fr)' }}>
                <div className="flex items-center gap-2 pr-2">
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cfg.color }} />
                  <span className="text-xs truncate" title={feature.title}>{feature.title}</span>
                </div>
                {[0, 1, 2, 3].map(col => {
                  const inRange = col >= qi && col < qi + span
                  return (
                    <div key={col} className="h-7 mx-0.5 rounded-md flex items-center justify-center" style={{
                      backgroundColor: inRange ? `${cfg.color}22` : 'transparent',
                      border: inRange ? `1px solid ${cfg.color}55` : '1px solid transparent',
                    }}>
                      {inRange && col === qi && (
                        <span className="text-xs font-medium truncate px-2" style={{ color: cfg.color }}>
                          {feature.effort}wk
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
          {Object.entries(statusConfig).map(([, { label, color, icon: Icon }]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              <Icon className="h-3.5 w-3.5" style={{ color }} />
              {label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function KanbanView() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
      {(['completed', 'in-progress', 'planned', 'backlog'] as const).map(status => {
        const cfg = statusConfig[status]
        const Icon = cfg.icon
        const items = mockFeatures.filter(f => f.status === status)
        return (
          <div key={status} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color: cfg.color }} />
              <h3 className="text-sm font-semibold">{cfg.label}</h3>
              <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>{items.length}</span>
            </div>
            {items.map(f => (
              <div key={f.id} className="rounded-xl border p-4 shadow-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}>
                <p className="text-sm font-semibold mb-1">{f.title}</p>
                <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-muted-foreground)' }}>{f.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className="text-xs">{f.category}</Badge>
                  <Badge variant="secondary" className="text-xs">{f.quarter}</Badge>
                </div>
                <div className="flex justify-between text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  <span>RICE: <span className="font-bold" style={{ color: CHART.primary }}>{f.riceScore}</span></span>
                  <span>{f.effort}wk</span>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function TimelineView() {
  return (
    <div className="space-y-8">
      {quarters.map(quarter => {
        const items = mockFeatures.filter(f => f.quarter === quarter)
        if (!items.length) return null
        return (
          <div key={quarter}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ backgroundColor: '#e5e7eb' }} />
              <h2 className="text-sm font-bold px-4 py-1.5 rounded-full border" style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}>{quarter}</h2>
              <div className="h-px flex-1" style={{ backgroundColor: '#e5e7eb' }} />
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {items.map(f => {
                const cfg = statusConfig[f.status]
                const Icon = cfg.icon
                return (
                  <div key={f.id} className="flex gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
                    <Icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: cfg.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold">{f.title}</p>
                        <Badge variant={cfg.variant} className="shrink-0">{cfg.label}</Badge>
                      </div>
                      <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--color-muted-foreground)' }}>{f.description}</p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                        <Badge variant="outline">{f.category}</Badge>
                        <span>RICE: <strong style={{ color: CHART.primary }}>{f.riceScore}</strong></span>
                        <span>{f.effort}wk effort</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type View = 'kanban' | 'timeline' | 'gantt'

export default function Roadmap() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const [view, setView] = useState<View>('kanban')

  const completed = mockFeatures.filter(f => f.status === 'completed').length
  const total = mockFeatures.length

  const views: Array<{ id: View; label: string; icon: ElementType }> = [
    { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
    { id: 'timeline', label: 'Timeline', icon: AlignLeft },
    { id: 'gantt', label: 'Gantt', icon: BarChart2 },
  ]

  if (loading) return <SkeletonPage />

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            <span className="font-semibold">{completed}</span> of <span className="font-semibold">{total}</span> features shipped
          </p>
          <Progress value={(completed / total) * 100} className="w-56 mt-2 h-2.5" />
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--color-muted)' }}>
          {views.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={view === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView(id)}
              className="gap-1.5"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {view === 'kanban' && <KanbanView />}
      {view === 'timeline' && <TimelineView />}
      {view === 'gantt' && <GanttView />}

      {/* Category breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>By Category</CardTitle>
          <CardDescription>Feature distribution across product areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from(new Set(mockFeatures.map(f => f.category))).map(cat => {
              const catFeatures = mockFeatures.filter(f => f.category === cat)
              const done = catFeatures.filter(f => f.status === 'completed').length
              return (
                <div key={cat} className="rounded-xl border p-3 text-center" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-2xl font-bold" style={{ color: CHART.primary }}>{catFeatures.length}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{cat}</p>
                  {done > 0 && <p className="text-xs mt-1" style={{ color: CHART.positive }}>{done} done</p>}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
