import { motion } from 'framer-motion'
import { useState } from 'react'
import type { ElementType } from 'react'
import { Download, FileText, FileSpreadsheet, Presentation, CheckCircle2, Loader2, Printer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useToast } from '@/hooks/useToast'

type ExportFormat = 'pdf' | 'excel' | 'pptx' | 'json' | 'csv'
type ExportStatus = 'idle' | 'generating' | 'done'

interface ExportOption {
  id: ExportFormat
  title: string
  description: string
  icon: ElementType
  badge: string
  size: string
  real: boolean
}

const exportOptions: ExportOption[] = [
  {
    id: 'pdf',
    title: 'PDF Report',
    description: 'Full analysis report via browser print dialog. Click "Save as PDF" in the print window for a pixel-perfect export with all charts.',
    icon: Printer,
    badge: 'Most Popular',
    size: 'Native',
    real: true,
  },
  {
    id: 'csv',
    title: 'CSV Export',
    description: 'All review data in CSV format with sentiment, source, rating, date, and themes. Opens in Excel, Google Sheets, or any spreadsheet app.',
    icon: FileSpreadsheet,
    badge: 'Real Download',
    size: 'Dynamic',
    real: true,
  },
  {
    id: 'json',
    title: 'JSON Export',
    description: 'Complete structured data export — themes, pain points, features, and reviews. Perfect for API consumption or custom analysis pipelines.',
    icon: FileText,
    badge: 'Real Download',
    size: 'Dynamic',
    real: true,
  },
  {
    id: 'excel',
    title: 'Excel Spreadsheet',
    description: 'Simulated export demonstrating the UX flow. A real implementation would use SheetJS or server-side generation.',
    icon: FileSpreadsheet,
    badge: 'Simulated',
    size: '~1.1 MB',
    real: false,
  },
  {
    id: 'pptx',
    title: 'PowerPoint Deck',
    description: 'Simulated export demonstrating the UX flow. A real implementation would use PptxGenJS or server-side generation.',
    icon: Presentation,
    badge: 'Simulated',
    size: '~3.8 MB',
    real: false,
  },
]

const sections = [
  { id: 'summary', label: 'Executive Summary', checked: true },
  { id: 'sentiment', label: 'Sentiment Analysis', checked: true },
  { id: 'themes', label: 'Theme Detection', checked: true },
  { id: 'pain_points', label: 'Pain Points', checked: true },
  { id: 'recommendations', label: 'Feature Recommendations', checked: true },
  { id: 'rice', label: 'RICE Prioritization', checked: true },
  { id: 'roadmap', label: 'Product Roadmap', checked: false },
  { id: 'raw_reviews', label: 'Raw Review Data', checked: false },
]

