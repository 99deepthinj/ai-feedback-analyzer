import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, Moon, Sun, Search, Command, Keyboard,
  LayoutDashboard, MessageSquarePlus, Upload, List,
  BarChart3, BrainCircuit, AlertCircle, Sparkles,
  Map, Download, HelpCircle, Info, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDarkMode } from '@/hooks/useDarkMode'

interface HeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  title: string
}

const commandItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', group: 'Navigation' },
  { label: 'Review Input', icon: MessageSquarePlus, path: '/input', group: 'Navigation' },
  { label: 'Upload Reviews', icon: Upload, path: '/upload', group: 'Navigation' },
  { label: 'All Reviews', icon: List, path: '/reviews', group: 'Navigation' },
  { label: 'Sentiment Analysis', icon: BarChart3, path: '/sentiment', group: 'Analysis' },
  { label: 'Theme Detection', icon: BrainCircuit, path: '/themes', group: 'Analysis' },
  { label: 'Pain Points', icon: AlertCircle, path: '/pain-points', group: 'Analysis' },
  { label: 'Recommendations', icon: Sparkles, path: '/recommendations', group: 'Analysis' },
  { label: 'Product Roadmap', icon: Map, path: '/roadmap', group: 'Planning' },
  { label: 'Export Report', icon: Download, path: '/export', group: 'Planning' },
  { label: 'Help & Guide', icon: HelpCircle, path: '/help', group: 'Support' },
  { label: 'About', icon: Info, path: '/about', group: 'Support' },
]

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const navigate = useNavigate()

  const filtered = query
    ? commandItems.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.group.toLowerCase().includes(query.toLowerCase())
      )
    : commandItems

  const groups = Array.from(new Set(filtered.map((i) => i.group)))

  const go = useCallback(
    (path: string) => {
      navigate(path)
      onClose()
    },
    [navigate, onClose]
  )

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        if (filtered[activeIdx]) go(filtered[activeIdx].path)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIdx, filtered, go, onClose])

  let flatIdx = 0

  return (
    <motion.div
      className="cmd-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <motion.div
        className="cmd-box mx-4"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--color-muted-foreground)' }} aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted-foreground)]"
            style={{ color: 'var(--color-foreground)' }}
          />
          <kbd
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded"
            style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)', border: '1px solid var(--color-border)' }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto scrollbar-hide py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No results for "{query}"</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group} className="mb-1">
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-muted-foreground)' }}>
                  {group}
                </p>
                {filtered
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const idx = flatIdx++
                    const Icon = item.icon
                    const isActive = idx === activeIdx
                    return (
                      <button
                        key={item.path}
                        onClick={() => go(item.path)}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        style={{
                          backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                          color: isActive ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                        }}
                      >
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                          style={{
                            backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                          }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: isActive ? '#fff' : 'var(--color-muted-foreground)' }} aria-hidden="true" />
                        </div>
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                        {isActive && <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                      </button>
                    )
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div
          className="flex items-center gap-4 px-4 py-2.5 text-[11px]"
          style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-muted-foreground)' }}
        >
          <span className="flex items-center gap-1.5"><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="font-mono">↵</kbd> open</span>
          <span className="flex items-center gap-1.5"><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

const SHORTCUTS = [
  { keys: ['⌘', 'K'], label: 'Open command palette', group: 'Navigation' },
  { keys: ['?'], label: 'Show keyboard shortcuts', group: 'Navigation' },
  { keys: ['↑', '↓'], label: 'Navigate results', group: 'Command Palette' },
  { keys: ['↵'], label: 'Select item', group: 'Command Palette' },
  { keys: ['Esc'], label: 'Close dialog', group: 'Command Palette' },
  { keys: ['⌘', 'D'], label: 'Go to Dashboard', group: 'Quick Nav' },
  { keys: ['⌘', 'I'], label: 'Go to Review Input', group: 'Quick Nav' },
  { keys: ['⌘', 'E'], label: 'Go to Export', group: 'Quick Nav' },
]

function ShortcutsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const groups = Array.from(new Set(SHORTCUTS.map(s => s.group)))

  return (
    <motion.div
      className="cmd-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Keyboard shortcuts"
    >
      <motion.div
        className="cmd-box mx-4 max-w-sm"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeInOut' as const }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Keyboard className="h-4 w-4 shrink-0" style={{ color: 'var(--color-muted-foreground)' }} aria-hidden="true" />
          <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Keyboard Shortcuts</span>
        </div>
        <div className="py-2 px-2">
          {groups.map(group => (
            <div key={group} className="mb-3">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-muted-foreground)' }}>{group}</p>
              {SHORTCUTS.filter(s => s.group === group).map(({ keys, label }) => (
                <div key={label} className="flex items-center justify-between px-2 py-1.5 rounded-lg">
                  <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>{label}</span>
                  <div className="flex items-center gap-1">
                    {keys.map(k => (
                      <kbd
                        key={k}
                        className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-medium rounded min-w-[22px] font-mono"
                        style={{ background: 'var(--color-muted)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Header({ onToggleSidebar, title }: HeaderProps) {
  const { isDark, toggle } = useDarkMode()
  const [cmdOpen, setCmdOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
      if (e.key === '?' && !isInput) {
        setShortcutsOpen((o) => !o)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && !isInput) {
        e.preventDefault(); navigate('/dashboard')
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i' && !isInput) {
        e.preventDefault(); navigate('/input')
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e' && !isInput) {
        e.preventDefault(); navigate('/export')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  return (
    <>
      <header
        className="sticky top-0 z-30 flex h-14 items-center gap-3 px-4"
        style={{
          background: isDark
            ? 'rgba(9,9,11,0.8)'
            : 'rgba(250,250,252,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="shrink-0 h-8 w-8"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--color-foreground)' }}
          >
            {title}
          </motion.h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search / Command */}
          <button
            onClick={() => setCmdOpen(true)}
            aria-label="Open command palette (⌘K)"
            className="hidden sm:flex items-center gap-2 rounded-lg px-3 h-8 text-[13px] transition-all hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            style={{
              background: 'var(--color-muted)',
              color: 'var(--color-muted-foreground)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Search</span>
            <kbd
              className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-medium"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              <Command className="h-2.5 w-2.5" aria-hidden="true" />K
            </kbd>
          </button>

          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCmdOpen(true)}
            aria-label="Search"
            className="sm:hidden h-8 w-8"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Keyboard shortcuts */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShortcutsOpen(true)}
            aria-label="Keyboard shortcuts (?)"
            className="hidden sm:flex h-8 w-8"
          >
            <Keyboard className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-8 w-8"
          >
            <motion.div
              key={isDark ? 'dark' : 'light'}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isDark
                ? <Sun className="h-4 w-4" aria-hidden="true" />
                : <Moon className="h-4 w-4" aria-hidden="true" />}
            </motion.div>
          </Button>

          {/* Avatar */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 ml-1"
            style={{ background: 'linear-gradient(135deg, #6D5DF6, #8B5CF6)' }}
            role="img"
            aria-label="Product Manager avatar"
          >
            PM
          </div>
        </div>
      </header>

      {/* Command palette */}
      <AnimatePresence>
        {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      </AnimatePresence>

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
