import type { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/errors'

const SILENT_STATUS = new Set([401])

export function setupErrorInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status as number | undefined
      const url = String(error.config?.url ?? '')
      const isAuthFlow =
        url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout')

      if (!isAuthFlow && status && !SILENT_STATUS.has(status) && status >= 400) {
        if (status === 403) {
          toast.error('No tenés permisos para realizar esta acción')
        } else if (status >= 500) {
          toast.error('Error del servidor. Intentá nuevamente.')
        } else if (status !== 404) {
          toast.error(getErrorMessage(error))
        }
      }

      return Promise.reject(error)
    },
  )
}
