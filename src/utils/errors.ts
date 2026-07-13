import type { ApiErrorBody } from '@/types/api'
import axios from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string' && message.length > 0) return message
    if (error.message) return error.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
