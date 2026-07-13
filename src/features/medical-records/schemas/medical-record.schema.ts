import { z } from 'zod'
import {
  optionalNonNegativeNumber,
  optionalString,
  requiredString,
  uuidSchema,
} from '@/lib/validations'

export const medicalRecordSchema = z.object({
  petId: uuidSchema,
  reason: requiredString('Motivo'),
  diagnosis: requiredString('Diagnóstico'),
  treatment: requiredString('Tratamiento'),
  date: optionalString,
  observations: optionalString,
  weight: optionalNonNegativeNumber,
  veterinarianId: optionalString,
})

export type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>
