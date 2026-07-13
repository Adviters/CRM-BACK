import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '@/constants/query-keys'
import { getErrorMessage } from '@/utils/errors'
import { petsApi } from '../api/pets.api'
import type { CreatePetPayload, PetsListParams, UpdatePetPayload } from '../types/pet.types'

export function usePets(params: PetsListParams) {
  return useQuery({
    queryKey: queryKeys.pets.list(params),
    queryFn: () => petsApi.list(params),
  })
}

export function usePet(id?: string) {
  return useQuery({
    queryKey: queryKeys.pets.detail(id ?? ''),
    queryFn: () => petsApi.getById(id!),
    enabled: Boolean(id),
  })
}

export function useCreatePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePetPayload) => petsApi.create(payload),
    onSuccess: async (pet) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pets.all })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(pet.customerId),
      })
      toast.success('Mascota registrada')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdatePet(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePetPayload) => petsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pets.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(id) })
      toast.success('Mascota actualizada')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeletePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => petsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pets.all })
      toast.success('Mascota eliminada')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
