import { cn } from '@/lib/cn'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-[3px]',
}

export function Loader({ size = 'md', className, label }: LoaderProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)} role="status">
      <span
        className={cn(
          'animate-spin rounded-full border-brand border-r-transparent',
          sizeClasses[size],
        )}
      />
      {label ? <span className="text-sm text-ink-muted">{label}</span> : null}
      <span className="sr-only">Cargando</span>
    </span>
  )
}