export default function Export() {
  const { reviews, themes, painPoints } = useAnalysis()
  const { addToast } = useToast()
  const [selected, setSelected] = useState<ExportFormat>('pdf')
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [enabledSections, setEnabledSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.checked).map(s => s.id))
  )

  const toggleSection = (id: string) => {
    setEnabledSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const downloadBlob = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  const handleExport = () => {
    if (selected === 'pdf') {
      addToast({ title: 'Opening print dialog', description: 'Choose "Save as PDF" in the print window', variant: 'default' })
      setTimeout(() => window.print(), 400)
      return
    }

    if (selected === 'csv') {
      const header = ['ID', 'Text', 'Source', 'Date', 'Rating', 'Sentiment', 'Themes']
      const rows = reviews.map(r => [
        r.id,
        `"${r.text.replace(/"/g, '""')}"`,
        r.source,
        r.date,
        r.rating,
        r.sentiment,
        `"${r.themes.join('|')}"`,
      ])
      const csv = [header, ...rows].map(row => row.join(',')).join('\n')
      downloadBlob(csv, `feedback-reviews-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;')
      addToast({ title: 'CSV downloaded', description: `${reviews.length} reviews exported`, variant: 'success' })
      return
    }

    if (selected === 'json') {
      const data = {
        generatedAt: new Date().toISOString(),
        totalReviews: reviews.length,
        reviews,
        themes,
        painPoints,
        sections: [...enabledSections],
      }
      downloadBlob(JSON.stringify(data, null, 2), `feedback-analysis-${new Date().toISOString().slice(0, 10)}.json`, 'application/json')
      addToast({ title: 'JSON downloaded', description: `Complete analysis data exported`, variant: 'success' })
      return
    }

    // Simulated exports (excel, pptx)
    setStatus('generating')
    setTimeout(() => {
      setStatus('done')
      addToast({
        title: `${selected.toUpperCase()} export complete`,
        description: 'In a real implementation, this would download the file.',
        variant: 'success',
      })
      setTimeout(() => setStatus('idle'), 3000)
    }, 2500)
  }

  const selectedOption = exportOptions.find(o => o.id === selected)

  return (
    <motion.div className="space-y-5 max-w-4xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
      {/* Stats preview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Reviews', value: reviews.length.toLocaleString() },
          { label: 'Themes Detected', value: themes.length },
          { label: 'Pain Points', value: painPoints.length },
          { label: 'Export Sections', value: enabledSections.size },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Export Format</CardTitle>
          <CardDescription>PDF, CSV, and JSON produce real downloads. Excel and PPTX demonstrate the UX flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exportOptions.map(opt => {
              const Icon = opt.icon
              const isSelected = selected === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  aria-pressed={isSelected}
                  className="flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
                  style={{
                    borderColor: isSelected ? '#8b5cf6' : 'var(--color-border)',
                    backgroundColor: isSelected ? 'rgba(139,92,246,0.06)' : 'var(--color-card)',
                  }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: isSelected ? '#8b5cf6' : 'var(--color-muted)' }}>
                    <Icon className="h-5 w-5" aria-hidden="true" style={{ color: isSelected ? '#fff' : '#6b7280' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: isSelected ? '#7c3aed' : 'var(--color-foreground)' }}>
                        {opt.title}
                      </span>
                      <Badge
                        variant={opt.real ? 'positive' : 'secondary'}
                        className="text-xs shrink-0"
                        style={opt.real ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.3)' } : {}}
                      >
                        {opt.badge}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>{opt.description}</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>{opt.size}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 text-[#8b5cf6] shrink-0 mt-0.5" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section Selection — only for formats that support it */}
      {(selected === 'pdf' || selected === 'json' || selected === 'excel' || selected === 'pptx') && (
        <Card>
          <CardHeader>
            <CardTitle>Report Sections</CardTitle>
            <CardDescription>Choose which sections to include</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sections.map(section => {
                const enabled = enabledSections.has(section.id)
                return (
                  <label
                    key={section.id}
                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all"
                    style={{
                      borderColor: enabled ? 'rgba(139,92,246,0.3)' : 'var(--color-border)',
                      backgroundColor: enabled ? 'rgba(139,92,246,0.04)' : 'var(--color-card)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleSection(section.id)}
                      className="h-4 w-4"
                      style={{ accentColor: '#8b5cf6' }}
                    />
                    <span className="text-sm font-medium flex-1" style={{ color: 'var(--color-foreground)' }}>
                      {section.label}
                    </span>
                    {section.checked && (
                      <Badge variant="secondary" className="text-xs ml-auto">Recommended</Badge>
                    )}
                  </label>
                )
              })}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
              {enabledSections.size} of {sections.length} sections selected
            </p>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
                {selectedOption?.real ? 'Real download ready' : 'Demo export'}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                {selectedOption?.title} format · {reviews.length} reviews
                {!selectedOption?.real && ' · Simulated for demo purposes'}
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleExport}
              disabled={status === 'generating' || enabledSections.size === 0}
              className="min-w-[160px]"
            >
              {status === 'generating' ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />Generating…</>
              ) : status === 'done' ? (
                <><CheckCircle2 className="h-4 w-4 mr-2" aria-hidden="true" />Done!</>
              ) : selected === 'pdf' ? (
                <><Printer className="h-4 w-4 mr-2" aria-hidden="true" />Print / Save PDF</>
              ) : (
                <><Download className="h-4 w-4 mr-2" aria-hidden="true" />Export {selected.toUpperCase()}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports (mock) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>Your last 3 generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Q4 2024 Analysis.pdf', date: '2024-12-09', size: '2.4 MB', format: 'PDF' },
              { name: 'November Report.csv', date: '2024-12-01', size: '0.3 MB', format: 'CSV' },
              { name: 'Stakeholder Data.json', date: '2024-11-15', size: '0.2 MB', format: 'JSON' },
            ].map(({ name, date, size, format }) => (
              <div key={name} className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <FileText className="h-4 w-4" aria-hidden="true" style={{ color: 'var(--color-muted-foreground)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{date} · {size}</p>
                </div>
                <Badge variant="secondary">{format}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label={`Download ${name}`}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
