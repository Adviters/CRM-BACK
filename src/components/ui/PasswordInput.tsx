import { forwardRef, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Input, type InputProps } from './Input'
import { cn } from '@/lib/cn'

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-ink-faint transition-colors hover:text-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring/30"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
        >
          {visible ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
