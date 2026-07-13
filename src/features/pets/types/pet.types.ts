import type { PetSex } from '@/types/enums'

export interface PetDto {
  id: string
  name: string
  species: string
  breed: string | null
  sex: PetSex
  birthDate: string | null
  currentWeight: number | null
  color: string | null
  notes: string | null
  customerId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePetPayload {
  name: string
  species: string
  customerId: string
  breed?: string
  sex?: PetSex
  birthDate?: string
  currentWeight?: number
  color?: string
  notes?: string
}

export type UpdatePetPayload = Omit<Partial<CreatePetPayload>, 'customerId'>

export interface PetsListParams {
  page?: number
  limit?: number
  customerId?: string
}
