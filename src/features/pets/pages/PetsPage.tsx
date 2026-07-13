import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
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
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { PET_SEX_LABELS } from '@/types/enums'
import { useDeletePet, usePets } from '../hooks/use-pets'
import type { PetDto } from '../types/pet.types'

export function PetsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [customerId, setCustomerId] = useState('')
  const confirm = useDisclosure()
  const [selected, setSelected] = useState<PetDto | null>(null)
  const customersQuery = useCustomers({ page: 1, limit: 100 })

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      customerId: customerId || undefined,
    }),
    [page, customerId],
  )

  const { data, isLoading, isError, refetch } = usePets(params)
  const removePet = useDeletePet()

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Mascotas"
        description="Pacientes registrados en la clínica."
        actions={
          <Can permission={Permission.PETS_WRITE}>
            <Button
              leftIcon={<PlusIcon className="size-4" />}
              onClick={() => void navigate(ROUTES.petNew)}
            >
              Nueva mascota
            </Button>
          </Can>
        }
      />

      <div className="mb-4 max-w-sm">
        <Select
          options={[
            { value: '', label: 'Todos los clientes' },
            ...(customersQuery.data?.data.map((customer) => ({
              value: customer.id,
              label: `${customer.firstName} ${customer.lastName}`,
            })) ?? []),
          ]}
          value={customerId}
          onChange={(event) => {
            setPage(1)
            setCustomerId(event.target.value)
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
            onRowClick={(row) => void navigate(ROUTES.petDetail(row.id))}
            columns={[
              {
                key: 'name',
                header: 'Nombre',
                render: (row) => <span className="font-medium text-ink">{row.name}</span>,
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
              {
                key: 'actions',
                header: 'Acciones',
                render: (row) => (
                  <div className="flex gap-1" onClick={(event) => event.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void navigate(ROUTES.petDetail(row.id))}
                    >
                      <EyeIcon className="size-4" />
                    </Button>
                    <Can permission={Permission.PETS_WRITE}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void navigate(ROUTES.petEdit(row.id))}
                      >
                        <PencilSquareIcon className="size-4" />
                      </Button>
                    </Can>
                    <Can permission={Permission.PETS_DELETE}>
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
                  </div>
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

      <ConfirmDialog
        open={confirm.isOpen}
        onClose={confirm.close}
        title="Eliminar mascota"
        description={`¿Eliminar a ${selected?.name ?? 'esta mascota'}?`}
        isLoading={removePet.isPending}
        onConfirm={() => {
          if (!selected) return
          removePet.mutate(selected.id, {
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
