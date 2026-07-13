import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDebounce } from '@/hooks/use-debounce'
import { useDisclosure } from '@/hooks/use-disclosure'
import { usePermissions } from '@/hooks/use-permissions'
import { useAuthStore } from '@/store/auth.store'
import { Permission } from '@/constants/permissions'
import { Role } from '@/types/enums'

describe('hooks', () => {
  it('useDisclosure', () => {
    const { result } = renderHook(() => useDisclosure())
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('useDebounce', async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })
    expect(result.current).toBe('a')
    rerender({ value: 'ab' })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('ab')
    vi.useRealTimers()
  })

  it('usePermissions', () => {
    useAuthStore.setState({
      accessToken: 't',
      refreshToken: 'r',
      rememberMe: true,
      user: {
        id: '1',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    })
    const { result } = renderHook(() => usePermissions())
    expect(result.current.can(Permission.USERS_MANAGE)).toBe(true)
    expect(result.current.canAny([Permission.CUSTOMERS_READ])).toBe(true)
  })
})
