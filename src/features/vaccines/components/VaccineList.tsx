import { formatDate } from '@/lib/dayjs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Can } from '@/components/forms/Can'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { Permission } from '@/constants/permissions'
import { useDisclosure } from '@/hooks/use-disclosure'
import { dayjs } from '@/lib/dayjs'
import { useState } from 'react'
import { useDeleteVaccine, useVaccines } from '../hooks/use-vaccines'
import type { VaccineDto } from '../types/vaccine.types'
import { TrashIcon } from '@heroicons/react/24/outline'

interface VaccineListProps {
  petId: string
}

export function VaccineList({ petId }: VaccineListProps) {
  const { data, isLoading, isError, refetch } = useVaccines({ petId, limit: 50 })
  const removeVaccine = useDeleteVaccine()
  const confirm = useDisclosure()
  const [selected, setSelected] = useState<VaccineDto | null>(null)

  if (isLoading) return <Loader label="Cargando vacunas..." />
  if (isError) return <ErrorState onRetry={() => void refetch()} />
  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        title="Sin vacunas"
        description="Todavía no hay vacunas registradas para esta mascota."
      />
    )
  }

  return (
    <>
      <ul className="space-y-3">
        {data.data.map((vaccine) => {
          const upcoming =
            vaccine.nextApplicationAt &&
            dayjs(vaccine.nextApplicationAt).isAfter(dayjs().subtract(1, 'day'))
          return (
            <li
              key={vaccine.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{vaccine.name}</p>
                  {upcoming ? <Badge variant="warning">Próxima</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  Aplicada: {formatDate(vaccine.appliedAt)}
                </p>
                <p className="text-sm text-ink-muted">
                  Próxima: {formatDate(vaccine.nextApplicationAt)}
                </p>
              </div>
              <Can permission={Permission.VACCINES_DELETE}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelected(vaccine)
                    confirm.open()
                  }}
                >
                  <TrashIcon className="size-4 text-danger" />
                </Button>
              </Can>
            </li>
          )
        })}
      </ul>

      <ConfirmDialog
        open={confirm.isOpen}
        onClose={confirm.close}
        title="Eliminar vacuna"
        description={`¿Eliminar el registro de ${selected?.name ?? 'esta vacuna'}?`}
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
    </>
  )
}
