export interface MedicalRecordDto {
  id: string
  date: string
  reason: string
  diagnosis: string
  treatment: string
  observations: string | null
  weight: number | null
  petId: string
  veterinarianId: string
  createdAt: string
  updatedAt: string
}

export interface CreateMedicalRecordPayload {
  petId: string
  reason: string
  diagnosis: string
  treatment: string
  veterinarianId?: string
  date?: string
  observations?: string
  weight?: number
}

export interface MedicalRecordsListParams {
  page?: number
  limit?: number
  petId?: string
}
