import { Link, useMatches } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'

interface BreadcrumbHandle {
  breadcrumb?: string | ((data: unknown) => string)
}

export function Breadcrumbs({ className }: { className?: string }) {
  const matches = useMatches()

  const crumbs = matches
    .filter((match) => Boolean((match.handle as BreadcrumbHandle | undefined)?.breadcrumb))
    .map((match) => {
      const handle = match.handle as BreadcrumbHandle
      const label =
        typeof handle.breadcrumb === 'function'
          ? handle.breadcrumb(match.data)
          : handle.breadcrumb
      return {
        pathname: match.pathname,
        label: label ?? '',
      }
    })

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1
        return (
          <span key={crumb.pathname} className="flex items-center gap-1">
            {index > 0 ? <ChevronRightIcon className="size-3.5 text-ink-faint" /> : null}
            {isLast ? (
              <span className="font-medium text-ink">{crumb.label}</span>
            ) : (
              <Link to={crumb.pathname} className="text-ink-muted transition-colors hover:text-ink">
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
