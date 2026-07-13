import { Role } from '@/types/enums'

export const Permission = {
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_WRITE: 'customers:write',
  CUSTOMERS_DELETE: 'customers:delete',
  PETS_READ: 'pets:read',
  PETS_WRITE: 'pets:write',
  PETS_DELETE: 'pets:delete',
  APPOINTMENTS_READ: 'appointments:read',
  APPOINTMENTS_WRITE: 'appointments:write',
  APPOINTMENTS_DELETE: 'appointments:delete',
  MEDICAL_RECORDS_READ: 'medical-records:read',
  MEDICAL_RECORDS_WRITE: 'medical-records:write',
  VACCINES_READ: 'vaccines:read',
  VACCINES_WRITE: 'vaccines:write',
  VACCINES_DELETE: 'vaccines:delete',
  DASHBOARD_READ: 'dashboard:read',
  USERS_MANAGE: 'users:manage',
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]

const ALL_PERMISSIONS = Object.values(Permission)

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  ADMIN: ALL_PERMISSIONS,
  VETERINARIAN: [
    Permission.CUSTOMERS_READ,
    Permission.PETS_READ,
    Permission.APPOINTMENTS_READ,
    Permission.MEDICAL_RECORDS_READ,
    Permission.MEDICAL_RECORDS_WRITE,
    Permission.VACCINES_READ,
    Permission.VACCINES_WRITE,
    Permission.DASHBOARD_READ,
  ],
  RECEPTIONIST: [
    Permission.CUSTOMERS_READ,
    Permission.CUSTOMERS_WRITE,
    Permission.PETS_READ,
    Permission.PETS_WRITE,
    Permission.APPOINTMENTS_READ,
    Permission.APPOINTMENTS_WRITE,
    Permission.VACCINES_READ,
    Permission.DASHBOARD_READ,
  ],
}

export function getPermissionsForRole(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role]
}

export function hasPermission(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false
  return getPermissionsForRole(role).includes(permission)
}

export function hasAnyPermission(
  role: Role | null | undefined,
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}
