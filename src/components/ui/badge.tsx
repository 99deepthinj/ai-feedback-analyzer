import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'positive' | 'negative' | 'neutral' | 'warning'
}

const variants = {
  default: 'bg-[var(--color-primary)] text-white',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-foreground-secondary)]',
  destructive: 'bg-[var(--color-destructive)] text-white',
  outline: 'border border-[var(--color-border)] text-[var(--color-foreground)] bg-transparent',
  positive: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-700/30',
  negative: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200/50 dark:border-red-700/30',
  neutral: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/30',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/30',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
