import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '@/constants/query-keys'
import { getErrorMessage } from '@/utils/errors'
import { medicalRecordsApi } from '../api/medical-records.api'
import type {
  CreateMedicalRecordPayload,
  MedicalRecordsListParams,
} from '../types/medical-record.types'

export function useMedicalRecords(
  params: MedicalRecordsListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.medicalRecords.list(params),
    queryFn: () => medicalRecordsApi.list(params),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMedicalRecordPayload) => medicalRecordsApi.create(payload),
    onSuccess: async (record) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.medicalRecords.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(record.petId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
      toast.success('Consulta registrada')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
