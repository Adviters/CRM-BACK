import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? `${props.name}-${props.value}`

    return (
      <label
        htmlFor={inputId}
        className={cn('inline-flex cursor-pointer items-center gap-2 text-sm text-ink-secondary', className)}
      >
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className="size-4 border-border text-brand focus:ring-brand-ring/40"
          {...props}
        />
        {label ? <span>{label}</span> : null}
      </label>
    )
  },
)

Radio.displayName = 'Radio'
