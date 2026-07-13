import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CalendarDaysIcon,
  PencilSquareIcon,
  PlusIcon,
  TableCellsIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Can } from '@/components/forms/Can'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { TableSkeleton } from '@/components/feedback/Skeleton'
import { Permission } from '@/constants/permissions'
import { useDisclosure } from '@/hooks/use-disclosure'
import { dayjs, formatDate, formatTime, todayIsoDate } from '@/lib/dayjs'
import { APPOINTMENT_STATUS_LABELS, AppointmentStatus } from '@/types/enums'
import { AppointmentForm } from '../components/AppointmentForm'
import { AppointmentsCalendar } from '../components/AppointmentsCalendar'
import {
  useAppointments,
  useCancelAppointment,
  useCreateAppointment,
  useDeleteAppointment,
  useUpdateAppointment,
} from '../hooks/use-appointments'
import type { AppointmentDto } from '../types/appointment.types'
import type { AppointmentFormValues } from '../schemas/appointment.schema'

type ViewMode = 'calendar' | 'table'

export function AppointmentsPage() {
  const [searchParams] = useSearchParams()
  const initialPetId = searchParams.get('petId') ?? ''
  const [view, setView] = useState<ViewMode>('calendar')
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'))
  const [selectedDate, setSelectedDate] = useState(todayIsoDate())
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [petId] = useState(initialPetId)

  const createDialog = useDisclosure()
  const editDialog = useDisclosure()
  const cancelDialog = useDisclosure()
  const deleteDialog = useDisclosure()
  const [selected, setSelected] = useState<AppointmentDto | null>(null)

  const listParams = useMemo(
    () =>
      view === 'calendar'
        ? { page: 1, limit: 100, petId: petId || undefined, date: selectedDate }
        : {
            page,
            limit: 10,
            petId: petId || undefined,
            status: (status as AppointmentStatus) || undefined,
          },
    [view, page, petId, status, selectedDate],
  )

  const { data, isLoading, isError, refetch } = useAppointments(listParams)
  const createAppointment = useCreateAppointment()
  const updateAppointment = useUpdateAppointment()
  const cancelAppointment = useCancelAppointment()
  const deleteAppointment = useDeleteAppointment()

  const monthAppointments = useMemo(() => {
    return data?.data ?? []
  }, [data?.data])

  if (isError) return <ErrorState onRetry={() => void refetch()} />

  return (
    <div>
      <PageHeader
        title="Turnos"
        description="Agenda clínica con vista calendario y tabla."
        actions={
          <>
            <div className="flex rounded-lg border border-border p-1">
              <Button
                size="sm"
                variant={view === 'calendar' ? 'secondary' : 'ghost'}
                leftIcon={<CalendarDaysIcon className="size-4" />}
                onClick={() => setView('calendar')}
              >
                Calendario
              </Button>
              <Button
                size="sm"
                variant={view === 'table' ? 'secondary' : 'ghost'}
                leftIcon={<TableCellsIcon className="size-4" />}
                onClick={() => setView('table')}
              >
                Tabla
              </Button>
            </div>
            <Can permission={Permission.APPOINTMENTS_WRITE}>
              <Button leftIcon={<PlusIcon className="size-4" />} onClick={createDialog.open}>
                Nuevo turno
              </Button>
            </Can>
          </>
        }
      />

      {view === 'calendar' ? (
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          {isLoading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <AppointmentsCalendar
              month={month}
              appointments={monthAppointments}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onMonthChange={(nextMonth) => {
                setMonth(nextMonth)
                setSelectedDate(`${nextMonth}-01`)
              }}
            />
          )}

          <div className="panel p-4">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-ink">Turnos del {formatDate(selectedDate)}</h3>
                <p className="text-sm text-ink-muted">Seleccioná un día en el calendario</p>
              </div>
              <Can permission={Permission.APPOINTMENTS_WRITE}>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedDate(selectedDate)
                    createDialog.open()
                  }}
                >
                  Agregar
                </Button>
              </Can>
            </div>
            <ul className="space-y-3">
              {monthAppointments
                .filter((item) => item.date.slice(0, 10) === selectedDate)
                .map((item) => (
                  <li key={item.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-ink">
                          {formatTime(item.time)} · {item.reason}
                        </p>
                        <Badge className="mt-2">{APPOINTMENT_STATUS_LABELS[item.status]}</Badge>
                      </div>
                      <AppointmentActions
                        appointment={item}
                        onEdit={() => {
                          setSelected(item)
                          editDialog.open()
                        }}
                        onCancel={() => {
                          setSelected(item)
                          cancelDialog.open()
                        }}
                        onDelete={() => {
                          setSelected(item)
                          deleteDialog.open()
                        }}
                      />
                    </div>
                  </li>
                ))}
              {monthAppointments.filter((item) => item.date.slice(0, 10) === selectedDate)
                .length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-muted">Sin turnos en este día</p>
              ) : null}
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 max-w-xs">
            <Select
              options={[
                { value: '', label: 'Todos los estados' },
                ...Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
              value={status}
              onChange={(event) => {
                setPage(1)
                setStatus(event.target.value)
              }}
            />
          </div>
          {isLoading ? (
            <TableSkeleton cols={5} />
          ) : (
            <>
              <Table
                data={data?.data ?? []}
                rowKey={(row) => row.id}
                columns={[
                  {
                    key: 'date',
                    header: 'Fecha',
                    render: (row) => `${formatDate(row.date)} ${formatTime(row.time)}`,
                  },
                  { key: 'reason', header: 'Motivo', render: (row) => row.reason },
                  {
                    key: 'status',
                    header: 'Estado',
                    render: (row) => <Badge>{APPOINTMENT_STATUS_LABELS[row.status]}</Badge>,
                  },
                  {
                    key: 'actions',
                    header: 'Acciones',
                    render: (row) => (
                      <AppointmentActions
                        appointment={row}
                        onEdit={() => {
                          setSelected(row)
                          editDialog.open()
                        }}
                        onCancel={() => {
                          setSelected(row)
                          cancelDialog.open()
                        }}
                        onDelete={() => {
                          setSelected(row)
                          deleteDialog.open()
                        }}
                      />
                    ),
                  },
                ]}
              />
              <Pagination
                className="mt-4"
                page={data?.meta.page ?? 1}
                totalPages={data?.meta.totalPages ?? 1}
                total={data?.meta.total ?? 0}
                limit={data?.meta.limit ?? 10}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <Modal
        open={createDialog.isOpen}
        onClose={createDialog.close}
        title="Nuevo turno"
        size="lg"
      >
        <AppointmentForm
          defaultPetId={petId || undefined}
          defaultDate={selectedDate}
          isSubmitting={createAppointment.isPending}
          submitLabel="Crear turno"
          onSubmit={(values: AppointmentFormValues) => {
            createAppointment.mutate(
              {
                date: values.date,
                time: values.time,
                reason: values.reason,
                petId: values.petId,
                veterinarianId: values.veterinarianId,
              },
              { onSuccess: () => createDialog.close() },
            )
          }}
        />
      </Modal>

      <Modal open={editDialog.isOpen} onClose={editDialog.close} title="Editar turno" size="lg">
        {selected ? (
          <AppointmentForm
            initialValues={selected}
            isSubmitting={updateAppointment.isPending}
            submitLabel="Guardar cambios"
            onSubmit={(values: AppointmentFormValues) => {
              updateAppointment.mutate(
                {
                  id: selected.id,
                  payload: {
                    date: values.date,
                    time: values.time,
                    reason: values.reason,
                    petId: values.petId,
                    veterinarianId: values.veterinarianId,
                    status: values.status,
                  },
                },
                { onSuccess: () => editDialog.close() },
              )
            }}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={cancelDialog.isOpen}
        onClose={cancelDialog.close}
        title="Cancelar turno"
        description="El turno pasará a estado cancelado."
        confirmLabel="Cancelar turno"
        tone="danger"
        isLoading={cancelAppointment.isPending}
        onConfirm={() => {
          if (!selected) return
          cancelAppointment.mutate(selected.id, {
            onSuccess: () => {
              cancelDialog.close()
              setSelected(null)
            },
          })
        }}
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        title="Eliminar turno"
        description="Esta acción elimina el turno del sistema."
        isLoading={deleteAppointment.isPending}
        onConfirm={() => {
          if (!selected) return
          deleteAppointment.mutate(selected.id, {
            onSuccess: () => {
              deleteDialog.close()
              setSelected(null)
            },
          })
        }}
      />
    </div>
  )
}

function AppointmentActions({
  appointment,
  onEdit,
  onCancel,
  onDelete,
}: {
  appointment: AppointmentDto
  onEdit: () => void
  onCancel: () => void
  onDelete: () => void
}) {
  const canCancel =
    appointment.status !== AppointmentStatus.CANCELLED &&
    appointment.status !== AppointmentStatus.COMPLETED

  return (
    <div className="flex items-center gap-1">
      <Can permission={Permission.APPOINTMENTS_WRITE}>
        <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Editar">
          <PencilSquareIcon className="size-4" />
        </Button>
        {canCancel ? (
          <Button variant="ghost" size="sm" onClick={onCancel} aria-label="Cancelar">
            <XMarkIcon className="size-4" />
          </Button>
        ) : null}
      </Can>
      <Can permission={Permission.APPOINTMENTS_DELETE}>
        <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Eliminar">
          <TrashIcon className="size-4 text-danger" />
        </Button>
      </Can>
    </div>
  )
}
