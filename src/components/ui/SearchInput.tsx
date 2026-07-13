import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input, type InputProps } from './Input'
import { cn } from '@/lib/cn'

interface SearchInputProps extends Omit<InputProps, 'type'> {
  containerClassName?: string
}

export function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
      <Input className={cn('pl-9', className)} type="search" {...props} />
    </div>
  )
}
