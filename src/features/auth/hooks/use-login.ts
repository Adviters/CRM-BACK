import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth.api'
import type { LoginFormValues } from '../schemas/login.schema'
import { useAuthStore } from '@/store/auth.store'
import { tokenStorage } from '@/services/api/token-storage'
import { ROUTES } from '@/constants/routes'
import { getErrorMessage } from '@/utils/errors'

export function useLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const tokens = await authApi.login({
        email: values.email,
        password: values.password,
      })
      return { tokens, rememberMe: values.rememberMe }
    },
    onSuccess: ({ tokens, rememberMe }) => {
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, rememberMe)
      setSession({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: tokens.user,
        rememberMe,
      })
      toast.success(`Bienvenido, ${tokens.user.firstName}`)
      void navigate(ROUTES.dashboard, { replace: true })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Credenciales inválidas'))
    },
  })
}
