import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, File, CheckCircle2, X, Sparkles, ChevronRight, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAnalysis } from '@/hooks/useAnalysis'

type Status = 'idle' | 'reading' | 'analyzing' | 'done' | 'error'

interface ParsedFile {
  name: string
  size: number
  rowCount: number
  preview: string[]
}

function parseCSV(text: string): string[] {
  return text
    .split('\n')
    .slice(1) // skip header
    .map(line => {
      // Find quoted cell or plain cell with 20+ chars
      const quoted = line.match(/"([^"]{20,})"/)
      if (quoted) return quoted[1].trim()
      const plain = line.split(',').find(c => c.trim().length > 20)
      return plain?.trim() ?? ''
    })
    .filter(Boolean)
}

const PLATFORM_COLUMNS: Record<string, string> = {
  G2: 'review_body',
  'App Store': 'reviewBody',
  Capterra: 'review',
  Trustpilot: 'text',
  Custom: 'text',
}

export default function ReviewUpload() {
  const navigate = useNavigate()
  const { analyzeText, reset } = useAnalysis()

  const [file, setFile] = useState<File | null>(null)
  const [parsed, setParsed] = useState<ParsedFile | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [addedCount, setAddedCount] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [selectedSource, setSelectedSource] = useState('Custom')
  const [error, setError] = useState('')

  const processFile = useCallback((f: File) => {
    if (!f.name.match(/\.(csv|txt)$/i)) {
      setError('Please upload a .csv or .txt file')
      return
    }
    setError('')
    setFile(f)
    setStatus('reading')
    setProgress(20)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = f.name.endsWith('.csv') ? parseCSV(text) : text.split('\n').map(l => l.trim()).filter(l => l.length > 20)
      setParsed({
        name: f.name,
        size: f.size,
        rowCount: rows.length,
        preview: rows.slice(0, 4),
      })
      setProgress(60)
      setStatus('idle')
    }
    reader.readAsText(f)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }

  const handleAnalyze = () => {
    if (!parsed || !file) return
    setStatus('analyzing')
    setProgress(70)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = file.name.endsWith('.csv') ? parseCSV(text) : text.split('\n').map(l => l.trim()).filter(l => l.length > 20)
      setProgress(90)
      setTimeout(() => {
        const count = analyzeText(rows.join('\n'))
        setAddedCount(count)
        setProgress(100)
        setStatus('done')
      }, 800)
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    reset()
    setFile(null)
    setParsed(null)
    setStatus('idle')
    setProgress(0)
    setAddedCount(0)
  }

  return (
    <motion.div className="space-y-5 max-w-4xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
      {/* Success */}
      {status === 'done' && (
        <div className="rounded-xl p-5 flex items-start gap-4" style={{ backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7' }}>
          <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#059669' }} />
          <div className="flex-1">
            <p className="font-semibold" style={{ color: '#065f46' }}>Upload & Analysis Complete</p>
            <p className="text-sm mt-0.5" style={{ color: '#047857' }}>
              Processed <strong>{addedCount}</strong> reviews from <strong>{file?.name}</strong>. All analysis pages have been updated.
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => navigate('/sentiment')}>
                View Sentiment <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Upload Another
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {status !== 'done' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Review File</CardTitle>
            <CardDescription>Drag & drop or click to select a CSV or TXT file exported from any review platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg p-3" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div
              role="button"
              tabIndex={0}
              aria-label="File drop zone — click or press Enter to browse files"
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('file-input')?.click() } }}
              className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
              style={{
                borderColor: dragOver ? '#8b5cf6' : parsed ? '#6ee7b7' : '#d1d5db',
                backgroundColor: dragOver ? '#f5f3ff' : parsed ? '#ecfdf5' : '#fafafa',
              }}
            >
              <input id="file-input" type="file" accept=".csv,.txt" className="hidden" onChange={handleFileInput} />
              {parsed ? (
                <>
                  <CheckCircle2 className="h-12 w-12 mb-3" style={{ color: '#10b981' }} />
                  <p className="font-semibold text-lg">{parsed.name}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                    {file ? (file.size / 1024).toFixed(1) : '?'} KB · <strong>{parsed.rowCount}</strong> reviews detected
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={e => { e.stopPropagation(); handleReset() }}>
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 mb-3" style={{ color: 'var(--color-muted-foreground)' }} />
                  <p className="font-semibold text-lg">Drop your file here</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>or click to browse</p>
                  <div className="flex gap-2 mt-4">
                    {['CSV', 'TXT'].map(f => <Badge key={f} variant="secondary">{f}</Badge>)}
                  </div>
                </>
              )}
            </div>

            {/* Source selector */}
            {parsed && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Review Source Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(PLATFORM_COLUMNS).map(platform => (
                      <button
                        key={platform}
                        onClick={() => setSelectedSource(platform)}
                        aria-pressed={selectedSource === platform}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
                        style={{
                          backgroundColor: selectedSource === platform ? '#8b5cf6' : 'transparent',
                          color: selectedSource === platform ? '#fff' : '#374151',
                          borderColor: selectedSource === platform ? '#8b5cf6' : '#d1d5db',
                        }}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: '#374151' }}>File Preview</p>
                  <div className="space-y-2">
                    {parsed.preview.map((row, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-xs font-mono mt-0.5 shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>#{i+1}</span>
                        <p className="text-xs line-clamp-2" style={{ color: 'var(--color-muted-foreground)' }}>{row}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {(status === 'analyzing') && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--color-muted-foreground)' }}>Analyzing {parsed.rowCount} reviews…</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleAnalyze} disabled={status === 'analyzing'}>
                    {status === 'analyzing' ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />Analyzing…</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-1" />Analyze {parsed.rowCount} Reviews</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Supported platforms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Supported Export Sources</CardTitle>
          <CardDescription>Export CSV from any of these platforms and upload directly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { name: 'G2', tip: 'Reviews → Export CSV' },
              { name: 'App Store', tip: 'App Store Connect export' },
              { name: 'Play Store', tip: 'Google Play Console' },
              { name: 'Capterra', tip: 'Reviews section export' },
              { name: 'Trustpilot', tip: 'Business dashboard export' },
              { name: 'Custom CSV', tip: 'Any CSV with a text column' },
            ].map(({ name, tip }) => (
              <div key={name} className="flex items-start gap-2 rounded-lg border p-3" style={{ borderColor: 'var(--color-border)' }}>
                <File className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#8b5cf6' }} />
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
