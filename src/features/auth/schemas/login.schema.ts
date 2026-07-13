import { z } from 'zod'
import { emailSchema, loginPasswordSchema } from '@/lib/validations'

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
