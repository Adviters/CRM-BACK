import { describe, expect, it, vi, beforeEach } from 'vitest'
import { queryKeys } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { ROLE_LABELS, Role, APPOINTMENT_STATUS_LABELS, AppointmentStatus } from '@/types/enums'

vi.mock('@/services/api/axios-instance', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import { api } from '@/services/api/axios-instance'
import { authApi } from '@/features/auth/api/auth.api'
import { customersApi } from '@/features/customers/api/customers.api'
import { dashboardApi } from '@/features/dashboard/api/dashboard.api'
import { petsApi } from '@/features/pets/api/pets.api'

describe('constants and enums', () => {
  it('expone query keys y routes', () => {
    expect(queryKeys.customers.detail('1')).toEqual(['customers', 'detail', '1'])
    expect(ROUTES.customerDetail('abc')).toBe('/customers/abc')
    expect(ROLE_LABELS[Role.ADMIN]).toContain('Administrador')
    expect(APPOINTMENT_STATUS_LABELS[AppointmentStatus.PENDING]).toBe('Pendiente')
  })
})

describe('api modules', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
    vi.mocked(api.patch).mockReset()
    vi.mocked(api.delete).mockReset()
  })

  it('authApi.login', async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { accessToken: 'a', refreshToken: 'r', user: { id: '1' } },
    })
    const result = await authApi.login({ email: 'a@b.com', password: 'x' })
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'a@b.com',
      password: 'x',
    })
    expect(result.accessToken).toBe('a')
  })

  it('customersApi.list y getById', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    })
    await customersApi.list({ page: 1 })
    expect(api.get).toHaveBeenCalledWith('/customers', { params: { page: 1 } })

    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: '1' } })
    await customersApi.getById('1')
    expect(api.get).toHaveBeenCalledWith('/customers/1')
  })

  it('dashboardApi.getStats y petsApi.create', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        customersCount: 1,
        petsCount: 2,
        appointmentsTodayCount: 3,
        upcomingVaccinesCount: 4,
        medicalRecordsCount: 5,
      },
    })
    const stats = await dashboardApi.getStats()
    expect(stats.petsCount).toBe(2)

    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 'p1', name: 'Firu' } })
    await petsApi.create({
      name: 'Firu',
      species: 'Perro',
      customerId: '550e8400-e29b-41d4-a716-446655440000',
    })
    expect(api.post).toHaveBeenCalled()
  })
})
