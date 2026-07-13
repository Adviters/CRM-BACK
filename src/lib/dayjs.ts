import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/es'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale('es')

export { dayjs }

export function formatDate(value?: string | null, pattern = 'DD/MM/YYYY'): string {
  if (!value) return '—'
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format(pattern) : '—'
}

export function formatDateTime(value?: string | null): string {
  return formatDate(value, 'DD/MM/YYYY HH:mm')
}

export function formatTime(value?: string | null): string {
  if (!value) return '—'
  const parsed = dayjs(value, ['HH:mm:ss', 'HH:mm'], true)
  return parsed.isValid() ? parsed.format('HH:mm') : value.slice(0, 5)
}

export function todayIsoDate(): string {
  return dayjs().format('YYYY-MM-DD')
}
