import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '@/constants/query-keys'
import { getErrorMessage } from '@/utils/errors'
import { vaccinesApi } from '../api/vaccines.api'
import type { CreateVaccinePayload, VaccinesListParams } from '../types/vaccine.types'

export function useVaccines(params: VaccinesListParams) {
  return useQuery({
    queryKey: queryKeys.vaccines.list(params),
    queryFn: () => vaccinesApi.list(params),
  })
}

export function useCreateVaccine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateVaccinePayload) => vaccinesApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vaccines.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
      toast.success('Vacuna registrada')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteVaccine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vaccinesApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vaccines.all })
      toast.success('Vacuna eliminada')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
