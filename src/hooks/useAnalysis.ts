import { useState, useCallback } from 'react'
import type { Review, Theme, PainPoint } from '@/types'
import { parseReviewsFromText, buildThemeSummary, detectPainPoints } from '@/lib/analysisEngine'
import { mockReviews, mockThemes, mockPainPoints } from '@/data/mockData'

export interface AnalysisState {
  reviews: Review[]
  themes: Theme[]
  painPoints: PainPoint[]
  isAnalyzed: boolean
}

// Module-level singleton so state survives navigation
let _state: AnalysisState = {
  reviews: mockReviews,
  themes: mockThemes,
  painPoints: mockPainPoints,
  isAnalyzed: true,
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(_state)

  const analyzeText = useCallback((rawText: string) => {
    const parsed = parseReviewsFromText(rawText)
    const allReviews = [...mockReviews, ...parsed]
    const themes = buildThemeSummary(allReviews)
    const painPoints = detectPainPoints(allReviews)
    _state = { reviews: allReviews, themes, painPoints, isAnalyzed: true }
    setState(_state)
    return parsed.length
  }, [])

  const reset = useCallback(() => {
    _state = { reviews: mockReviews, themes: mockThemes, painPoints: mockPainPoints, isAnalyzed: true }
    setState(_state)
  }, [])

  return { ...state, analyzeText, reset }
}
