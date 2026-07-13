import { z } from 'zod'
import { Role } from '@/types/enums'
import {
  emailSchema,
  passwordSchema,
  PASSWORD_POLICY_PATTERN,
  requiredString,
} from '@/lib/validations'

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: requiredString('Nombre'),
  lastName: requiredString('Apellido'),
  role: z.enum([Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST]),
})

export const updateUserSchema = z
  .object({
    email: emailSchema,
    password: z.string().optional(),
    firstName: requiredString('Nombre'),
    lastName: requiredString('Apellido'),
    role: z.enum([Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST]),
    isActive: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (!values.password || values.password.length === 0) return
    if (values.password.length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'La contraseña debe tener al menos 8 caracteres',
      })
      return
    }
    if (!PASSWORD_POLICY_PATTERN.test(values.password)) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Debe incluir al menos una mayúscula, una minúscula y un número',
      })
    }
  })

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
