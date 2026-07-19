import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ToastContainer } from '@/components/ui/toast'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/input': 'Review Input',
  '/upload': 'Upload Reviews',
  '/feedback': 'Review Input',
  '/sentiment': 'Sentiment Analysis',
  '/themes': 'Theme Detection',
  '/pain-points': 'Pain Point Analysis',
  '/recommendations': 'Feature Recommendations',
  '/roadmap': 'Product Roadmap',
  '/export': 'Export Report',
  '/reviews': 'All Reviews',
  '/about': 'About',
  '/help': 'Help & User Guide',
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: 'easeInOut' as const },
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    setIsMobile(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function AppLayout() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'AI Feedback Analyzer'

  // Auto-close on route change when mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  // Desktop sidebar width animates; mobile sidebar overlays (always marginLeft: 0)
  const contentMargin = isMobile ? 0 : sidebarOpen ? 240 : 60

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <Sidebar isOpen={sidebarOpen} />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ marginLeft: contentMargin }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex flex-1 flex-col min-w-0"
      >
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          title={title}
        />

        <main id="main-content" className="flex-1 overflow-auto" role="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              {...pageTransition}
              className="p-4 sm:p-6 h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      <ToastContainer />
    </div>
  )
}
