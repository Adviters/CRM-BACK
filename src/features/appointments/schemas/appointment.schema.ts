import { z } from 'zod'
import { AppointmentStatus } from '@/types/enums'
import { requiredString, uuidSchema } from '@/lib/validations'

export const appointmentSchema = z.object({
  date: requiredString('Fecha'),
  time: z
    .string()
    .min(1, 'Horario es obligatorio')
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato HH:mm'),
  reason: requiredString('Motivo'),
  petId: uuidSchema,
  veterinarianId: uuidSchema,
  status: z
    .enum([
      AppointmentStatus.PENDING,
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELLED,
    ])
    .optional(),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
