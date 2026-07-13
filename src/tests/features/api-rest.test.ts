import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/services/api/axios-instance', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import { api } from '@/services/api/axios-instance'
import { appointmentsApi } from '@/features/appointments/api/appointments.api'
import { vaccinesApi } from '@/features/vaccines/api/vaccines.api'
import { medicalRecordsApi } from '@/features/medical-records/api/medical-records.api'
import { usersApi } from '@/features/users/api/users.api'

describe('remaining api modules', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
    vi.mocked(api.patch).mockReset()
    vi.mocked(api.delete).mockReset()
  })

  it('appointmentsApi', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [], meta: {} } })
    vi.mocked(api.post).mockResolvedValue({ data: { id: '1' } })
    vi.mocked(api.patch).mockResolvedValue({ data: { id: '1' } })
    vi.mocked(api.delete).mockResolvedValue({})

    await appointmentsApi.list({ page: 1 })
    await appointmentsApi.create({
      date: '2024-01-01',
      time: '10:00',
      reason: 'x',
      petId: '550e8400-e29b-41d4-a716-446655440000',
      veterinarianId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    })
    await appointmentsApi.update('1', { reason: 'y' })
    await appointmentsApi.cancel('1')
    await appointmentsApi.remove('1')
    expect(api.post).toHaveBeenCalled()
  })

  it('vaccinesApi y medicalRecordsApi', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [], meta: {} } })
    vi.mocked(api.post).mockResolvedValue({ data: { id: '1' } })
    vi.mocked(api.delete).mockResolvedValue({})

    await vaccinesApi.list({ page: 1 })
    await vaccinesApi.create({
      name: 'Rabia',
      appliedAt: '2024-01-01T00:00:00.000Z',
      petId: '550e8400-e29b-41d4-a716-446655440000',
    })
    await vaccinesApi.remove('1')

    await medicalRecordsApi.list({ petId: '550e8400-e29b-41d4-a716-446655440000' })
    await medicalRecordsApi.create({
      petId: '550e8400-e29b-41d4-a716-446655440000',
      reason: 'x',
      diagnosis: 'y',
      treatment: 'z',
    })
    expect(api.get).toHaveBeenCalled()
  })

  it('usersApi', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [], meta: {} } })
    vi.mocked(api.post).mockResolvedValue({ data: { id: '1' } })
    vi.mocked(api.patch).mockResolvedValue({ data: { id: '1' } })
    vi.mocked(api.delete).mockResolvedValue({})

    await usersApi.list({ page: 1 })
    await usersApi.create({
      email: 'a@b.com',
      password: 'Password1',
      firstName: 'A',
      lastName: 'B',
      role: 'ADMIN',
    })
    await usersApi.update('1', { isActive: false })
    await usersApi.remove('1')
    expect(api.delete).toHaveBeenCalledWith('/users/1')
  })
})
