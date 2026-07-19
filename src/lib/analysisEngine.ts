import type { Review, Sentiment, Theme, PainPoint } from '@/types'

// Keyword maps for mock sentiment classification
const POSITIVE_WORDS = ['love', 'great', 'amazing', 'excellent', 'perfect', 'outstanding', 'fantastic', 'good', 'awesome', 'wonderful', 'helpful', 'easy', 'intuitive', 'fast', 'reliable', 'impressive', 'best', 'happy', 'satisfied', 'recommend']
const NEGATIVE_WORDS = ['terrible', 'awful', 'broken', 'slow', 'confusing', 'bad', 'worst', 'frustrating', 'useless', 'disappointing', 'horrible', 'annoying', 'difficult', 'problem', 'issue', 'bug', 'crash', 'unusable', 'hate', 'poor']

const THEME_KEYWORDS: Record<string, string[]> = {
  'Onboarding': ['onboard', 'setup', 'getting started', 'first time', 'sign up', 'tutorial', 'wizard'],
  'UI/UX': ['interface', 'design', 'ui', 'ux', 'layout', 'button', 'navigation', 'confusing', 'intuitive', 'look'],
  'Performance': ['slow', 'fast', 'speed', 'performance', 'load', 'lag', 'quick', 'responsive', 'timeout'],
  'Mobile': ['mobile', 'app', 'ios', 'android', 'phone', 'tablet', 'responsive'],
  'Integrations': ['integration', 'connect', 'api', 'webhook', 'sync', 'import', 'export', 'plugin'],
  'Analytics': ['analytics', 'dashboard', 'chart', 'report', 'insights', 'metrics', 'data'],
  'Support': ['support', 'help', 'customer service', 'team', 'response', 'ticket'],
  'Pricing': ['price', 'pricing', 'cost', 'expensive', 'affordable', 'value', 'plan', 'subscription'],
  'AI Features': ['ai', 'artificial intelligence', 'machine learning', 'auto', 'smart', 'predict'],
}

const PAIN_POINT_PATTERNS: Array<{ pattern: RegExp; title: string; severity: PainPoint['severity'] }> = [
  { pattern: /onboard|setup|confusing.*start/i, title: 'Confusing onboarding flow', severity: 'critical' },
  { pattern: /mobile.*broken|broken.*mobile|app.*unusable|phone.*crash/i, title: 'Mobile app issues', severity: 'critical' },
  { pattern: /slow|lag|timeout|10.*second|loading/i, title: 'Performance issues', severity: 'high' },
  { pattern: /search|can.*find|filter/i, title: 'Poor search experience', severity: 'high' },
  { pattern: /bulk|one by one|repetitive/i, title: 'Missing bulk actions', severity: 'high' },
  { pattern: /export|download|csv/i, title: 'Limited export options', severity: 'medium' },
  { pattern: /price|expensive|cost.*increase/i, title: 'Pricing concerns', severity: 'medium' },
]

export function classifySentiment(text: string): Sentiment {
  const lower = text.toLowerCase()
  let score = 0
  POSITIVE_WORDS.forEach(w => { if (lower.includes(w)) score++ })
  NEGATIVE_WORDS.forEach(w => { if (lower.includes(w)) score-- })
  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

export function detectThemes(text: string): string[] {
  const lower = text.toLowerCase()
  return Object.entries(THEME_KEYWORDS)
    .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
    .map(([theme]) => theme)
    .slice(0, 4)
}

export function estimateRating(text: string, sentiment: Sentiment): number {
  const starMatch = text.match(/(\d)[\s/-]?(?:star|\/5|out of 5)/i)
  if (starMatch) return parseInt(starMatch[1])
  // Deterministic fallback — use text length as a cheap hash seed
  const seed = text.length % 2
  if (sentiment === 'positive') return seed === 0 ? 5 : 4
  if (sentiment === 'negative') return seed === 0 ? 1 : 2
  return 3
}

export function parseReviewsFromText(rawText: string): Review[] {
  const lines = rawText
    .split(/\n+/)
    .map(l => l.trim().replace(/^["']|["']$/g, '').trim())
    .filter(l => l.length > 20)

  return lines.map((text, i) => {
    const sentiment = classifySentiment(text)
    const themes = detectThemes(text)
    const rating = estimateRating(text, sentiment)
    return {
      id: `parsed-${Date.now()}-${i}`,
      text,
      source: 'Manual Input',
      date: new Date().toISOString().slice(0, 10),
      rating,
      sentiment,
      themes: themes.length > 0 ? themes : ['General'],
    }
  })
}

export function buildThemeSummary(reviews: Review[]): Theme[] {
  const counts: Record<string, { count: number; pos: number; neg: number }> = {}
  reviews.forEach(r => {
    r.themes.forEach(t => {
      if (!counts[t]) counts[t] = { count: 0, pos: 0, neg: 0 }
      counts[t].count++
      if (r.sentiment === 'positive') counts[t].pos++
      if (r.sentiment === 'negative') counts[t].neg++
    })
  })
  const total = reviews.length || 1  // guard division by zero
  return Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([name, { count, pos, neg }], i) => ({
      id: String(i),
      name,
      count,
      sentiment: (pos > neg ? 'positive' : neg > pos ? 'negative' : 'neutral') as Sentiment,
      percentage: Math.round((count / total) * 100),
      trend: 'stable' as const,
    }))
}

export function detectPainPoints(reviews: Review[]): PainPoint[] {
  return PAIN_POINT_PATTERNS
    .map((pp, i) => {
      const matching = reviews.filter(r => pp.pattern.test(r.text) && r.sentiment === 'negative')
      if (matching.length === 0) return null
      const frequency = Math.round((matching.length / reviews.length) * 100)
      return {
        id: String(i),
        title: pp.title,
        description: `Detected in ${matching.length} review${matching.length > 1 ? 's' : ''}. Sample: "${matching[0].text.slice(0, 120)}…"`,
        severity: pp.severity,
        frequency,
        affectedUsers: matching.length * 80,
        themes: detectThemes(matching[0].text),
      } satisfies PainPoint
    })
    .filter(Boolean) as PainPoint[]
}
