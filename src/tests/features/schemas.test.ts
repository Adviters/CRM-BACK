import { describe, expect, it } from 'vitest'
import { loginSchema } from '@/features/auth/schemas/login.schema'
import { customerSchema } from '@/features/customers/schemas/customer.schema'
import { petSchema } from '@/features/pets/schemas/pet.schema'
import { appointmentSchema } from '@/features/appointments/schemas/appointment.schema'
import { createUserSchema } from '@/features/users/schemas/user.schema'
import { vaccineSchema } from '@/features/vaccines/schemas/vaccine.schema'
import { medicalRecordSchema } from '@/features/medical-records/schemas/medical-record.schema'
import { PetSex, Role } from '@/types/enums'

const PET_ID = '550e8400-e29b-41d4-a716-446655440000'
const VET_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7'

describe('feature schemas', () => {
  it('valida login', () => {
    expect(
      loginSchema.safeParse({
        email: 'a@b.com',
        password: 'x',
        rememberMe: true,
      }).success,
    ).toBe(true)
    expect(
      loginSchema.safeParse({
        email: 'bad',
        password: '',
        rememberMe: false,
      }).success,
    ).toBe(false)
  })

  it('valida customer', () => {
    expect(
      customerSchema.safeParse({
        firstName: 'Ana',
        lastName: 'Perez',
        document: '123',
        phone: '1234567',
        email: '',
        address: '',
      }).success,
    ).toBe(true)
  })

  it('valida pet', () => {
    expect(
      petSchema.safeParse({
        name: 'Firulais',
        species: 'Perro',
        customerId: PET_ID,
        sex: PetSex.MALE,
        currentWeight: '0',
      }).success,
    ).toBe(true)
  })

  it('valida appointment', () => {
    expect(
      appointmentSchema.safeParse({
        date: '2024-01-01',
        time: '10:30',
        reason: 'Control',
        petId: PET_ID,
        veterinarianId: VET_ID,
      }).success,
    ).toBe(true)
  })

  it('valida user create con política de password', () => {
    expect(
      createUserSchema.safeParse({
        email: 'a@b.com',
        password: 'Password1',
        firstName: 'A',
        lastName: 'B',
        role: Role.ADMIN,
      }).success,
    ).toBe(true)
    expect(
      createUserSchema.safeParse({
        email: 'a@b.com',
        password: 'password',
        firstName: 'A',
        lastName: 'B',
        role: Role.ADMIN,
      }).success,
    ).toBe(false)
  })

  it('valida vaccine y medical record', () => {
    expect(
      vaccineSchema.safeParse({
        name: 'Antirrábica',
        appliedAt: '2024-01-01',
        petId: PET_ID,
      }).success,
    ).toBe(true)

    expect(
      medicalRecordSchema.safeParse({
        petId: PET_ID,
        reason: 'Control',
        diagnosis: 'OK',
        treatment: 'Ninguno',
        weight: '0',
      }).success,
    ).toBe(true)
  })
})
