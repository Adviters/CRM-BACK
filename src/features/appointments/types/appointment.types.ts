import type { AppointmentStatus } from '@/types/enums'

export interface AppointmentDto {
  id: string
  date: string
  time: string
  reason: string
  status: AppointmentStatus
  petId: string
  veterinarianId: string
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentPayload {
  date: string
  time: string
  reason: string
  petId: string
  veterinarianId: string
}

export interface UpdateAppointmentPayload {
  date?: string
  time?: string
  reason?: string
  status?: AppointmentStatus
  petId?: string
  veterinarianId?: string
}

export interface AppointmentsListParams {
  page?: number
  limit?: number
  petId?: string
  veterinarianId?: string
  status?: AppointmentStatus
  date?: string
}
