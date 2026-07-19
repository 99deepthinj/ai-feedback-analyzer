import { createContext } from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  variant: 'default' | 'success' | 'error'
}

export interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void
  toasts: Toast[]
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue>({
  addToast: () => {},
  toasts: [],
  dismiss: () => {},
})
