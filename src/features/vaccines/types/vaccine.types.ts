export interface VaccineDto {
  id: string
  name: string
  appliedAt: string
  nextApplicationAt: string | null
  petId: string
  veterinarianId: string
  createdAt: string
  updatedAt: string
}

export interface CreateVaccinePayload {
  name: string
  appliedAt: string
  petId: string
  nextApplicationAt?: string
  veterinarianId?: string
}

export interface VaccinesListParams {
  page?: number
  limit?: number
  petId?: string
}
