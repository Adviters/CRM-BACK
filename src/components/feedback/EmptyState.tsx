import type { ReactNode } from 'react'
import { InboxIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-surface-muted p-3 text-ink-muted">
        {icon ?? <InboxIcon className="size-6" />}
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
