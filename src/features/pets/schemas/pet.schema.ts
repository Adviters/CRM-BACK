import { z } from 'zod'
import { PetSex } from '@/types/enums'
import {
  optionalNonNegativeNumber,
  optionalString,
  requiredString,
  uuidSchema,
} from '@/lib/validations'

export const petSchema = z.object({
  name: requiredString('Nombre'),
  species: requiredString('Especie'),
  customerId: uuidSchema,
  breed: optionalString,
  sex: z.enum([PetSex.MALE, PetSex.FEMALE, PetSex.UNKNOWN]),
  birthDate: optionalString,
  currentWeight: optionalNonNegativeNumber,
  color: optionalString,
  notes: optionalString,
})

export type PetFormValues = z.infer<typeof petSchema>
