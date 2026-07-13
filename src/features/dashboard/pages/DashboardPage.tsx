import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { PageHeader } from '@/components/layout/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { StatCard } from '../components/StatCard'
import { DashboardCharts } from '../components/DashboardCharts'
import { useDashboardStats } from '../hooks/use-dashboard-stats'
import { useAuthStore } from '@/store/auth.store'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data, isLoading, isError, refetch } = useDashboardStats()

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Hola ${user?.firstName ?? ''}, este es el resumen del día.`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Clientes"
          value={data?.customersCount ?? 0}
          description="Total registrados"
          icon={<UsersIcon className="size-5" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Mascotas"
          value={data?.petsCount ?? 0}
          description="Pacientes activos"
          icon={<UserGroupIcon className="size-5" />}
          accent="bg-info-soft text-info"
          isLoading={isLoading}
        />
        <StatCard
          title="Turnos del día"
          value={data?.appointmentsTodayCount ?? 0}
          description="Agenda de hoy"
          icon={<CalendarDaysIcon className="size-5" />}
          accent="bg-warning-soft text-warning"
          isLoading={isLoading}
        />
        <StatCard
          title="Vacunas próximas"
          value={data?.upcomingVaccinesCount ?? 0}
          description="Próximos 30 días"
          icon={<ShieldCheckIcon className="size-5" />}
          accent="bg-success-soft text-success"
          isLoading={isLoading}
        />
        <StatCard
          title="Consultas"
          value={data?.medicalRecordsCount ?? 0}
          description="Historias clínicas"
          icon={<ClipboardDocumentListIcon className="size-5" />}
          accent="bg-surface-muted text-ink-secondary"
          isLoading={isLoading}
        />
      </div>

      <DashboardCharts stats={data} />
    </div>
  )
}
