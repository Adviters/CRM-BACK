import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Badge } from '@/components/ui/Badge'
import { Can } from '@/components/forms/Can'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { TableSkeleton } from '@/components/feedback/Skeleton'
import { Permission } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDisclosure } from '@/hooks/use-disclosure'
import { formatDate } from '@/lib/dayjs'
import { dayjs } from '@/lib/dayjs'
import { usePets } from '@/features/pets/hooks/use-pets'
import { CreateVaccineDialog } from '../components/CreateVaccineDialog'
import { useDeleteVaccine, useVaccines } from '../hooks/use-vaccines'
import type { VaccineDto } from '../types/vaccine.types'

export function VaccinesPage() {
  const [page, setPage] = useState(1)
  const [petId, setPetId] = useState('')
  const createDialog = useDisclosure()
  const confirm = useDisclosure()
  const [selected, setSelected] = useState<VaccineDto | null>(null)
  const petsQuery = usePets({ page: 1, limit: 100 })

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      petId: petId || undefined,
    }),
    [page, petId],
  )

  const { data, isLoading, isError, refetch } = useVaccines(params)
  const removeVaccine = useDeleteVaccine()

  const petsById = useMemo(() => {
    const map = new Map<string, string>()
    petsQuery.data?.data.forEach((pet) => {
      map.set(pet.id, pet.name)
    })
    return map
  }, [petsQuery.data?.data])

  if (isError) return <ErrorState onRetry={() => void refetch()} />

  return (
    <div>
      <PageHeader
        title="Vacunas"
        description="Control de aplicaciones y próximas dosis."
        actions={
          <Can permission={Permission.VACCINES_WRITE}>
            <Button leftIcon={<PlusIcon className="size-4" />} onClick={createDialog.open}>
              Registrar vacuna
            </Button>
          </Can>
        }
      />

      <div className="mb-4 max-w-sm">
        <Select
          options={[
            { value: '', label: 'Todas las mascotas' },
            ...(petsQuery.data?.data.map((pet) => ({
              value: pet.id,
              label: `${pet.name} · ${pet.species}`,
            })) ?? []),
          ]}
          value={petId}
          onChange={(event) => {
            setPage(1)
            setPetId(event.target.value)
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
                key: 'name',
                header: 'Vacuna',
                render: (row) => <span className="font-medium text-ink">{row.name}</span>,
              },
              {
                key: 'pet',
                header: 'Mascota',
                render: (row) => (
                  <Link to={ROUTES.petDetail(row.petId)} className="text-brand hover:underline">
                    {petsById.get(row.petId) ?? 'Ver mascota'}
                  </Link>
                ),
              },
              {
                key: 'appliedAt',
                header: 'Aplicada',
                render: (row) => formatDate(row.appliedAt),
              },
              {
                key: 'next',
                header: 'Próxima',
                render: (row) => {
                  const upcoming =
                    row.nextApplicationAt &&
                    dayjs(row.nextApplicationAt).isAfter(dayjs().subtract(1, 'day'))
                  return (
                    <span className="inline-flex items-center gap-2">
                      {formatDate(row.nextApplicationAt)}
                      {upcoming ? <Badge variant="warning">Próxima</Badge> : null}
                    </span>
                  )
                },
              },
              {
                key: 'actions',
                header: '',
                render: (row) => (
                  <Can permission={Permission.VACCINES_DELETE}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelected(row)
                        confirm.open()
                      }}
                    >
                      <TrashIcon className="size-4 text-danger" />
                    </Button>
                  </Can>
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

      <CreateVaccineDialog
        open={createDialog.isOpen}
        onClose={createDialog.close}
        petId={petId || undefined}
      />

      <ConfirmDialog
        open={confirm.isOpen}
        onClose={confirm.close}
        title="Eliminar vacuna"
        description={`¿Eliminar ${selected?.name ?? 'esta vacuna'}?`}
        isLoading={removeVaccine.isPending}
        onConfirm={() => {
          if (!selected) return
          removeVaccine.mutate(selected.id, {
            onSuccess: () => {
              confirm.close()
              setSelected(null)
            },
          })
        }}
      />
    </div>
  )
}
