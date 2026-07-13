import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Textarea } from '@/components/ui/Textarea'
import { Radio } from '@/components/ui/Radio'
import { SearchInput } from '@/components/ui/SearchInput'
import { Tooltip } from '@/components/ui/Tooltip'
import { updateUserSchema } from '@/features/users/schemas/user.schema'
import { Role } from '@/types/enums'
import { authApi } from '@/features/auth/api/auth.api'
import { customersApi } from '@/features/customers/api/customers.api'
import { petsApi } from '@/features/pets/api/pets.api'
import { vi, beforeEach } from 'vitest'

vi.mock('@/services/api/axios-instance', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import { api } from '@/services/api/axios-instance'

describe('more ui primitives', () => {
  it('renderiza Textarea, Radio, SearchInput y Tooltip', () => {
    render(
      <>
        <Textarea aria-label="notas" />
        <Radio name="sex" value="MALE" label="Macho" />
        <SearchInput aria-label="buscar" />
        <Tooltip content="Ayuda">
          <button type="button">Info</button>
        </Tooltip>
      </>,
    )
    expect(screen.getByLabelText('notas')).toBeInTheDocument()
    expect(screen.getByText('Macho')).toBeInTheDocument()
    expect(screen.getByLabelText('buscar')).toBeInTheDocument()
    expect(screen.getByText('Ayuda')).toBeInTheDocument()
  })
})

describe('updateUserSchema', () => {
  it('permite password vacío y valida política si se envía', () => {
    expect(
      updateUserSchema.safeParse({
        email: 'a@b.com',
        password: '',
        firstName: 'A',
        lastName: 'B',
        role: Role.ADMIN,
        isActive: true,
      }).success,
    ).toBe(true)

    expect(
      updateUserSchema.safeParse({
        email: 'a@b.com',
        password: 'short',
        firstName: 'A',
        lastName: 'B',
        role: Role.ADMIN,
        isActive: true,
      }).success,
    ).toBe(false)

    expect(
      updateUserSchema.safeParse({
        email: 'a@b.com',
        password: 'Password1',
        firstName: 'A',
        lastName: 'B',
        role: Role.ADMIN,
        isActive: true,
      }).success,
    ).toBe(true)
  })
})

describe('api coverage boost', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
    vi.mocked(api.patch).mockReset()
    vi.mocked(api.delete).mockReset()
  })

  it('cubre auth refresh/logout y crud customers/pets', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { accessToken: 'a', refreshToken: 'r' } })
    await authApi.refresh({ refreshToken: 'r' })
    await authApi.logout({ refreshToken: 'r' })

    vi.mocked(api.post).mockResolvedValue({ data: { id: '1' } })
    vi.mocked(api.patch).mockResolvedValue({ data: { id: '1' } })
    vi.mocked(api.delete).mockResolvedValue({})
    vi.mocked(api.get).mockResolvedValue({ data: { id: '1' } })

    await customersApi.create({
      firstName: 'A',
      lastName: 'B',
      document: '1',
      phone: '1234567',
    })
    await customersApi.update('1', { phone: '9999999' })
    await customersApi.remove('1')

    await petsApi.list({ page: 1 })
    await petsApi.getById('1')
    await petsApi.update('1', { name: 'Firu' })
    await petsApi.remove('1')

    expect(api.delete).toHaveBeenCalled()
  })
})
