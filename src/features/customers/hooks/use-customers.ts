import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '@/constants/query-keys'
import { getErrorMessage } from '@/utils/errors'
import { customersApi } from '../api/customers.api'
import type {
  CreateCustomerPayload,
  CustomersListParams,
  UpdateCustomerPayload,
} from '../types/customer.types'

export function useCustomers(params: CustomersListParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => customersApi.list(params),
  })
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id ?? ''),
    queryFn: () => customersApi.getById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => customersApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      toast.success('Cliente creado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) => customersApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(id) })
      toast.success('Cliente actualizado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customersApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      toast.success('Cliente eliminado')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
