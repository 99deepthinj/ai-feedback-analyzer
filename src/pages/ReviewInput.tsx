import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, CheckCircle2, ChevronRight, RotateCcw, Loader2, PenLine } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useToast } from '@/hooks/useToast'
import { classifySentiment, detectThemes } from '@/lib/analysisEngine'
import { SAMPLE_DATASETS } from '@/data/sampleDatasets'

type Status = 'idle' | 'analyzing' | 'done'

function PreviewLine({ text }: { text: string }) {
  const sentiment = classifySentiment(text)
  const themes = detectThemes(text)
  return (
    <div className="rounded-lg border p-3 space-y-1.5" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={sentiment === 'positive' ? 'positive' : sentiment === 'negative' ? 'negative' : 'neutral'}>
          {sentiment}
        </Badge>
        {themes.slice(0, 3).map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>{t}</span>
        ))}
      </div>
      <p className="text-sm line-clamp-2">{text}</p>
    </div>
  )
}

export default function ReviewInput() {
  const navigate = useNavigate()
  const { analyzeText, reset } = useAnalysis()
  const { addToast } = useToast()
  const [text, setText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [addedCount, setAddedCount] = useState(0)

  const previewLines = text.trim()
    ? text.split('\n').map(l => l.trim().replace(/^["']|["']$/g, '').trim()).filter(l => l.length > 20).slice(0, 6)
    : []

  const handleAnalyze = () => {
    if (!text.trim()) return
    setStatus('analyzing')
    setTimeout(() => {
      const count = analyzeText(text)
      setAddedCount(count)
      setStatus('done')
      addToast({
        title: 'Analysis complete',
        description: `${count} review${count !== 1 ? 's' : ''} analyzed successfully`,
        variant: 'success',
      })
    }, 1800)
  }

  const handleReset = () => {
    reset()
    setText('')
    setStatus('idle')
    setAddedCount(0)
  }

  const loadDataset = (key: string) => {
    const ds = SAMPLE_DATASETS[key]
    if (!ds) return
    setText(ds.reviews.join('\n\n'))
    setStatus('idle')
    setAddedCount(0)
    addToast({
      title: `${ds.label} dataset loaded`,
      description: `${ds.reviews.length} reviews ready to analyze`,
      variant: 'default',
    })
  }

  return (
    <motion.div className="grid grid-cols-1 gap-6 lg:grid-cols-2 max-w-6xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
      {/* Input panel */}
      <div className="space-y-4">
        {/* Dataset picker */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Load Sample Dataset</CardTitle>
            <CardDescription>One click to load real-world reviews — or paste your own below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SAMPLE_DATASETS).map(([key, ds]) => (
                <button
                  key={key}
                  onClick={() => loadDataset(key)}
                  aria-label={`Load ${ds.label} dataset — ${ds.description}`}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] cursor-pointer"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
                >
                  <span aria-hidden="true">{ds.emoji}</span>
                  {ds.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Text input */}
        <Card>
          <CardHeader>
            <CardTitle>Paste Customer Reviews</CardTitle>
            <CardDescription>
              One review per line or as a block of text. The AI engine classifies sentiment, extracts themes, and identifies pain points automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'done' && (
              <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7' }}>
                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#059669' }} />
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#065f46' }}>Analysis Complete</p>
                  <p className="text-sm mt-0.5" style={{ color: '#047857' }}>
                    Processed <strong>{addedCount}</strong> reviews. All analysis pages have been updated.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => navigate('/sentiment')}>
                      View Sentiment <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate('/reviews')}>
                      All Reviews
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" /> Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="reviews-textarea" className="text-sm font-medium mb-1.5 block">
                Review text <span className="text-xs font-normal" style={{ color: 'var(--color-muted-foreground)' }}>({previewLines.length} detected)</span>
              </label>
              <Textarea
                id="reviews-textarea"
                placeholder={`Paste reviews here, one per line:\n\nThe onboarding is confusing and took 30 minutes to set up.\nLove the analytics dashboard — the charts are beautiful!\nMobile app crashes constantly on Android devices.`}
                value={text}
                onChange={e => setText(e.target.value)}
                className="min-h-[240px] font-mono text-sm resize-y"
                aria-label="Customer review text input"
              />
            </div>

            {text.trim() && (
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                <span>{text.split('\n').filter(l => l.trim().length > 20).length} valid lines detected</span>
                <button onClick={() => setText('')} aria-label="Clear text" className="flex items-center gap-1 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] rounded">
                  <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || status === 'analyzing'}
                className="flex-1"
              >
                {status === 'analyzing' ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />Analyzing…</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />Analyze Reviews</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Format tips */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Supported Input Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              {[
                { label: 'Plain text', example: 'App is slow and crashes often.' },
                { label: 'Quoted strings', example: '"Love the new dashboard design!"' },
                { label: 'Star ratings', example: 'Great product. 4/5 stars.' },
                { label: 'CSV rows', example: '1,G2,"Excellent integrations",5' },
              ].map(({ label, example }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="font-semibold shrink-0 text-[#8b5cf6] w-24">{label}</span>
                  <code className="bg-[var(--color-muted)] px-1.5 py-0.5 rounded text-xs">{example}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              {previewLines.length > 0
                ? `${previewLines.length} line${previewLines.length !== 1 ? 's' : ''} detected — sentiment and themes classified in real time`
                : 'Load a dataset or paste reviews to see live classification'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {previewLines.length === 0 ? (
              <div className="py-12 text-center rounded-xl" style={{ backgroundColor: 'var(--color-muted)' }}>
                <PenLine className="h-8 w-8 mx-auto mb-3 opacity-30" aria-hidden="true" />
                <p className="text-sm font-medium">No reviews detected yet</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>Reviews must be longer than 20 characters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {previewLines.map((line, i) => (
                  <PreviewLine key={i} text={line} />
                ))}
                {text.split('\n').filter(l => l.trim().length > 20).length > 6 && (
                  <p className="text-xs text-center py-2" style={{ color: 'var(--color-muted-foreground)' }}>
                    + {text.split('\n').filter(l => l.trim().length > 20).length - 6} more will be analyzed
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sentiment summary preview */}
        {previewLines.length > 0 && (() => {
          const pos = previewLines.filter(l => classifySentiment(l) === 'positive').length
          const neg = previewLines.filter(l => classifySentiment(l) === 'negative').length
          const neu = previewLines.filter(l => classifySentiment(l) === 'neutral').length
          const total = previewLines.length
          return (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sentiment Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-3 rounded-full overflow-hidden mb-3">
                  <div style={{ width: `${(pos / total) * 100}%`, backgroundColor: '#10b981' }} />
                  <div style={{ width: `${(neg / total) * 100}%`, backgroundColor: '#ef4444' }} />
                  <div style={{ width: `${(neu / total) * 100}%`, backgroundColor: '#94a3b8' }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#10b981' }}>✓ {pos} positive</span>
                  <span style={{ color: '#ef4444' }}>✗ {neg} negative</span>
                  <span style={{ color: '#94a3b8' }}>― {neu} neutral</span>
                </div>
              </CardContent>
            </Card>
          )
        })()}
      </div>
    </motion.div>
  )
}
