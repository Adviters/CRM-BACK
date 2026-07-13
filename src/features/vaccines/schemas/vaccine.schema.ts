import { z } from 'zod'
import { optionalString, requiredString, uuidSchema } from '@/lib/validations'

export const vaccineSchema = z.object({
  name: requiredString('Nombre'),
  appliedAt: requiredString('Fecha de aplicación'),
  petId: uuidSchema,
  nextApplicationAt: optionalString,
  veterinarianId: optionalString,
})

export type VaccineFormValues = z.infer<typeof vaccineSchema>
