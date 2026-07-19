import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquarePlus, Upload, BarChart3, BrainCircuit, AlertCircle,
  Sparkles, Map, Download, ChevronDown, ChevronUp, ArrowLeft,
  Lightbulb, Search, FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CHART } from '@/lib/chartColors'

interface Section {
  id: string
  icon: typeof MessageSquarePlus
  color: string
  title: string
  badge?: string
  steps: string[]
  tips?: string[]
}

const sections: Section[] = [
  {
    id: 'input',
    icon: MessageSquarePlus,
    color: CHART.primary,
    title: 'Review Input',
    badge: 'Start here',
    steps: [
      'Navigate to "Review Input" in the sidebar.',
      'Paste customer feedback — one review per line — into the text area.',
      'The right panel shows a live preview with detected sentiment and themes for each line.',
      'Click "Analyze Reviews" to run the full analysis and update all other pages.',
      'Use the "Load Sample Data" button to load 15 pre-written demo reviews instantly.',
    ],
    tips: [
      'Reviews with 20+ characters are processed; shorter lines are ignored.',
      'You can mix formats: plain text, quoted strings, and CSV rows all work.',
    ],
  },
  {
    id: 'upload',
    icon: Upload,
    color: CHART.blue,
    title: 'Upload Reviews',
    steps: [
      'Navigate to "Upload Reviews" in the sidebar.',
      'Drag and drop a .csv or .txt file onto the drop zone, or click to browse.',
      'Select the source platform (G2, App Store, Capterra, etc.) for context.',
      'A preview shows the first 4 extracted review rows.',
      'Click "Analyze N Reviews" to process the file.',
    ],
    tips: [
      'CSV files: the parser extracts quoted strings or cells with 20+ characters.',
      'TXT files: each non-empty line with 20+ characters is treated as one review.',
      'Keyboard users can press Enter or Space on the drop zone to open the file picker.',
    ],
  },
  {
    id: 'sentiment',
    icon: BarChart3,
    color: CHART.positive,
    title: 'Sentiment Analysis',
    steps: [
      'After analyzing reviews, open "Sentiment Analysis".',
      'The summary cards show positive / negative / neutral counts and percentages.',
      'The trend chart shows sentiment over time (based on mock dates in demo data).',
      'The radar chart compares positive vs. negative by category (UI, Pricing, etc.).',
      'Scroll down to see all classified reviews with source badges and star ratings.',
    ],
  },
  {
    id: 'themes',
    icon: BrainCircuit,
    color: CHART.primary,
    title: 'Theme Detection',
    steps: [
      'Open "Theme Detection" to see recurring topics across your reviews.',
      'The bar chart shows mention volume per theme, colored by sentiment.',
      'The word cloud sizes each theme by frequency — larger = more mentions.',
      'The scatter plot maps themes by volume (x) and positivity score (y).',
      'Scroll to "Theme Breakdown" cards to see sample quotes per theme.',
    ],
    tips: [
      'Themes are detected by keyword matching (e.g., "slow", "lag" → Performance).',
      'The y-axis positivity score is deterministic, not random — it derives from the theme name.',
    ],
  },
  {
    id: 'pain-points',
    icon: AlertCircle,
    color: CHART.negative,
    title: 'Pain Point Analysis',
    steps: [
      'Open "Pain Points" to see issues ranked by severity.',
      'The severity summary cards (Critical / High / Medium / Low) show counts at a glance.',
      'The frequency bar chart shows how often each issue appears.',
      'The Impact × Effort scatter plot helps identify quick wins (top-left) vs. big bets (top-right).',
      'Pain point cards show frequency %, affected users, and related themes.',
    ],
  },
  {
    id: 'recommendations',
    icon: Sparkles,
    color: CHART.warning,
    title: 'Feature Recommendations',
    steps: [
      'Open "Recommendations" to see AI-suggested features ranked by RICE score.',
      'Higher RICE = higher priority to build next.',
      'Expand any feature card (chevron button) to read the full description.',
      'Use the interactive RICE Calculator below the chart to score your own ideas.',
      'Adjust Reach, Impact, Confidence, and Effort sliders — the score updates live.',
    ],
    tips: [
      'RICE Formula: (Reach × Impact × Confidence%) ÷ Effort',
      'A score ≥ 500 is High Priority · 200–499 is Medium · below 200 is Low.',
    ],
  },
  {
    id: 'roadmap',
    icon: Map,
    color: CHART.positive,
    title: 'Product Roadmap',
    steps: [
      'Open "Product Roadmap" to visualize feature delivery across quarters.',
      'Switch between Kanban (by status), Timeline (by quarter), and Gantt (CSS grid) views.',
      'The progress bar at the top shows completed vs. total features.',
      'The "By Category" grid at the bottom breaks features down by product area.',
    ],
  },
  {
    id: 'export',
    icon: Download,
    color: '#6366f1',
    title: 'Export Report',
    steps: [
      'Open "Export Report" to generate a shareable report.',
      'Select PDF, Excel, PowerPoint, or JSON format.',
      'Check/uncheck report sections to customize the output.',
      'Click "Export Report" — a progress animation simulates generation.',
      'For JSON format, the download starts automatically with real data.',
      'PDF, Excel, and PPTX exports are simulated in this demo.',
    ],
  },
]

