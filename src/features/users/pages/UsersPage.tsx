import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { TableSkeleton } from '@/components/feedback/Skeleton'
import { ROUTES } from '@/constants/routes'
import { useDisclosure } from '@/hooks/use-disclosure'
import { ROLE_LABELS } from '@/types/enums'
import { fullName } from '@/utils/format'
import { useDeleteUser, useUsers } from '../hooks/use-users'
import type { UserDto } from '../types/user.types'

export function UsersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const confirm = useDisclosure()
  const [selected, setSelected] = useState<UserDto | null>(null)
  const { data, isLoading, isError, refetch } = useUsers({ page, limit: 10 })
  const removeUser = useDeleteUser()

  if (isError) return <ErrorState onRetry={() => void refetch()} />

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Administración del personal de la veterinaria."
        actions={
          <Button
            leftIcon={<PlusIcon className="size-4" />}
            onClick={() => void navigate(ROUTES.userNew)}
          >
            Nuevo usuario
          </Button>
        }
      />

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
                header: 'Nombre',
                render: (row) => (
                  <span className="font-medium text-ink">
                    {fullName(row.firstName, row.lastName)}
                  </span>
                ),
              },
              { key: 'email', header: 'Email', render: (row) => row.email },
              {
                key: 'role',
                header: 'Rol',
                render: (row) => <Badge variant="brand">{ROLE_LABELS[row.role]}</Badge>,
              },
              {
                key: 'status',
                header: 'Estado',
                render: (row) => (
                  <Badge variant={row.isActive ? 'success' : 'neutral'}>
                    {row.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: 'Acciones',
                render: (row) => (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void navigate(ROUTES.userEdit(row.id))}
                    >
                      <PencilSquareIcon className="size-4" />
                    </Button>
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
        title="Eliminar usuario"
        description={`¿Eliminar a ${selected ? fullName(selected.firstName, selected.lastName) : 'este usuario'}?`}
        isLoading={removeUser.isPending}
        onConfirm={() => {
          if (!selected) return
          removeUser.mutate(selected.id, {
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
