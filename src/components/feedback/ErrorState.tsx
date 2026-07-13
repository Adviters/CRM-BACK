import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'No se pudo cargar la información',
  description = 'Revisá tu conexión o intentá de nuevo en unos segundos.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-danger/20 bg-danger-soft/40 px-6 py-12 text-center',
        className,
      )}
    >
      <ExclamationTriangleIcon className="mb-3 size-8 text-danger" />
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p>
      {onRetry ? (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
