import { Link, useNavigate, useParams } from 'react-router-dom'
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { Can } from '@/components/forms/Can'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Permission } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDisclosure } from '@/hooks/use-disclosure'
import { formatDate } from '@/lib/dayjs'
import { fullName } from '@/utils/format'
import { useCustomer, useDeleteCustomer } from '../hooks/use-customers'
import { usePets } from '@/features/pets/hooks/use-pets'
import { PET_SEX_LABELS } from '@/types/enums'

export function CustomerDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const confirm = useDisclosure()
  const { data, isLoading, isError, refetch } = useCustomer(id)
  const petsQuery = usePets({ customerId: id, limit: 50 })
  const removeCustomer = useDeleteCustomer()

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" label="Cargando cliente..." />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title={fullName(data.firstName, data.lastName)}
        description={`Documento ${data.document}`}
        actions={
          <>
            <Can permission={Permission.CUSTOMERS_WRITE}>
              <Button
                variant="outline"
                leftIcon={<PencilSquareIcon className="size-4" />}
                onClick={() => void navigate(ROUTES.customerEdit(data.id))}
              >
                Editar
              </Button>
            </Can>
            <Can permission={Permission.CUSTOMERS_DELETE}>
              <Button
                variant="danger"
                leftIcon={<TrashIcon className="size-4" />}
                onClick={confirm.open}
              >
                Eliminar
              </Button>
            </Can>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Información general</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <InfoRow label="Teléfono" value={data.phone} />
            <InfoRow label="Email" value={data.email ?? '—'} />
            <InfoRow label="Dirección" value={data.address ?? '—'} />
            <InfoRow label="Alta" value={formatDate(data.createdAt)} />
            <InfoRow label="Actualizado" value={formatDate(data.updatedAt)} />
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Mascotas</CardTitle>
            </div>
            <Can permission={Permission.PETS_WRITE}>
              <Button
                size="sm"
                leftIcon={<PlusIcon className="size-4" />}
                onClick={() =>
                  void navigate(`${ROUTES.petNew}?customerId=${data.id}`)
                }
              >
                Registrar mascota
              </Button>
            </Can>
          </CardHeader>
          <CardBody>
            {petsQuery.isLoading ? (
              <Loader label="Cargando mascotas..." />
            ) : (petsQuery.data?.data.length ?? 0) === 0 ? (
              <EmptyState
                title="Sin mascotas"
                description="Este cliente todavía no tiene mascotas registradas."
                action={
                  <Can permission={Permission.PETS_WRITE}>
                    <Button
                      size="sm"
                      onClick={() =>
                        void navigate(`${ROUTES.petNew}?customerId=${data.id}`)
                      }
                    >
                      Registrar mascota
                    </Button>
                  </Can>
                }
              />
            ) : (
              <Table
                data={petsQuery.data?.data ?? []}
                rowKey={(row) => row.id}
                onRowClick={(row) => void navigate(ROUTES.petDetail(row.id))}
                columns={[
                  {
                    key: 'name',
                    header: 'Nombre',
                    render: (row) => (
                      <Link
                        to={ROUTES.petDetail(row.id)}
                        className="font-medium text-brand hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {row.name}
                      </Link>
                    ),
                  },
                  { key: 'species', header: 'Especie', render: (row) => row.species },
                  {
                    key: 'sex',
                    header: 'Sexo',
                    render: (row) => <Badge>{PET_SEX_LABELS[row.sex]}</Badge>,
                  },
                  {
                    key: 'weight',
                    header: 'Peso',
                    render: (row) =>
                      row.currentWeight != null ? `${row.currentWeight} kg` : '—',
                  },
                ]}
              />
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Historial de actividad</CardTitle>
          </CardHeader>
          <CardBody>
            <ol className="space-y-4 border-l border-border pl-4">
              <li>
                <p className="text-sm font-medium text-ink">Cliente creado</p>
                <p className="text-xs text-ink-muted">{formatDate(data.createdAt, 'DD/MM/YYYY HH:mm')}</p>
              </li>
              <li>
                <p className="text-sm font-medium text-ink">Última actualización</p>
                <p className="text-xs text-ink-muted">{formatDate(data.updatedAt, 'DD/MM/YYYY HH:mm')}</p>
              </li>
              <li>
                <p className="text-sm font-medium text-ink">
                  Mascotas asociadas: {petsQuery.data?.meta.total ?? 0}
                </p>
                <p className="text-xs text-ink-muted">Según el registro actual del sistema</p>
              </li>
            </ol>
          </CardBody>
        </Card>
      </div>

      <ConfirmDialog
        open={confirm.isOpen}
        onClose={confirm.close}
        title="Eliminar cliente"
        description={`¿Eliminar a ${fullName(data.firstName, data.lastName)}? Esta acción no se puede deshacer.`}
        isLoading={removeCustomer.isPending}
        onConfirm={() => {
          removeCustomer.mutate(data.id, {
            onSuccess: () => {
              void navigate(ROUTES.customers)
            },
          })
        }}
      />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  )
}
