import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { SkeletonPage } from '@/components/ui/skeleton'

// Eager-load Landing and Dashboard (above-the-fold critical paths)
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'

// Lazy-load all secondary pages — keeps initial bundle small
const ReviewInput    = lazy(() => import('@/pages/ReviewInput'))
const ReviewUpload   = lazy(() => import('@/pages/ReviewUpload'))
const SentimentAnalysis = lazy(() => import('@/pages/SentimentAnalysis'))
const ThemeDetection = lazy(() => import('@/pages/ThemeDetection'))
const PainPoints     = lazy(() => import('@/pages/PainPoints'))
const Recommendations= lazy(() => import('@/pages/Recommendations'))
const Roadmap        = lazy(() => import('@/pages/Roadmap'))
const Export         = lazy(() => import('@/pages/Export'))
const Reviews        = lazy(() => import('@/pages/Reviews'))
const About          = lazy(() => import('@/pages/About'))
const Help           = lazy(() => import('@/pages/Help'))
const NotFound       = lazy(() => import('@/pages/NotFound'))

function PageFallback() {
  return (
    <div className="p-6">
      <SkeletonPage />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — full-page, no sidebar layout */}
        <Route path="/" element={<Landing />} />

        {/* App layout with sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/input" element={<Suspense fallback={<PageFallback />}><ReviewInput /></Suspense>} />
          <Route path="/upload" element={<Suspense fallback={<PageFallback />}><ReviewUpload /></Suspense>} />
          <Route path="/sentiment" element={<Suspense fallback={<PageFallback />}><SentimentAnalysis /></Suspense>} />
          <Route path="/themes" element={<Suspense fallback={<PageFallback />}><ThemeDetection /></Suspense>} />
          <Route path="/pain-points" element={<Suspense fallback={<PageFallback />}><PainPoints /></Suspense>} />
          <Route path="/recommendations" element={<Suspense fallback={<PageFallback />}><Recommendations /></Suspense>} />
          <Route path="/roadmap" element={<Suspense fallback={<PageFallback />}><Roadmap /></Suspense>} />
          <Route path="/export" element={<Suspense fallback={<PageFallback />}><Export /></Suspense>} />
          <Route path="/reviews" element={<Suspense fallback={<PageFallback />}><Reviews /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<PageFallback />}><About /></Suspense>} />
          <Route path="/help" element={<Suspense fallback={<PageFallback />}><Help /></Suspense>} />
          {/* Legacy alias */}
          <Route path="/feedback" element={<Suspense fallback={<PageFallback />}><ReviewInput /></Suspense>} />
        </Route>

        {/* 404 — full page, no sidebar */}
        <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
      </Routes>
    </BrowserRouter>
  )
}
