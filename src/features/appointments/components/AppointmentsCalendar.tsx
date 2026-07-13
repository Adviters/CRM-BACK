import { dayjs } from '@/lib/dayjs'
import { cn } from '@/lib/cn'
import type { AppointmentDto } from '../types/appointment.types'
import { APPOINTMENT_STATUS_LABELS } from '@/types/enums'
import { formatTime } from '@/lib/dayjs'

interface AppointmentsCalendarProps {
  month: string
  appointments: AppointmentDto[]
  selectedDate?: string
  onSelectDate: (date: string) => void
  onMonthChange: (month: string) => void
}

export function AppointmentsCalendar({
  month,
  appointments,
  selectedDate,
  onSelectDate,
  onMonthChange,
}: AppointmentsCalendarProps) {
  const current = dayjs(`${month}-01`)
  const start = current.startOf('month')
  const end = current.endOf('month')
  const startWeekday = start.day()
  const daysInMonth = end.date()

  const cells: Array<{ date: string | null; label: number | null }> = []
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ date: null, label: null })
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = current.date(day).format('YYYY-MM-DD')
    cells.push({ date, label: day })
  }

  const byDate = appointments.reduce<Record<string, AppointmentDto[]>>((acc, item) => {
    const key = item.date.slice(0, 10)
    acc[key] = [...(acc[key] ?? []), item]
    return acc
  }, {})

  return (
    <div className="panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-lg px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-muted"
          onClick={() => onMonthChange(current.subtract(1, 'month').format('YYYY-MM'))}
        >
          Anterior
        </button>
        <h3 className="font-display text-lg font-semibold capitalize text-ink">
          {current.format('MMMM YYYY')}
        </h3>
        <button
          type="button"
          className="rounded-lg px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-muted"
          onClick={() => onMonthChange(current.add(1, 'month').format('YYYY-MM'))}
        >
          Siguiente
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell.date) {
            return <div key={`empty-${index}`} className="min-h-20 rounded-lg bg-transparent" />
          }
          const items = byDate[cell.date] ?? []
          const isSelected = selectedDate === cell.date
          const isToday = cell.date === dayjs().format('YYYY-MM-DD')

          return (
            <button
              key={cell.date}
              type="button"
              onClick={() => onSelectDate(cell.date!)}
              className={cn(
                'min-h-20 rounded-lg border p-2 text-left transition-colors',
                isSelected
                  ? 'border-brand bg-brand-soft'
                  : 'border-border bg-surface hover:bg-surface-muted',
                isToday && !isSelected && 'ring-1 ring-brand-ring/40',
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{cell.label}</span>
                {items.length > 0 ? (
                  <span className="rounded-md bg-brand px-1.5 text-[10px] font-semibold text-white">
                    {items.length}
                  </span>
                ) : null}
              </div>
              <div className="space-y-1">
                {items.slice(0, 2).map((item) => (
                  <p key={item.id} className="truncate text-[11px] text-ink-muted">
                    {formatTime(item.time)} · {APPOINTMENT_STATUS_LABELS[item.status]}
                  </p>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
