import { api } from '@/services/api/axios-instance'
import type { PaginatedResult } from '@/types/api'
import type {
  CreateVaccinePayload,
  VaccineDto,
  VaccinesListParams,
} from '../types/vaccine.types'

export const vaccinesApi = {
  list: async (params: VaccinesListParams = {}): Promise<PaginatedResult<VaccineDto>> => {
    const { data } = await api.get<PaginatedResult<VaccineDto>>('/vaccines', { params })
    return data
  },
  getById: async (id: string): Promise<VaccineDto> => {
    const { data } = await api.get<VaccineDto>(`/vaccines/${id}`)
    return data
  },
  create: async (payload: CreateVaccinePayload): Promise<VaccineDto> => {
    const { data } = await api.post<VaccineDto>('/vaccines', payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/vaccines/${id}`)
  },
}
