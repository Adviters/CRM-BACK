import { api } from '@/services/api/axios-instance'
import type {
  AuthTokensDto,
  LoginPayload,
  LogoutPayload,
  RefreshPayload,
} from '../types/auth.types'

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthTokensDto> => {
    const { data } = await api.post<AuthTokensDto>('/auth/login', payload)
    return data
  },
  refresh: async (payload: RefreshPayload): Promise<AuthTokensDto> => {
    const { data } = await api.post<AuthTokensDto>('/auth/refresh', payload)
    return data
  },
  logout: async (payload?: LogoutPayload): Promise<void> => {
    await api.post('/auth/logout', payload ?? {})
  },
}
