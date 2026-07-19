import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center max-w-md"
      >
        {/* Glowing number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <span
            className="text-[120px] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #6D5DF6 0%, #8B5CF6 50%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(109,93,246,0.3))',
            }}
            aria-hidden="true"
          >
            404
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-foreground)' }}
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-sm mb-8 leading-relaxed"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          The page you're looking for doesn't exist or has been moved. Head back to the dashboard to continue analyzing feedback.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 h-9 px-4 py-2 text-sm bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 h-9 px-4 py-2 text-sm border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)] text-[var(--color-foreground)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go back
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
