import { describe, expect, it } from 'vitest'
import {
  emptyToUndefined,
  emptyToUndefinedNumber,
  loginPasswordSchema,
  passwordSchema,
  toIsoDateTime,
  optionalNonNegativeNumber,
} from '@/lib/validations'

describe('validations', () => {
  it('valida password de login solo por presencia', () => {
    expect(loginPasswordSchema.safeParse('').success).toBe(false)
    expect(loginPasswordSchema.safeParse('x').success).toBe(true)
  })

  it('exige política de password del backend', () => {
    expect(passwordSchema.safeParse('password').success).toBe(false)
    expect(passwordSchema.safeParse('Password1').success).toBe(true)
  })

  it('normaliza strings vacíos', () => {
    expect(emptyToUndefined('')).toBeUndefined()
    expect(emptyToUndefined('  ')).toBeUndefined()
    expect(emptyToUndefined('hola')).toBe('hola')
  })

  it('parsea números opcionales', () => {
    expect(emptyToUndefinedNumber('')).toBeUndefined()
    expect(emptyToUndefinedNumber('12.5')).toBe(12.5)
    expect(emptyToUndefinedNumber('abc')).toBeUndefined()
  })

  it('convierte fechas a ISO', () => {
    expect(toIsoDateTime(undefined)).toBeUndefined()
    expect(toIsoDateTime('2024-01-15')).toBe('2024-01-15T00:00:00.000Z')
    expect(toIsoDateTime('2024-01-15T12:00:00.000Z')).toBe('2024-01-15T12:00:00.000Z')
  })

  it('permite peso >= 0', () => {
    expect(optionalNonNegativeNumber.safeParse('0').success).toBe(true)
    expect(optionalNonNegativeNumber.safeParse('-1').success).toBe(false)
    expect(optionalNonNegativeNumber.safeParse('').success).toBe(true)
  })
})
