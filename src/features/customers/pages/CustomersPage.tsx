import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Can } from '@/components/forms/Can'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { TableSkeleton } from '@/components/feedback/Skeleton'
import { Permission } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/use-debounce'
import { useDisclosure } from '@/hooks/use-disclosure'
import { formatDate } from '@/lib/dayjs'
import { fullName } from '@/utils/format'
import { useCustomers, useDeleteCustomer } from '../hooks/use-customers'
import type { CustomerDto } from '../types/customer.types'

export function CustomersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const confirm = useDisclosure()
  const [selected, setSelected] = useState<CustomerDto | null>(null)

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
    }),
    [page, debouncedSearch],
  )

  const { data, isLoading, isError, refetch } = useCustomers(params)
  const removeCustomer = useDeleteCustomer()

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestioná tutores y su información de contacto."
        actions={
          <Can permission={Permission.CUSTOMERS_WRITE}>
            <Button
              leftIcon={<PlusIcon className="size-4" />}
              onClick={() => void navigate(ROUTES.customerNew)}
            >
              Nuevo cliente
            </Button>
          </Can>
        }
      />

      <div className="mb-4">
        <SearchInput
          containerClassName="w-full max-w-sm"
          placeholder="Buscar por nombre, documento o email..."
          value={search}
          onChange={(event) => {
            setPage(1)
            setSearch(event.target.value)
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
            onRowClick={(row) => void navigate(ROUTES.customerDetail(row.id))}
            columns={[
              {
                key: 'name',
                header: 'Nombre',
                render: (row) => (
                  <span className="font-medium text-ink">{fullName(row.firstName, row.lastName)}</span>
                ),
              },
              { key: 'document', header: 'Documento', render: (row) => row.document },
              { key: 'phone', header: 'Teléfono', render: (row) => row.phone },
              {
                key: 'updatedAt',
                header: 'Última actualización',
                render: (row) => formatDate(row.updatedAt),
              },
              {
                key: 'actions',
                header: 'Acciones',
                className: 'w-40',
                render: (row) => (
                  <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Ver"
                      onClick={() => void navigate(ROUTES.customerDetail(row.id))}
                    >
                      <EyeIcon className="size-4" />
                    </Button>
                    <Can permission={Permission.CUSTOMERS_WRITE}>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar"
                        onClick={() => void navigate(ROUTES.customerEdit(row.id))}
                      >
                        <PencilSquareIcon className="size-4" />
                      </Button>
                    </Can>
                    <Can permission={Permission.CUSTOMERS_DELETE}>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar"
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
        title="Eliminar cliente"
        description={`¿Seguro que querés eliminar a ${selected ? fullName(selected.firstName, selected.lastName) : 'este cliente'}?`}
        isLoading={removeCustomer.isPending}
        onConfirm={() => {
          if (!selected) return
          removeCustomer.mutate(selected.id, {
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
