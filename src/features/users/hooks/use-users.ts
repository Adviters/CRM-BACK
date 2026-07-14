import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '@/constants/query-keys'
import { getErrorMessage } from '@/utils/errors'
import { usersApi } from '../api/users.api'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UsersListParams,
} from '../types/user.types'

export function useUsers(
  params: UsersListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.list(params),
    enabled: options?.enabled ?? true,
  })
}

export function useVeterinarians(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.users.veterinarians,
    queryFn: () => usersApi.listVeterinarians(),
    enabled: options?.enabled ?? true,
  })
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => usersApi.getById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success('Usuario creado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      toast.success('Usuario actualizado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success('Usuario eliminado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
