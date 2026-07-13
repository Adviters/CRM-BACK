import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { tokenStorage } from '@/services/api/token-storage'
import { queryClient } from '@/services/query-client'
import { ROUTES } from '@/constants/routes'

export function useLogout() {
  const navigate = useNavigate()
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout(refreshToken ? { refreshToken } : undefined)
      } catch {
        // Logout local even if API fails
      }
    },
    onSettled: () => {
      tokenStorage.clear()
      clearSession()
      queryClient.clear()
      toast.success('Sesión cerrada')
      void navigate(ROUTES.login, { replace: true })
    },
  })
}
