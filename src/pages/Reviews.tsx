import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { Search, Download, Filter, ChevronLeft, ChevronRight, Star, SearchX, AlignJustify, List } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useToast } from '@/hooks/useToast'

const PAGE_SIZE = 25

const SENTIMENTS = ['all', 'positive', 'negative', 'neutral'] as const
type SentimentFilter = typeof SENTIMENTS[number]

const SORTS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'rating-desc', label: 'Rating ↓' },
  { value: 'rating-asc', label: 'Rating ↑' },
] as const
type SortValue = typeof SORTS[number]['value']

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          aria-hidden="true"
          style={{ color: i < rating ? '#f59e0b' : '#d1d5db', fill: i < rating ? '#f59e0b' : 'none' }}
        />
      ))}
    </span>
  )
}

function ReviewTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3 rounded-lg border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function Reviews() {
  const { reviews } = useAnalysis()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sentiment, setSentiment] = useState<SentimentFilter>('all')
  const [source, setSource] = useState('all')
  const [rating, setRating] = useState(0)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState<SortValue>('date-desc')
  const [page, setPage] = useState(1)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const sources = useMemo(() => ['all', ...new Set(reviews.map(r => r.source))], [reviews])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return reviews
      .filter(r => !q || r.text.toLowerCase().includes(q) || r.source.toLowerCase().includes(q))
      .filter(r => sentiment === 'all' || r.sentiment === sentiment)
      .filter(r => source === 'all' || r.source === source)
      .filter(r => !rating || r.rating === rating)
      .filter(r => !dateFrom || r.date >= dateFrom)
      .filter(r => !dateTo || r.date <= dateTo)
      .sort((a, b) => {
        if (sort === 'date-desc') return b.date.localeCompare(a.date)
        if (sort === 'date-asc') return a.date.localeCompare(b.date)
        if (sort === 'rating-desc') return b.rating - a.rating
        return a.rating - b.rating
      })
  }, [reviews, search, sentiment, source, rating, dateFrom, dateTo, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handleFilter = () => setPage(1)

  const exportCSV = () => {
    const header = ['ID', 'Text', 'Source', 'Date', 'Rating', 'Sentiment', 'Themes']
    const rows = filtered.map(r => [
      r.id,
      `"${r.text.replace(/"/g, '""')}"`,
      r.source,
      r.date,
      r.rating,
      r.sentiment,
      `"${r.themes.join('|')}"`,
    ])
    const csv = [header, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reviews-filtered-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 100)
    addToast({
      title: 'CSV exported',
      description: `${filtered.length} review${filtered.length !== 1 ? 's' : ''} downloaded`,
      variant: 'success',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <ReviewTableSkeleton />
      </div>
    )
  }

  return (
    <motion.div className="space-y-5 max-w-7xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
      {/* Filter bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--color-muted-foreground)' }} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search reviews…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                aria-label="Search reviews"
                className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
              />
            </div>

            {/* Sentiment */}
            <select
              value={sentiment}
              onChange={e => { setSentiment(e.target.value as SentimentFilter); handleFilter() }}
              aria-label="Filter by sentiment"
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
            >
              <option value="all">All sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>

            {/* Source */}
            <select
              value={source}
              onChange={e => { setSource(e.target.value); handleFilter() }}
              aria-label="Filter by source"
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
            >
              {sources.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All sources' : s}</option>
              ))}
            </select>

            {/* Star rating */}
            <select
              value={rating}
              onChange={e => { setRating(Number(e.target.value)); handleFilter() }}
              aria-label="Filter by star rating"
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
            >
              <option value={0}>Any rating</option>
              {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} stars</option>)}
            </select>

            {/* Date range */}
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              <Filter className="h-4 w-4" aria-hidden="true" />
              <input
                type="date"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); handleFilter() }}
                aria-label="From date"
                className="rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
              />
              <span>–</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); handleFilter() }}
                aria-label="To date"
                className="rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => { setSort(e.target.value as SortValue); handleFilter() }}
              aria-label="Sort order"
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            {/* Export */}
            <Button size="sm" variant="outline" onClick={exportCSV} className="gap-1.5 shrink-0 no-print">
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>
                {filtered.length === reviews.length
                  ? `${reviews.length} total reviews`
                  : `${filtered.length} of ${reviews.length} reviews match filters`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {(search || sentiment !== 'all' || source !== 'all' || rating || dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch(''); setSentiment('all'); setSource('all')
                    setRating(0); setDateFrom(''); setDateTo(''); setPage(1)
                  }}
                >
                  Clear filters
                </Button>
              )}
              <button
                onClick={() => setCompact(c => !c)}
                aria-label={compact ? 'Switch to comfortable density' : 'Switch to compact density'}
                title={compact ? 'Comfortable view' : 'Compact view'}
                className="rounded-lg border p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-muted-foreground)' }}
              >
                {compact ? <AlignJustify className="h-4 w-4" aria-hidden="true" /> : <List className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {pageItems.length === 0 ? (
            <div className="py-16 text-center">
              <SearchX className="h-10 w-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="font-semibold" style={{ color: 'var(--color-foreground)' }}>No reviews found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className={compact ? 'space-y-1' : 'space-y-2'}>
              {pageItems.map(review => (
                <div
                  key={review.id}
                  className={`rounded-lg border transition-colors hover:bg-[var(--color-muted)] ${compact ? 'p-2.5' : 'p-4'}`}
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className={`flex flex-wrap items-center gap-2 ${compact ? 'mb-1' : 'mb-2'}`}>
                    <Badge variant={review.sentiment === 'positive' ? 'positive' : review.sentiment === 'negative' ? 'negative' : 'neutral'}>
                      {review.sentiment}
                    </Badge>
                    <Badge variant="secondary">{review.source}</Badge>
                    {!compact && <StarDisplay rating={review.rating} />}
                    <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{review.date}</span>
                    {!compact && (
                      <div className="flex flex-wrap gap-1 ml-auto">
                        {review.themes.slice(0, 3).map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className={`text-sm ${compact ? 'leading-snug truncate' : 'leading-relaxed'}`}>
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                Page {currentPage} of {totalPages} · {filtered.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="text-sm font-medium px-2">{currentPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
