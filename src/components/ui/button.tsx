import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const variants = {
  default:
    'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90 active:scale-[0.98]',
  secondary:
    'bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:bg-[var(--color-accent)] active:scale-[0.98]',
  destructive:
    'bg-[var(--color-destructive)] text-white shadow-sm hover:opacity-90 active:scale-[0.98]',
  outline:
    'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)] text-[var(--color-foreground)] active:scale-[0.98]',
  ghost:
    'hover:bg-[var(--color-accent)] text-[var(--color-foreground)] active:scale-[0.98]',
  link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
}

const sizes = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-7 px-3 text-xs rounded-lg',
  lg: 'h-11 px-6 text-base',
  icon: 'h-9 w-9',
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
