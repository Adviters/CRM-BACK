import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FormField } from '@/components/forms/FormField'
import { Can } from '@/components/forms/Can'
import { Permission } from '@/constants/permissions'
import { emptyToUndefined, toIsoDateTime } from '@/lib/validations'
import { usePets } from '@/features/pets/hooks/use-pets'
import { vaccineSchema, type VaccineFormValues } from '../schemas/vaccine.schema'
import { useCreateVaccine } from '../hooks/use-vaccines'

interface CreateVaccineDialogProps {
  open: boolean
  onClose: () => void
  petId?: string
}

export function CreateVaccineDialog({ open, onClose, petId }: CreateVaccineDialogProps) {
  const createVaccine = useCreateVaccine()
  const petsQuery = usePets({ page: 1, limit: 100 })
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VaccineFormValues>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: {
      name: '',
      appliedAt: '',
      petId: petId ?? '',
      nextApplicationAt: '',
      veterinarianId: '',
    },
  })

  useEffect(() => {
    if (petId) setValue('petId', petId)
  }, [petId, setValue])

  const handleClose = () => {
    reset({
      name: '',
      appliedAt: '',
      petId: petId ?? '',
      nextApplicationAt: '',
      veterinarianId: '',
    })
    onClose()
  }

  return (
    <Can permission={Permission.VACCINES_WRITE}>
      <Modal open={open} onClose={handleClose} title="Registrar vacuna" size="md">
        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) => {
            createVaccine.mutate(
              {
                name: values.name,
                appliedAt: toIsoDateTime(values.appliedAt) ?? values.appliedAt,
                petId: values.petId,
                nextApplicationAt: toIsoDateTime(values.nextApplicationAt),
                veterinarianId: emptyToUndefined(values.veterinarianId),
              },
              { onSuccess: () => handleClose() },
            )
          })}
          noValidate
        >
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
              disabled={Boolean(petId)}
              {...register('petId')}
            />
          </FormField>
          <FormField label="Vacuna" htmlFor="name" error={errors.name?.message} required>
            <Input id="name" hasError={Boolean(errors.name)} {...register('name')} />
          </FormField>
          <FormField
            label="Fecha de aplicación"
            htmlFor="appliedAt"
            error={errors.appliedAt?.message}
            required
          >
            <Input
              id="appliedAt"
              type="date"
              hasError={Boolean(errors.appliedAt)}
              {...register('appliedAt')}
            />
          </FormField>
          <FormField
            label="Próxima aplicación"
            htmlFor="nextApplicationAt"
            error={errors.nextApplicationAt?.message}
          >
            <Input id="nextApplicationAt" type="date" {...register('nextApplicationAt')} />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={createVaccine.isPending}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </Can>
  )
}