const faqs = [
  {
    q: 'Is my data sent to any server?',
    a: 'No. All processing happens in your browser. No data leaves your machine.',
  },
  {
    q: 'How accurate is the sentiment analysis?',
    a: 'It uses keyword matching (e.g., "great", "love" → positive; "broken", "slow" → negative). It\'s intentionally simple to demonstrate the UI — not production ML accuracy.',
  },
  {
    q: 'Can I use my own reviews?',
    a: 'Yes! Paste any text into Review Input or upload a CSV. The engine processes whatever you provide.',
  },
  {
    q: 'Does it work in dark mode?',
    a: 'Yes. Click the moon icon in the top-right header to toggle dark mode. Your preference is saved in localStorage.',
  },
  {
    q: 'Can I export to PDF?',
    a: 'PDF, Excel, and PPTX exports are simulated in this demo (they show a progress animation). JSON export produces a real downloadable file.',
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
      <button
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] rounded"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {q}
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 ml-2" aria-hidden="true" style={{ color: 'var(--color-muted-foreground)' }} />
          : <ChevronDown className="h-4 w-4 shrink-0 ml-2" aria-hidden="true" style={{ color: 'var(--color-muted-foreground)' }} />
        }
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>{a}</p>
      )}
    </div>
  )
}

export default function Help() {
  const navigate = useNavigate()

  return (
    <motion.div className="space-y-8 max-w-4xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-1">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Help &amp; User Guide</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Everything you need to get value from AI Feedback Analyzer in minutes.
        </p>
      </div>

      {/* Quick start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" aria-hidden="true" style={{ color: CHART.warning }} />
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {[
              { step: '1', text: 'Go to Review Input and click "Load Sample Data" to see the app with demo reviews.' },
              { step: '2', text: 'Click "Analyze Reviews" to run the analysis engine.' },
              { step: '3', text: 'Explore Sentiment Analysis, Theme Detection, and Pain Points in the sidebar.' },
              { step: '4', text: 'Check Recommendations for RICE-prioritized features and the interactive calculator.' },
              { step: '5', text: 'Try the roadmap views (Kanban / Timeline / Gantt) and export a JSON report.' },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#8b5cf6' }}>
                  {step}
                </span>
                <p className="text-sm leading-relaxed pt-0.5">{text}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Page-by-page guide */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5" aria-hidden="true" style={{ color: CHART.primary }} />
          Page-by-Page Guide
        </h2>
        <div className="space-y-4">
          {sections.map(({ id, icon: Icon, color, title, badge, steps, tips }) => (
            <Card key={id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
                    <Icon className="h-4 w-4" aria-hidden="true" style={{ color }} />
                  </div>
                  {title}
                  {badge && <Badge variant="secondary" className="text-xs ml-1">{badge}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-2">
                  {steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="shrink-0 font-mono text-xs mt-0.5 w-4 text-right" style={{ color: 'var(--color-muted-foreground)' }}>{i + 1}.</span>
                      <span style={{ color: 'var(--color-foreground)' }}>{s}</span>
                    </li>
                  ))}
                </ol>
                {tips && tips.length > 0 && (
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(109,93,246,0.08)', borderLeft: '3px solid var(--color-primary)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>Pro tips</p>
                    {tips.map(t => (
                      <p key={t} className="text-xs leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>· {t}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" aria-hidden="true" style={{ color: CHART.blue }} />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {faqs.map(({ q, a }) => (
            <AccordionItem key={q} q={q} a={a} />
          ))}
        </CardContent>
      </Card>

      {/* Footer nav */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/dashboard')}>
          Open Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate('/about')}>
          About this project
        </Button>
      </div>
    </motion.div>
  )
}
