import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-ink-faint',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-ring/30',
          hasError
            ? 'border-danger focus:border-danger'
            : 'border-border focus:border-brand-ring',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70',
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
