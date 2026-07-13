import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint',
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

Textarea.displayName = 'Textarea'
