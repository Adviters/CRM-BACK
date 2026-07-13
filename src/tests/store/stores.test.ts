import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store/ui.store'
import { Role } from '@/types/enums'

describe('auth.store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      rememberMe: true,
    })
  })

  it('guarda y limpia sesión', () => {
    useAuthStore.getState().setSession({
      accessToken: 'a',
      refreshToken: 'r',
      rememberMe: false,
      user: {
        id: '1',
        email: 'a@b.com',
        firstName: 'Ana',
        lastName: 'Perez',
        role: Role.ADMIN,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    })

    expect(useAuthStore.getState().accessToken).toBe('a')
    expect(useAuthStore.getState().rememberMe).toBe(false)

    useAuthStore.getState().setTokens('a2', 'r2')
    expect(useAuthStore.getState().refreshToken).toBe('r2')

    useAuthStore.getState().clearSession()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})

describe('ui.store', () => {
  beforeEach(() => {
    useUiStore.setState({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'light',
    })
    document.documentElement.classList.remove('dark')
  })

  it('togglea sidebar y tema', () => {
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarCollapsed).toBe(true)

    useUiStore.getState().setSidebarMobileOpen(true)
    expect(useUiStore.getState().sidebarMobileOpen).toBe(true)

    useUiStore.getState().toggleTheme()
    expect(useUiStore.getState().theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    useUiStore.getState().setTheme('light')
    expect(useUiStore.getState().theme).toBe('light')
  })
})
