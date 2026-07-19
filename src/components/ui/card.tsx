import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]',
        'text-[var(--color-card-foreground)] transition-all duration-200',
        className
      )}
      style={{
        boxShadow: 'var(--shadow-sm)',
        ...((props as React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }).style),
      }}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={cn('flex flex-col space-y-1 p-5 pb-3', className)} {...props} />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-sm font-semibold leading-none tracking-tight text-[var(--color-foreground)]',
        className
      )}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-[var(--color-muted-foreground)] leading-relaxed mt-0.5', className)} {...props} />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('flex items-center p-5 pt-0 gap-3', className)}
      {...props}
    />
  )
}
