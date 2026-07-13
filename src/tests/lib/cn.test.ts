import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('combina clases y resuelve conflictos de Tailwind', () => {
    expect(cn('px-2', 'px-4', undefined, 'text-sm')).toBe('px-4 text-sm')
  })
})
