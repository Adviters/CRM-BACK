import { api } from '@/services/api/axios-instance'
import type { PaginatedResult } from '@/types/api'
import type {
  CreatePetPayload,
  PetDto,
  PetsListParams,
  UpdatePetPayload,
} from '../types/pet.types'

export const petsApi = {
  list: async (params: PetsListParams = {}): Promise<PaginatedResult<PetDto>> => {
    const { data } = await api.get<PaginatedResult<PetDto>>('/pets', { params })
    return data
  },
  getById: async (id: string): Promise<PetDto> => {
    const { data } = await api.get<PetDto>(`/pets/${id}`)
    return data
  },
  create: async (payload: CreatePetPayload): Promise<PetDto> => {
    const { data } = await api.post<PetDto>('/pets', payload)
    return data
  },
  update: async (id: string, payload: UpdatePetPayload): Promise<PetDto> => {
    const { data } = await api.patch<PetDto>(`/pets/${id}`, payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/pets/${id}`)
  },
}
