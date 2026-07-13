import { render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'
import { Can } from '@/components/forms/Can'
import { useAuthStore } from '@/store/auth.store'
import { Permission } from '@/constants/permissions'
import { Role } from '@/types/enums'

describe('Can', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 't',
      refreshToken: 'r',
      rememberMe: true,
      user: {
        id: '1',
        email: 'vet@test.com',
        firstName: 'Vet',
        lastName: 'User',
        role: Role.VETERINARIAN,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    })
  })

  it('renderiza children cuando hay permiso', () => {
    render(
      <Can permission={Permission.MEDICAL_RECORDS_WRITE}>
        <button type="button">Nueva consulta</button>
      </Can>,
    )
    expect(screen.getByText('Nueva consulta')).toBeInTheDocument()
  })

  it('usa fallback cuando no hay permiso', () => {
    render(
      <Can permission={Permission.USERS_MANAGE} fallback={<span>Sin acceso</span>}>
        <button type="button">Usuarios</button>
      </Can>,
    )
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument()
    expect(screen.getByText('Sin acceso')).toBeInTheDocument()
  })
})
