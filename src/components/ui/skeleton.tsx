import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer rounded-lg', className)}
    />
  )
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl border p-5 space-y-3"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div
      className="rounded-xl border p-5 space-y-4"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
    >
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-[220px] w-full rounded-lg" />
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonChart />
    </div>
  )
}

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

export function EmptyState({ icon, title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
        style={{
          background: 'var(--color-muted)',
          border: '1px solid var(--color-border)',
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
        {title}
      </h3>
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
        {description}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
