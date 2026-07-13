import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FormField } from '@/components/forms/FormField'
import { Can } from '@/components/forms/Can'
import { Permission } from '@/constants/permissions'
import { emptyToUndefined, emptyToUndefinedNumber, toIsoDateTime } from '@/lib/validations'
import {
  medicalRecordSchema,
  type MedicalRecordFormValues,
} from '../schemas/medical-record.schema'
import { useCreateMedicalRecord } from '../hooks/use-medical-records'

interface CreateMedicalRecordDialogProps {
  open: boolean
  onClose: () => void
  petId: string
}

export function CreateMedicalRecordDialog({
  open,
  onClose,
  petId,
}: CreateMedicalRecordDialogProps) {
  const createRecord = useCreateMedicalRecord()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      petId,
      reason: '',
      diagnosis: '',
      treatment: '',
      date: '',
      observations: '',
      weight: '',
      veterinarianId: '',
    },
  })

  useEffect(() => {
    setValue('petId', petId)
  }, [petId, setValue])

  const handleClose = () => {
    reset({
      petId,
      reason: '',
      diagnosis: '',
      treatment: '',
      date: '',
      observations: '',
      weight: '',
      veterinarianId: '',
    })
    onClose()
  }

  return (
    <Can permission={Permission.MEDICAL_RECORDS_WRITE}>
      <Modal
        open={open}
        onClose={handleClose}
        title="Nueva consulta"
        description="El registro clínico es inmutable una vez creado."
        size="lg"
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) => {
            createRecord.mutate(
              {
                petId: values.petId,
                reason: values.reason,
                diagnosis: values.diagnosis,
                treatment: values.treatment,
                date: toIsoDateTime(values.date),
                observations: emptyToUndefined(values.observations),
                weight: emptyToUndefinedNumber(values.weight),
                veterinarianId: emptyToUndefined(values.veterinarianId),
              },
              { onSuccess: () => handleClose() },
            )
          })}
          noValidate
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Motivo" htmlFor="reason" error={errors.reason?.message} required>
              <Input id="reason" hasError={Boolean(errors.reason)} {...register('reason')} />
            </FormField>
            <FormField label="Fecha" htmlFor="date" error={errors.date?.message}>
              <Input id="date" type="date" {...register('date')} />
            </FormField>
            <FormField
              label="Diagnóstico"
              htmlFor="diagnosis"
              error={errors.diagnosis?.message}
              required
            >
              <Input
                id="diagnosis"
                hasError={Boolean(errors.diagnosis)}
                {...register('diagnosis')}
              />
            </FormField>
            <FormField
              label="Tratamiento"
              htmlFor="treatment"
              error={errors.treatment?.message}
              required
            >
              <Input
                id="treatment"
                hasError={Boolean(errors.treatment)}
                {...register('treatment')}
              />
            </FormField>
            <FormField label="Peso (kg)" htmlFor="weight" error={errors.weight?.message}>
              <Input id="weight" type="number" step="0.01" {...register('weight')} />
            </FormField>
            <FormField
              className="md:col-span-2"
              label="Observaciones"
              htmlFor="observations"
              error={errors.observations?.message}
            >
              <Textarea id="observations" {...register('observations')} />
            </FormField>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={createRecord.isPending}>
              Guardar consulta
            </Button>
          </div>
        </form>
      </Modal>
    </Can>
  )
}
