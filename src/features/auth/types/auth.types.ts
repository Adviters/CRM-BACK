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

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  user: UserDto
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RefreshPayload {
  refreshToken: string
}

export interface LogoutPayload {
  refreshToken?: string
}
