import type { Role } from '@/types/enums'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { tokenStorage } from '@/services/api/token-storage'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  rememberMe: boolean
  setSession: (payload: {
    accessToken: string
    refreshToken: string
    user: AuthUser
    rememberMe?: boolean
  }) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearSession: () => void
}

const authStorage = createJSONStorage(() => ({
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const parsed = JSON.parse(value) as { state?: { rememberMe?: boolean } }
    const remember = parsed.state?.rememberMe ?? true
    const target = remember ? localStorage : sessionStorage
    const other = remember ? sessionStorage : localStorage
    target.setItem(name, value)
    other.removeItem(name)
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}))

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      rememberMe: true,
      setSession: ({ accessToken, refreshToken, user, rememberMe }) => {
        const nextRemember = rememberMe ?? get().rememberMe
        tokenStorage.setTokens(accessToken, refreshToken, nextRemember)
        set({
          accessToken,
          refreshToken,
          user,
          rememberMe: nextRemember,
        })
      },
      setTokens: (accessToken, refreshToken) => {
        tokenStorage.setTokens(accessToken, refreshToken, get().rememberMe)
        set({ accessToken, refreshToken })
      },
      clearSession: () => {
        tokenStorage.clear()
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        })
      },
    }),
    {
      name: 'petshop-auth',
      storage: authStorage,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    },
  ),
)
