import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <label
        htmlFor={inputId}
        className={cn('inline-flex cursor-pointer items-center gap-2 text-sm text-ink-secondary', className)}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="size-4 rounded border-border text-brand focus:ring-brand-ring/40"
          {...props}
        />
        {label ? <span>{label}</span> : null}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
