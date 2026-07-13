export interface CustomerDto {
  id: string
  firstName: string
  lastName: string
  document: string
  phone: string
  email: string | null
  address: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerPayload {
  firstName: string
  lastName: string
  document: string
  phone: string
  email?: string
  address?: string
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>

export interface CustomersListParams {
  page?: number
  limit?: number
  search?: string
}
