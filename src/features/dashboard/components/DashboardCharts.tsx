import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardStatsDto } from '../types/dashboard.types'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface DashboardChartsProps {
  stats?: DashboardStatsDto
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const overview = [
    { name: 'Clientes', value: stats?.customersCount ?? 0 },
    { name: 'Mascotas', value: stats?.petsCount ?? 0 },
    { name: 'Turnos hoy', value: stats?.appointmentsTodayCount ?? 0 },
    { name: 'Vacunas', value: stats?.upcomingVaccinesCount ?? 0 },
    { name: 'Consultas', value: stats?.medicalRecordsCount ?? 0 },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Resumen operativo</CardTitle>
            <CardDescription>
              Distribución actual de la actividad clínica
            </CardDescription>
          </div>
        </CardHeader>
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overview}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-surface-muted)' }}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="value" fill="var(--color-brand)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Indicadores clave</CardTitle>
            <CardDescription>
              Preparado para series temporales del backend
            </CardDescription>
          </div>
        </CardHeader>
        <CardBody>
          <ul className="space-y-3">
            {overview.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-surface-muted/70 px-4 py-3"
              >
                <span className="text-sm text-ink-secondary">{item.name}</span>
                <span className="text-sm font-semibold text-ink">{item.value}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  )
}
