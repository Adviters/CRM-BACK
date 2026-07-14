import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { FormField } from '@/components/forms/FormField'
import { ROLE_LABELS, Role } from '@/types/enums'
import { emptyToUndefined } from '@/lib/validations'
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from '../schemas/user.schema'
import type { CreateUserPayload, UpdateUserPayload, UserDto } from '../types/user.types'

interface UserFormProps {
  mode: 'create' | 'edit'
  initialValues?: UserDto
  onSubmit: (values: CreateUserPayload | UpdateUserPayload) => void
  isSubmitting?: boolean
}

export function UserForm({ mode, initialValues, onSubmit, isSubmitting }: UserFormProps) {
  if (mode === 'edit') {
    return (
      <EditUserForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    )
  }

  return <CreateUserForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
}

function CreateUserForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: CreateUserPayload) => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: Role.RECEPTIONIST,
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => onSubmit(values))}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nombre" htmlFor="firstName" error={errors.firstName?.message} required>
          <Input id="firstName" hasError={Boolean(errors.firstName)} {...register('firstName')} />
        </FormField>
        <FormField label="Apellido" htmlFor="lastName" error={errors.lastName?.message} required>
          <Input id="lastName" hasError={Boolean(errors.lastName)} {...register('lastName')} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" hasError={Boolean(errors.email)} {...register('email')} />
        </FormField>
        <FormField label="Contraseña" htmlFor="password" error={errors.password?.message} required>
          <PasswordInput
            id="password"
            hasError={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>
        <FormField label="Rol" htmlFor="role" error={errors.role?.message} required>
          <Select
            id="role"
            options={Object.entries(ROLE_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('role')}
          />
        </FormField>
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Crear usuario
        </Button>
      </div>
    </form>
  )
}

function EditUserForm({
  initialValues,
  onSubmit,
  isSubmitting,
}: {
  initialValues?: UserDto
  onSubmit: (values: UpdateUserPayload) => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: initialValues?.email ?? '',
      password: '',
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      role: initialValues?.role ?? Role.RECEPTIONIST,
      isActive: initialValues?.isActive ?? true,
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        const password = emptyToUndefined(values.password)
        onSubmit({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          isActive: values.isActive,
          ...(password ? { password } : {}),
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
        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" hasError={Boolean(errors.email)} {...register('email')} />
        </FormField>
        <FormField
          label="Nueva contraseña"
          htmlFor="password"
          error={errors.password?.message}
          hint="Dejar vacío para mantener la actual"
        >
          <PasswordInput
            id="password"
            hasError={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>
        <FormField label="Rol" htmlFor="role" error={errors.role?.message} required>
          <Select
            id="role"
            options={Object.entries(ROLE_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('role')}
          />
        </FormField>
        <FormField label="Estado" htmlFor="isActive">
          <Checkbox label="Usuario activo" {...register('isActive')} />
        </FormField>
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
