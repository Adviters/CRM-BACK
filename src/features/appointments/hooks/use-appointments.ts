import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '@/constants/query-keys'
import { getErrorMessage } from '@/utils/errors'
import { appointmentsApi } from '../api/appointments.api'
import type {
  AppointmentsListParams,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../types/appointment.types'

export function useAppointments(params: AppointmentsListParams) {
  return useQuery({
    queryKey: queryKeys.appointments.list(params),
    queryFn: () => appointmentsApi.list(params),
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
      toast.success('Turno creado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAppointmentPayload }) =>
      appointmentsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
      toast.success('Turno actualizado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.cancel(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
      toast.success('Turno cancelado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
      toast.success('Turno eliminado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
