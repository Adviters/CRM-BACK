import { z } from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'El email es obligatorio')
  .email('Email inválido')

/** Contraseña del login: solo presencia (la complejidad la valida el alta de usuarios). */
export const loginPasswordSchema = z
  .string()
  .min(1, 'La contraseña es obligatoria')

/** Política alineada al backend NestJS (min 8 + mayúscula + minúscula + dígito). */
export const PASSWORD_POLICY_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(
    PASSWORD_POLICY_PATTERN,
    'Debe incluir al menos una mayúscula, una minúscula y un número',
  )

export const requiredString = (label: string, min = 1) =>
  z.string().trim().min(min, `${label} es obligatorio`)

export const optionalString = z.string().trim().optional()

export const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === '' || z.string().email().safeParse(value).success, {
    message: 'Email inválido',
  })
  .optional()

export const phoneSchema = z
  .string()
  .trim()
  .min(6, 'Teléfono inválido')
  .max(30, 'Teléfono inválido')

export const uuidSchema = z.string().uuid('Identificador inválido')

/** Peso alineado al backend (`@Min(0)`). */
export const optionalNonNegativeNumber = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value || value.trim() === '') return true
      const parsed = Number(value)
      return !Number.isNaN(parsed) && parsed >= 0
    },
    { message: 'Debe ser un número mayor o igual a 0' },
  )

/** @deprecated Usar optionalNonNegativeNumber */
export const optionalPositiveNumber = optionalNonNegativeNumber

export function emptyToUndefined(value: string | undefined): string | undefined {
  if (value === undefined || value === null) return undefined
  if (value.trim() === '') return undefined
  return value
}

export function emptyToUndefinedNumber(value: string | undefined): number | undefined {
  if (!value || value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

/** Normaliza `YYYY-MM-DD` a ISO date-time para `@IsDateString` del backend. */
export function toIsoDateTime(value: string | undefined): string | undefined {
  const normalized = emptyToUndefined(value)
  if (!normalized) return undefined
  if (normalized.includes('T')) return normalized
  return `${normalized}T00:00:00.000Z`
}
