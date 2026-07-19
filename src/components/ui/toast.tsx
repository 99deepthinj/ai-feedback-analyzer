import { useCallback, useReducer, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { ToastContext } from './toast-context'
import type { Toast } from './toast-context'

export { ToastContext } from './toast-context'
export type { Toast } from './toast-context'

type Action =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: string }

function reducer(state: Toast[], action: Action): Toast[] {
  if (action.type === 'ADD') return [...state, action.toast]
  if (action.type === 'REMOVE') return state.filter((t) => t.id !== action.id)
  return state
}

let _counter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = String(++_counter)
    dispatch({ type: 'ADD', toast: { ...toast, id } })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, toasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: '#6B7280',
    accent: '#6B7280',
    border: 'var(--color-border)',
  },
  success: {
    icon: CheckCircle2,
    iconColor: '#10B981',
    accent: '#10B981',
    border: 'rgba(16,185,129,0.3)',
  },
  error: {
    icon: AlertCircle,
    iconColor: '#EF4444',
    accent: '#EF4444',
    border: 'rgba(239,68,68,0.3)',
  },
}

export function ToastContainer() {
  const { toasts, dismiss } = useContext(ToastContext)

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 w-[340px] max-w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const cfg = variantConfig[toast.variant]
          const Icon = cfg.icon
          return (
            <motion.div
              key={toast.id}
              role="alert"
              initial={{ opacity: 0, x: 32, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="relative flex items-start gap-3 rounded-xl border p-4 overflow-hidden pointer-events-auto"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: cfg.border,
                boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
                style={{ backgroundColor: cfg.accent }}
                aria-hidden="true"
              />

              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0 mt-0.5"
                style={{ backgroundColor: `${cfg.accent}18` }}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" style={{ color: cfg.iconColor }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-foreground)' }}>
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-md p-1 transition-colors hover:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                style={{ color: 'var(--color-muted-foreground)' }}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
