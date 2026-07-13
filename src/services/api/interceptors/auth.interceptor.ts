import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { queryClient } from '@/services/query-client'
import { tokenStorage } from '../token-storage'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshResponse {
  accessToken: string
  refreshToken: string
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'VETERINARIAN' | 'RECEPTIONIST'
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null): void {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error)
      return
    }
    resolve(token)
  })
  pendingQueue = []
}

function forceLogout(): void {
  tokenStorage.clear()
  useAuthStore.getState().clearSession()
  queryClient.clear()
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

export function setupAuthInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken ?? tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig | undefined
      const status = error.response?.status
      const url = originalRequest?.url ?? ''

      const isAuthEndpoint =
        url.includes('/auth/login') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/logout')

      if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
        return Promise.reject(error)
      }

      const refreshToken =
        useAuthStore.getState().refreshToken ?? tokenStorage.getRefreshToken()

      if (!refreshToken) {
        forceLogout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<RefreshResponse>(
          `${instance.defaults.baseURL}/auth/refresh`,
          { refreshToken },
        )

        const authState = useAuthStore.getState()
        const rememberMe = authState.rememberMe
        tokenStorage.setTokens(data.accessToken, data.refreshToken, rememberMe)

        if (data.user) {
          authState.setSession({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
            rememberMe,
          })
        } else {
          authState.setTokens(data.accessToken, data.refreshToken)
        }

        processQueue(null, data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        forceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )
}
