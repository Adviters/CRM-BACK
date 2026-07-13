import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Skeleton } from '@/components/feedback/Skeleton'

interface StatCardProps {
  title: string
  value: number | string
  description: string
  icon: ReactNode
  accent?: string
  isLoading?: boolean
}

export function StatCard({
  title,
  value,
  description,
  icon,
  accent = 'bg-brand-soft text-brand',
  isLoading,
}: StatCardProps) {
  return (
    <div className="panel p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-muted">{title}</p>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-20" />
          ) : (
            <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
          )}
          <p className="mt-2 text-xs text-ink-faint">{description}</p>
        </div>
        <div className={cn('rounded-xl p-2.5', accent)}>{icon}</div>
      </div>
    </div>
  )
}
