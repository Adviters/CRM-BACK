import { formatDate } from '@/lib/dayjs'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { usePermissions } from '@/hooks/use-permissions'
import { Permission } from '@/constants/permissions'
import { useMedicalRecords } from '../hooks/use-medical-records'

interface MedicalRecordTimelineProps {
  petId: string
}

export function MedicalRecordTimeline({ petId }: MedicalRecordTimelineProps) {
  const { can } = usePermissions()
  const canRead = can(Permission.MEDICAL_RECORDS_READ)
  const { data, isLoading, isError, refetch } = useMedicalRecords(
    {
      petId,
      page: 1,
      limit: 50,
    },
    { enabled: canRead },
  )

  if (!canRead) {
    return (
      <EmptyState
        title="Sin acceso a historia clínica"
        description="Tu rol no permite consultar registros médicos."
      />
    )
  }

  if (isLoading) return <Loader label="Cargando historia clínica..." />
  if (isError) return <ErrorState onRetry={() => void refetch()} />
  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        title="Sin consultas"
        description="Todavía no hay registros clínicos para esta mascota."
      />
    )
  }

  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {data.data.map((record) => (
        <li key={record.id} className="relative">
          <span className="absolute top-1.5 -left-[1.9rem] size-3 rounded-full border-2 border-surface bg-brand" />
          <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{record.reason}</p>
              <p className="text-xs text-ink-muted">{formatDate(record.date, 'DD/MM/YYYY')}</p>
            </div>
            <dl className="grid gap-2 text-sm md:grid-cols-2">
              <div>
                <dt className="text-ink-muted">Diagnóstico</dt>
                <dd className="text-ink">{record.diagnosis}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Tratamiento</dt>
                <dd className="text-ink">{record.treatment}</dd>
              </div>
              {record.weight != null ? (
                <div>
                  <dt className="text-ink-muted">Peso</dt>
                  <dd className="text-ink">{record.weight} kg</dd>
                </div>
              ) : null}
              {record.observations ? (
                <div className="md:col-span-2">
                  <dt className="text-ink-muted">Observaciones</dt>
                  <dd className="text-ink">{record.observations}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </li>
      ))}
    </ol>
  )
}
