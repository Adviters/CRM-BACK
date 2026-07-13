import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
} from 'react'
import { cn } from '@/lib/cn'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <div onClick={() => setOpen((value) => !value)}>{trigger}</div>
      {open ? (
        <div
          className={cn(
            'absolute top-full z-40 mt-2 min-w-48 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-panel',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean
}

export function DropdownItem({ className, danger, children, ...props }: DropdownItemProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
        danger
          ? 'text-danger hover:bg-danger-soft'
          : 'text-ink-secondary hover:bg-surface-muted hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
