import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquarePlus,
  Upload,
  List,
  BarChart3,
  BrainCircuit,
  AlertCircle,
  Sparkles,
  Map,
  Download,
  HelpCircle,
  Info,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAnalysis } from '@/hooks/useAnalysis'
import AppIcon from '@/components/ui/AppIcon'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
  { to: '/input', label: 'Review Input', icon: MessageSquarePlus, group: 'main' },
  { to: '/upload', label: 'Upload Reviews', icon: Upload, group: 'main' },
  { to: '/reviews', label: 'All Reviews', icon: List, group: 'main' },
  { to: '/sentiment', label: 'Sentiment', icon: BarChart3, group: 'analyze' },
  { to: '/themes', label: 'Themes', icon: BrainCircuit, group: 'analyze' },
  { to: '/pain-points', label: 'Pain Points', icon: AlertCircle, group: 'analyze' },
  { to: '/recommendations', label: 'Recommendations', icon: Sparkles, group: 'analyze' },
  { to: '/roadmap', label: 'Roadmap', icon: Map, group: 'plan' },
  { to: '/export', label: 'Export', icon: Download, group: 'plan' },
]

const secondaryItems = [
  { to: '/help', label: 'Help', icon: HelpCircle },
  { to: '/about', label: 'About', icon: Info },
]

const groups = [
  { key: 'main', label: 'Workspace' },
  { key: 'analyze', label: 'Analysis' },
  { key: 'plan', label: 'Planning' },
]

interface SidebarProps {
  isOpen: boolean
}

const sidebarVariants = {
  open: { width: 240 },
  closed: { width: 60 },
}

const labelVariants = {
  open: { opacity: 1, x: 0, display: 'block' },
  closed: { opacity: 0, x: -8, transitionEnd: { display: 'none' } },
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { reviews } = useAnalysis()

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      aria-label="Main navigation"
      className="fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D0D10 0%, #0A0A0E 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className="flex h-14 shrink-0 items-center px-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Brand mark */}
          <AppIcon size={32} animate={true} />

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <p className="text-[13px] font-semibold text-white leading-none truncate">
                  AI Feedback
                </p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: '#6D5DF6' }}>
                  Analyzer
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-hide"
        aria-label="App sections"
      >
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group.key)
          return (
            <div key={group.key} className="mb-4 px-2">
              {/* Group label */}
              <AnimatePresence>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-0.5">
                {items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    aria-label={!isOpen ? label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-2.5 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DF6]',
                        isOpen ? 'px-2.5 py-2' : 'justify-center px-0 py-2',
                        isActive
                          ? 'text-white'
                          : 'text-[#71717A] hover:text-white'
                      )
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? 'rgba(109,93,246,0.15)'
                        : 'transparent',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator bar */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-indicator"
                            className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                            style={{ backgroundColor: '#6D5DF6' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}

                        <Icon
                          className="h-4 w-4 shrink-0 transition-colors"
                          aria-hidden="true"
                          style={{ color: isActive ? '#A78BFA' : 'currentColor' }}
                        />

                        <motion.span
                          variants={labelVariants}
                          animate={isOpen ? 'open' : 'closed'}
                          transition={{ duration: 0.15 }}
                          className="text-[13px] font-medium truncate flex-1"
                        >
                          {label}
                        </motion.span>

                        {isOpen && isActive && (
                          <ChevronRight
                            className="h-3 w-3 shrink-0"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                            aria-hidden="true"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}

        {/* Secondary nav */}
        <div className="px-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          {secondaryItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={!isOpen ? label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DF6]',
                  isOpen ? 'px-2.5 py-1.5' : 'justify-center px-0 py-1.5',
                  isActive
                    ? 'text-white'
                    : 'text-[#52525B] hover:text-[#A1A1AA]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                    style={{ color: isActive ? '#A78BFA' : 'currentColor' }}
                  />
                  <motion.span
                    variants={labelVariants}
                    animate={isOpen ? 'open' : 'closed'}
                    transition={{ duration: 0.15 }}
                    className="text-[13px] truncate"
                  >
                    {label}
                  </motion.span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer — review count */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 px-3 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(109,93,246,0.08)', border: '1px solid rgba(109,93,246,0.15)' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium" style={{ color: '#6D5DF6' }}>
                  Reviews Analyzed
                </span>
                <AppIcon size={12} animate={false} />
              </div>
              <p className="text-xl font-bold text-white tabular-nums">
                {reviews.length.toLocaleString()}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#52525B' }}>
                this session
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
