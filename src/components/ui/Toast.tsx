import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from './utils'

type ToastTone = 'info' | 'success' | 'warning' | 'danger'

interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
  duration?: number
}

interface ToastItem extends ToastInput {
  id: number
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => number
  dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const symbols: Record<ToastTone, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  danger: '×',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((input: ToastInput) => {
    const id = nextId.current++
    const toast: ToastItem = { tone: 'info', duration: 4200, ...input, id }
    setToasts(current => [...current.slice(-2), toast])
    const timer = setTimeout(() => dismissToast(id), toast.duration)
    timers.current.set(id, timer)
    return id
  }, [dismissToast])

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="hp-toast-region" aria-live="polite" aria-relevant="additions removals">
        {toasts.map(toast => (
          <div key={toast.id} className={cn('hp-toast', `hp-toast--${toast.tone}`)} role={toast.tone === 'danger' ? 'alert' : 'status'}>
            <span className="hp-toast__icon" aria-hidden="true">{symbols[toast.tone ?? 'info']}</span>
            <div className="hp-toast__content">
              <strong>{toast.title}</strong>
              {toast.description && <span>{toast.description}</span>}
            </div>
            <button type="button" className="hp-toast__close" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
