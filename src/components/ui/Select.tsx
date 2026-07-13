import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  hasError?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, hasError, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-ring/30',
          hasError
            ? 'border-danger focus:border-danger'
            : 'border-border focus:border-brand-ring',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70',
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled={props.required}>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    )
  },
)

Select.displayName = 'Select'
