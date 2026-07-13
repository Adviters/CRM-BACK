export const Role = {
  ADMIN: 'ADMIN',
  VETERINARIAN: 'VETERINARIAN',
  RECEPTIONIST: 'RECEPTIONIST',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  VETERINARIAN: 'Veterinario',
  RECEPTIONIST: 'Recepcionista',
}

export const PetSex = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  UNKNOWN: 'UNKNOWN',
} as const

export type PetSex = (typeof PetSex)[keyof typeof PetSex]

export const PET_SEX_LABELS: Record<PetSex, string> = {
  MALE: 'Macho',
  FEMALE: 'Hembra',
  UNKNOWN: 'Desconocido',
}

export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}
