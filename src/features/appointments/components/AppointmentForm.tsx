import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FormField } from '@/components/forms/FormField'
import { APPOINTMENT_STATUS_LABELS, AppointmentStatus } from '@/types/enums'
import { usePets } from '@/features/pets/hooks/use-pets'
import { useVeterinarians } from '@/features/users/hooks/use-users'
import { appointmentSchema, type AppointmentFormValues } from '../schemas/appointment.schema'
import type { AppointmentDto } from '../types/appointment.types'

interface AppointmentFormProps {
  initialValues?: AppointmentDto
  defaultPetId?: string
  defaultDate?: string
  onSubmit: (values: AppointmentFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function AppointmentForm({
  initialValues,
  defaultPetId,
  defaultDate,
  onSubmit,
  isSubmitting,
  submitLabel = 'Guardar',
}: AppointmentFormProps) {
  const petsQuery = usePets({ page: 1, limit: 100 })
  const veterinariansQuery = useVeterinarians()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: initialValues?.date?.slice(0, 10) ?? defaultDate ?? '',
      time: initialValues?.time?.slice(0, 5) ?? '',
      reason: initialValues?.reason ?? '',
      petId: initialValues?.petId ?? defaultPetId ?? '',
      veterinarianId: initialValues?.veterinarianId ?? '',
      status: initialValues?.status ?? AppointmentStatus.PENDING,
    },
  })

  useEffect(() => {
    if (defaultPetId || defaultDate) {
      reset((values) => ({
        ...values,
        petId: defaultPetId ?? values.petId,
        date: defaultDate ?? values.date,
      }))
    }
  }, [defaultPetId, defaultDate, reset])

  const veterinarianOptions =
    veterinariansQuery.data?.map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    })) ?? []

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Fecha" htmlFor="date" error={errors.date?.message} required>
          <Input id="date" type="date" hasError={Boolean(errors.date)} {...register('date')} />
        </FormField>
        <FormField label="Horario" htmlFor="time" error={errors.time?.message} required>
          <Input id="time" type="time" hasError={Boolean(errors.time)} {...register('time')} />
        </FormField>
        <FormField label="Mascota" htmlFor="petId" error={errors.petId?.message} required>
          <Select
            id="petId"
            hasError={Boolean(errors.petId)}
            options={
              petsQuery.data?.data.map((pet) => ({
                value: pet.id,
                label: `${pet.name} · ${pet.species}`,
              })) ?? []
            }
            placeholder="Seleccionar mascota"
            {...register('petId')}
          />
        </FormField>
        <FormField
          label="Veterinario"
          htmlFor="veterinarianId"
          error={errors.veterinarianId?.message}
          required
        >
          <Select
            id="veterinarianId"
            hasError={Boolean(errors.veterinarianId)}
            options={veterinarianOptions}
            placeholder={
              veterinariansQuery.isLoading
                ? 'Cargando veterinarios...'
                : 'Seleccionar veterinario'
            }
            disabled={veterinariansQuery.isLoading || veterinarianOptions.length === 0}
            {...register('veterinarianId')}
          />
        </FormField>
        <FormField
          className="md:col-span-2"
          label="Motivo"
          htmlFor="reason"
          error={errors.reason?.message}
          required
        >
          <Input id="reason" hasError={Boolean(errors.reason)} {...register('reason')} />
        </FormField>
        {initialValues ? (
          <FormField label="Estado" htmlFor="status" error={errors.status?.message}>
            <Select
              id="status"
              options={Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
              {...register('status')}
            />
          </FormField>
        ) : null}
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
