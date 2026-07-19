export type Sentiment = 'positive' | 'negative' | 'neutral'

export interface Review {
  id: string
  text: string
  source: string
  date: string
  rating: number
  sentiment: Sentiment
  themes: string[]
}

export interface Theme {
  id: string
  name: string
  count: number
  sentiment: Sentiment
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export interface PainPoint {
  id: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  frequency: number
  affectedUsers: number
  themes: string[]
}

export interface Feature {
  id: string
  title: string
  description: string
  reach: number
  impact: number
  confidence: number
  effort: number
  riceScore: number
  status: 'planned' | 'in-progress' | 'completed' | 'backlog'
  quarter: string
  category: string
}

export interface SentimentBreakdown {
  positive: number
  negative: number
  neutral: number
}

export interface DashboardStats {
  totalReviews: number
  avgRating: number
  sentiment: SentimentBreakdown
  topThemes: Theme[]
  criticalPainPoints: number
  npsScore: number
}
