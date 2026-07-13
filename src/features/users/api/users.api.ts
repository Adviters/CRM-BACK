import { api } from '@/services/api/axios-instance'
import type { PaginatedResult } from '@/types/api'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDto,
  UsersListParams,
} from '../types/user.types'

export const usersApi = {
  list: async (params: UsersListParams = {}): Promise<PaginatedResult<UserDto>> => {
    const { data } = await api.get<PaginatedResult<UserDto>>('/users', { params })
    return data
  },
  getById: async (id: string): Promise<UserDto> => {
    const { data } = await api.get<UserDto>(`/users/${id}`)
    return data
  },
  create: async (payload: CreateUserPayload): Promise<UserDto> => {
    const { data } = await api.post<UserDto>('/users', payload)
    return data
  },
  update: async (id: string, payload: UpdateUserPayload): Promise<UserDto> => {
    const { data } = await api.patch<UserDto>(`/users/${id}`, payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
