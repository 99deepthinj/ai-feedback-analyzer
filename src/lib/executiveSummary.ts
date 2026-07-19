import type { Review, Theme, PainPoint } from '@/types'

export function generateExecutiveSummary(
  reviews: Review[],
  themes: Theme[],
  painPoints: PainPoint[],
): string {
  if (!reviews.length) {
    return 'No reviews have been analyzed yet. Load a sample dataset or paste customer reviews to generate an executive summary.'
  }

  const total = reviews.length
  const sources = [...new Set(reviews.map(r => r.source))]
  const sourceCount = sources.length

  const pos = reviews.filter(r => r.sentiment === 'positive').length
  const neg = reviews.filter(r => r.sentiment === 'negative').length
  const neu = reviews.filter(r => r.sentiment === 'neutral').length
  const dominant = pos >= neg && pos >= neu ? 'predominantly positive'
    : neg >= pos && neg >= neu ? 'predominantly negative'
    : 'mixed'

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const topThemes = themes.slice(0, 3).map(t => t.name)
  const themeStr = topThemes.length >= 3
    ? `${topThemes[0]}, ${topThemes[1]}, and ${topThemes[2]}`
    : topThemes.join(' and ') || 'general product experience'

  const criticalCount = painPoints.filter(p => p.severity === 'critical').length
  const highCount = painPoints.filter(p => p.severity === 'high').length
  const topPainPoint = painPoints[0]?.title ?? null

  const sentimentPct = `${Math.round((pos / total) * 100)}% positive, ${Math.round((neg / total) * 100)}% negative`

  let summary = `Analysis of ${total} review${total !== 1 ? 's' : ''} across ${sourceCount} source${sourceCount !== 1 ? 's' : ''} reveals ${dominant} sentiment (${sentimentPct}). `

  summary += `Customer satisfaction averages ${avgRating}/5 stars. `

  if (topThemes.length > 0) {
    summary += `The most frequently discussed themes are ${themeStr}. `
  }

  if (painPoints.length > 0) {
    summary += `${criticalCount + highCount} high-priority pain point${criticalCount + highCount !== 1 ? 's' : ''} were identified`
    if (topPainPoint) {
      summary += `, most notably "${topPainPoint}"`
    }
    summary += '. '
  }

  if (criticalCount > 0) {
    summary += `Immediate action is recommended on ${criticalCount} critical issue${criticalCount !== 1 ? 's' : ''} to prevent further churn. `
  } else if (dominant === 'predominantly positive') {
    summary += 'Overall user sentiment is strong — focus on scaling onboarding and addressing the identified pain points to sustain growth. '
  }

  const posThemes = themes.filter(t => t.sentiment === 'positive').slice(0, 2).map(t => t.name)
  if (posThemes.length > 0) {
    summary += `Key strengths to double down on: ${posThemes.join(' and ')}.`
  }

  return summary.trim()
}
