import { cn } from '@/lib/cn'
import { initials } from '@/utils/format'

interface AvatarProps {
  firstName: string
  lastName?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
}

export function Avatar({ firstName, lastName, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-soft font-semibold text-brand',
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      {initials(firstName, lastName)}
    </div>
  )
}
