import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { emptyToUndefined } from '@/lib/validations'
import { customerSchema, type CustomerFormValues } from '../schemas/customer.schema'
import type { CustomerDto } from '../types/customer.types'
import type { CreateCustomerPayload } from '../types/customer.types'

interface CustomerFormProps {
  initialValues?: CustomerDto
  onSubmit: (values: CreateCustomerPayload) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function CustomerForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Guardar',
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      document: initialValues?.document ?? '',
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? '',
      address: initialValues?.address ?? '',
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        onSubmit({
          firstName: values.firstName,
          lastName: values.lastName,
          document: values.document,
          phone: values.phone,
          email: emptyToUndefined(values.email),
          address: emptyToUndefined(values.address),
        })
      })}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nombre" htmlFor="firstName" error={errors.firstName?.message} required>
          <Input id="firstName" hasError={Boolean(errors.firstName)} {...register('firstName')} />
        </FormField>
        <FormField label="Apellido" htmlFor="lastName" error={errors.lastName?.message} required>
          <Input id="lastName" hasError={Boolean(errors.lastName)} {...register('lastName')} />
        </FormField>
        <FormField label="Documento" htmlFor="document" error={errors.document?.message} required>
          <Input id="document" hasError={Boolean(errors.document)} {...register('document')} />
        </FormField>
        <FormField label="Teléfono" htmlFor="phone" error={errors.phone?.message} required>
          <Input id="phone" hasError={Boolean(errors.phone)} {...register('phone')} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" hasError={Boolean(errors.email)} {...register('email')} />
        </FormField>
        <FormField label="Dirección" htmlFor="address" error={errors.address?.message}>
          <Input id="address" hasError={Boolean(errors.address)} {...register('address')} />
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
