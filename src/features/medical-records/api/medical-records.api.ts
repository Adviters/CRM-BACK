import { api } from '@/services/api/axios-instance'
import type { PaginatedResult } from '@/types/api'
import type {
  CreateMedicalRecordPayload,
  MedicalRecordDto,
  MedicalRecordsListParams,
} from '../types/medical-record.types'

export const medicalRecordsApi = {
  list: async (
    params: MedicalRecordsListParams = {},
  ): Promise<PaginatedResult<MedicalRecordDto>> => {
    const { data } = await api.get<PaginatedResult<MedicalRecordDto>>('/medical-records', {
      params,
    })
    return data
  },
  getById: async (id: string): Promise<MedicalRecordDto> => {
    const { data } = await api.get<MedicalRecordDto>(`/medical-records/${id}`)
    return data
  },
  create: async (payload: CreateMedicalRecordPayload): Promise<MedicalRecordDto> => {
    const { data } = await api.post<MedicalRecordDto>('/medical-records', payload)
    return data
  },
}
