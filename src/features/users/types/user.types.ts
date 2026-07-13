import type { Role } from '@/types/enums'

export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
}

export interface UpdateUserPayload {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  role?: Role
  isActive?: boolean
}

export interface UsersListParams {
  page?: number
  limit?: number
}
