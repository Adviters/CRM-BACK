import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FormField } from '@/components/forms/FormField'
import { PET_SEX_LABELS, PetSex } from '@/types/enums'
import { emptyToUndefined, emptyToUndefinedNumber } from '@/lib/validations'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { petSchema, type PetFormValues } from '../schemas/pet.schema'
import type { CreatePetPayload, PetDto } from '../types/pet.types'

interface PetFormProps {
  initialValues?: PetDto
  defaultCustomerId?: string
  lockCustomer?: boolean
  onSubmit: (values: CreatePetPayload) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function PetForm({
  initialValues,
  defaultCustomerId,
  lockCustomer,
  onSubmit,
  isSubmitting,
  submitLabel = 'Guardar',
}: PetFormProps) {
  const customersQuery = useCustomers({ page: 1, limit: 100 })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      species: initialValues?.species ?? '',
      customerId: initialValues?.customerId ?? defaultCustomerId ?? '',
      breed: initialValues?.breed ?? '',
      sex: initialValues?.sex ?? PetSex.UNKNOWN,
      birthDate: initialValues?.birthDate?.slice(0, 10) ?? '',
      currentWeight:
        initialValues?.currentWeight != null ? String(initialValues.currentWeight) : '',
      color: initialValues?.color ?? '',
      notes: initialValues?.notes ?? '',
    },
  })

  useEffect(() => {
    if (defaultCustomerId) {
      reset((values) => ({ ...values, customerId: defaultCustomerId }))
    }
  }, [defaultCustomerId, reset])

  const customerOptions =
    customersQuery.data?.data.map((customer) => ({
      value: customer.id,
      label: `${customer.firstName} ${customer.lastName} · ${customer.document}`,
    })) ?? []

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        onSubmit({
          name: values.name,
          species: values.species,
          customerId: values.customerId,
          sex: values.sex,
          breed: emptyToUndefined(values.breed),
          birthDate: emptyToUndefined(values.birthDate),
          currentWeight: emptyToUndefinedNumber(values.currentWeight),
          color: emptyToUndefined(values.color),
          notes: emptyToUndefined(values.notes),
        })
      })}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nombre" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" hasError={Boolean(errors.name)} {...register('name')} />
        </FormField>
        <FormField label="Especie" htmlFor="species" error={errors.species?.message} required>
          <Input id="species" hasError={Boolean(errors.species)} {...register('species')} />
        </FormField>
        <FormField label="Cliente" htmlFor="customerId" error={errors.customerId?.message} required>
          <Select
            id="customerId"
            hasError={Boolean(errors.customerId)}
            options={customerOptions}
            placeholder="Seleccionar cliente"
            disabled={lockCustomer || Boolean(initialValues)}
            {...register('customerId')}
          />
        </FormField>
        <FormField label="Raza" htmlFor="breed" error={errors.breed?.message}>
          <Input id="breed" {...register('breed')} />
        </FormField>
        <FormField label="Sexo" htmlFor="sex" error={errors.sex?.message}>
          <Select
            id="sex"
            options={Object.entries(PET_SEX_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('sex')}
          />
        </FormField>
        <FormField label="Fecha de nacimiento" htmlFor="birthDate" error={errors.birthDate?.message}>
          <Input id="birthDate" type="date" {...register('birthDate')} />
        </FormField>
        <FormField
          label="Peso actual (kg)"
          htmlFor="currentWeight"
          error={errors.currentWeight?.message}
        >
          <Input id="currentWeight" type="number" step="0.01" {...register('currentWeight')} />
        </FormField>
        <FormField label="Color" htmlFor="color" error={errors.color?.message}>
          <Input id="color" {...register('color')} />
        </FormField>
        <FormField
          className="md:col-span-2"
          label="Observaciones"
          htmlFor="notes"
          error={errors.notes?.message}
        >
          <Textarea id="notes" {...register('notes')} />
        </FormField>
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
