import { beforeEach, describe, expect, it } from 'vitest'
import { tokenStorage } from '@/services/api/token-storage'

describe('tokenStorage', () => {
  beforeEach(() => {
    tokenStorage.clear()
  })

  it('persiste tokens según rememberMe', () => {
    tokenStorage.setTokens('access', 'refresh', true)
    expect(localStorage.getItem('petshop.accessToken')).toBe('access')
    expect(tokenStorage.getAccessToken()).toBe('access')
    expect(tokenStorage.getRefreshToken()).toBe('refresh')

    tokenStorage.setTokens('a2', 'r2', false)
    expect(sessionStorage.getItem('petshop.accessToken')).toBe('a2')
    expect(localStorage.getItem('petshop.accessToken')).toBeNull()

    tokenStorage.clear()
    expect(tokenStorage.getAccessToken()).toBeNull()
  })
})
