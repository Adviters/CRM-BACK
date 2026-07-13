import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime, formatTime, todayIsoDate } from '@/lib/dayjs'

describe('dayjs helpers', () => {
  it('formatea fechas válidas e inválidas', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate('2024-05-10')).toBe('10/05/2024')
    expect(formatDate('no-date')).toBe('—')
  })

  it('formatea datetime y time', () => {
    expect(formatDateTime('2024-05-10T15:30:00')).toContain('10/05/2024')
    expect(formatTime('15:30:00')).toBe('15:30')
    expect(formatTime(null)).toBe('—')
    expect(formatTime('bad')).toBe('bad')
  })

  it('devuelve hoy en ISO date', () => {
    expect(todayIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
