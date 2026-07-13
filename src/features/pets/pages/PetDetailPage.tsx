import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Can } from '@/components/forms/Can'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { Permission } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDisclosure } from '@/hooks/use-disclosure'
import { formatDate, formatTime } from '@/lib/dayjs'
import { PET_SEX_LABELS, APPOINTMENT_STATUS_LABELS } from '@/types/enums'
import { useCustomer } from '@/features/customers/hooks/use-customers'
import { MedicalRecordTimeline } from '@/features/medical-records/components/MedicalRecordTimeline'
import { CreateMedicalRecordDialog } from '@/features/medical-records/components/CreateMedicalRecordDialog'
import { VaccineList } from '@/features/vaccines/components/VaccineList'
import { CreateVaccineDialog } from '@/features/vaccines/components/CreateVaccineDialog'
import { useAppointments } from '@/features/appointments/hooks/use-appointments'
import { useDeletePet, usePet } from '../hooks/use-pets'

export function PetDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const confirm = useDisclosure()
  const medicalDialog = useDisclosure()
  const vaccineDialog = useDisclosure()
  const { data, isLoading, isError, refetch } = usePet(id)
  const customerQuery = useCustomer(data?.customerId)
  const appointmentsQuery = useAppointments({ petId: id, limit: 20 })
  const removePet = useDeletePet()

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" label="Cargando mascota..." />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title={data.name}
        description={`${data.species}${data.breed ? ` · ${data.breed}` : ''}`}
        actions={
          <>
            <Can permission={Permission.PETS_WRITE}>
              <Button
                variant="outline"
                leftIcon={<PencilSquareIcon className="size-4" />}
                onClick={() => void navigate(ROUTES.petEdit(data.id))}
              >
                Editar
              </Button>
            </Can>
            <Can permission={Permission.PETS_DELETE}>
              <Button variant="danger" leftIcon={<TrashIcon className="size-4" />} onClick={confirm.open}>
                Eliminar
              </Button>
            </Can>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Datos generales</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <InfoRow label="Sexo" value={PET_SEX_LABELS[data.sex]} />
            <InfoRow
              label="Peso actual"
              value={data.currentWeight != null ? `${data.currentWeight} kg` : '—'}
            />
            <InfoRow label="Nacimiento" value={formatDate(data.birthDate)} />
            <InfoRow label="Color" value={data.color ?? '—'} />
            <InfoRow
              label="Cliente"
              value={
                customerQuery.data ? (
                  <Link
                    to={ROUTES.customerDetail(customerQuery.data.id)}
                    className="font-medium text-brand hover:underline"
                  >
                    {customerQuery.data.firstName} {customerQuery.data.lastName}
                  </Link>
                ) : (
                  '—'
                )
              }
            />
            <div>
              <p className="mb-1 text-ink-muted">Observaciones</p>
              <p className="rounded-lg bg-surface-muted px-3 py-2 text-ink">
                {data.notes?.trim() ? data.notes : 'Sin observaciones'}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historia clínica</CardTitle>
            <Can permission={Permission.MEDICAL_RECORDS_WRITE}>
              <Button size="sm" leftIcon={<PlusIcon className="size-4" />} onClick={medicalDialog.open}>
                Nueva consulta
              </Button>
            </Can>
          </CardHeader>
          <CardBody>
            <Can
              permission={Permission.MEDICAL_RECORDS_READ}
              fallback={
                <EmptyState
                  title="Sin acceso a historia clínica"
                  description="Tu rol no permite consultar registros médicos."
                />
              }
            >
              <MedicalRecordTimeline petId={data.id} />
            </Can>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vacunas</CardTitle>
            <Can permission={Permission.VACCINES_WRITE}>
              <Button size="sm" leftIcon={<PlusIcon className="size-4" />} onClick={vaccineDialog.open}>
                Registrar vacuna
              </Button>
            </Can>
          </CardHeader>
          <CardBody>
            <VaccineList petId={data.id} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turnos</CardTitle>
            <Can permission={Permission.APPOINTMENTS_WRITE}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void navigate(`${ROUTES.appointments}?petId=${data.id}`)}
              >
                Ver agenda
              </Button>
            </Can>
          </CardHeader>
          <CardBody>
            {appointmentsQuery.isLoading ? (
              <Loader label="Cargando turnos..." />
            ) : (appointmentsQuery.data?.data.length ?? 0) === 0 ? (
              <EmptyState title="Sin turnos" description="No hay turnos asociados a esta mascota." />
            ) : (
              <ul className="space-y-3">
                {appointmentsQuery.data?.data.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="rounded-xl border border-border px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink">
                        {formatDate(appointment.date)} · {formatTime(appointment.time)}
                      </span>
                      <Badge>{APPOINTMENT_STATUS_LABELS[appointment.status]}</Badge>
                    </div>
                    <p className="mt-1 text-ink-muted">{appointment.reason}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <CreateMedicalRecordDialog
        open={medicalDialog.isOpen}
        onClose={medicalDialog.close}
        petId={data.id}
      />
      <CreateVaccineDialog
        open={vaccineDialog.isOpen}
        onClose={vaccineDialog.close}
        petId={data.id}
      />

      <ConfirmDialog
        open={confirm.isOpen}
        onClose={confirm.close}
        title="Eliminar mascota"
        description={`¿Eliminar a ${data.name}?`}
        isLoading={removePet.isPending}
        onConfirm={() => {
          removePet.mutate(data.id, {
            onSuccess: () => void navigate(ROUTES.pets),
          })
        }}
      />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  )
}
