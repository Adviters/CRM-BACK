import { describe, expect, it } from 'vitest'
import {
  getPermissionsForRole,
  hasAnyPermission,
  hasPermission,
  Permission,
} from '@/constants/permissions'
import { Role } from '@/types/enums'

describe('permissions', () => {
  it('ADMIN tiene todos los permisos', () => {
    expect(hasPermission(Role.ADMIN, Permission.USERS_MANAGE)).toBe(true)
    expect(hasPermission(Role.ADMIN, Permission.CUSTOMERS_DELETE)).toBe(true)
    expect(getPermissionsForRole(Role.ADMIN).length).toBeGreaterThan(10)
  })

  it('VETERINARIAN no escribe clientes ni turnos', () => {
    expect(hasPermission(Role.VETERINARIAN, Permission.CUSTOMERS_WRITE)).toBe(false)
    expect(hasPermission(Role.VETERINARIAN, Permission.APPOINTMENTS_WRITE)).toBe(false)
    expect(hasPermission(Role.VETERINARIAN, Permission.MEDICAL_RECORDS_WRITE)).toBe(true)
    expect(hasPermission(Role.VETERINARIAN, Permission.VACCINES_WRITE)).toBe(true)
  })

  it('RECEPTIONIST no lee historia clínica', () => {
    expect(hasPermission(Role.RECEPTIONIST, Permission.MEDICAL_RECORDS_READ)).toBe(false)
    expect(hasPermission(Role.RECEPTIONIST, Permission.CUSTOMERS_WRITE)).toBe(true)
    expect(hasPermission(Role.RECEPTIONIST, Permission.APPOINTMENTS_WRITE)).toBe(true)
  })

  it('hasAnyPermission y null role', () => {
    expect(hasPermission(null, Permission.DASHBOARD_READ)).toBe(false)
    expect(
      hasAnyPermission(Role.RECEPTIONIST, [
        Permission.USERS_MANAGE,
        Permission.CUSTOMERS_READ,
      ]),
    ).toBe(true)
  })
})
