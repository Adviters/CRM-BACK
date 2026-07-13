import { api } from '@/services/api/axios-instance'
import type { PaginatedResult } from '@/types/api'
import type {
  CreateCustomerPayload,
  CustomerDto,
  CustomersListParams,
  UpdateCustomerPayload,
} from '../types/customer.types'

export const customersApi = {
  list: async (params: CustomersListParams = {}): Promise<PaginatedResult<CustomerDto>> => {
    const { data } = await api.get<PaginatedResult<CustomerDto>>('/customers', { params })
    return data
  },
  getById: async (id: string): Promise<CustomerDto> => {
    const { data } = await api.get<CustomerDto>(`/customers/${id}`)
    return data
  },
  create: async (payload: CreateCustomerPayload): Promise<CustomerDto> => {
    const { data } = await api.post<CustomerDto>('/customers', payload)
    return data
  },
  update: async (id: string, payload: UpdateCustomerPayload): Promise<CustomerDto> => {
    const { data } = await api.patch<CustomerDto>(`/customers/${id}`, payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`)
  },
}
