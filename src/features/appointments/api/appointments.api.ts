import { api } from '@/services/api/axios-instance'
import type { PaginatedResult } from '@/types/api'
import type {
  AppointmentDto,
  AppointmentsListParams,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../types/appointment.types'

export const appointmentsApi = {
  list: async (
    params: AppointmentsListParams = {},
  ): Promise<PaginatedResult<AppointmentDto>> => {
    const { data } = await api.get<PaginatedResult<AppointmentDto>>('/appointments', { params })
    return data
  },
  getById: async (id: string): Promise<AppointmentDto> => {
    const { data } = await api.get<AppointmentDto>(`/appointments/${id}`)
    return data
  },
  create: async (payload: CreateAppointmentPayload): Promise<AppointmentDto> => {
    const { data } = await api.post<AppointmentDto>('/appointments', payload)
    return data
  },
  update: async (id: string, payload: UpdateAppointmentPayload): Promise<AppointmentDto> => {
    const { data } = await api.patch<AppointmentDto>(`/appointments/${id}`, payload)
    return data
  },
  cancel: async (id: string): Promise<AppointmentDto> => {
    const { data } = await api.post<AppointmentDto>(`/appointments/${id}/cancel`)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`)
  },
}
