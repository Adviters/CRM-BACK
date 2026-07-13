import { z } from 'zod'
import {
  optionalEmail,
  optionalString,
  phoneSchema,
  requiredString,
} from '@/lib/validations'

export const customerSchema = z.object({
  firstName: requiredString('Nombre'),
  lastName: requiredString('Apellido'),
  document: requiredString('Documento'),
  phone: phoneSchema,
  email: optionalEmail,
  address: optionalString,
})

export type CustomerFormValues = z.infer<typeof customerSchema>
