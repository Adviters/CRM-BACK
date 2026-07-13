import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'
import { AuthGuard } from '@/router/guards/AuthGuard'
import { GuestGuard } from '@/router/guards/GuestGuard'
import { RoleGuard } from '@/router/guards/RoleGuard'
import { useAuthStore } from '@/store/auth.store'
import { Permission } from '@/constants/permissions'
import { Role } from '@/types/enums'
import { Table } from '@/components/ui/Table'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { HomeIcon } from '@heroicons/react/24/outline'

function renderWithRouter(ui: ReactNode, initial = '/') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>{ui}</Routes>
    </MemoryRouter>,
  )
}

describe('route guards', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      rememberMe: true,
    })
  })

  it('AuthGuard redirige a login sin token', () => {
    renderWithRouter(
      <>
        <Route element={<AuthGuard />}>
          <Route path="/" element={<div>Privado</div>} />
        </Route>
        <Route path="/login" element={<div>Login</div>} />
      </>,
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('GuestGuard redirige al dashboard con sesión', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'r',
      rememberMe: true,
      user: {
        id: '1',
        email: 'a@b.com',
        firstName: 'A',
        lastName: 'B',
        role: Role.ADMIN,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      },
    })
    renderWithRouter(
      <>
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<div>Login</div>} />
        </Route>
        <Route path="/" element={<div>Dashboard</div>} />
      </>,
      '/login',
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('RoleGuard bloquea sin permiso', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'r',
      rememberMe: true,
      user: {
        id: '1',
        email: 'r@b.com',
        firstName: 'R',
        lastName: 'E',
        role: Role.RECEPTIONIST,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      },
    })
    renderWithRouter(
      <>
        <Route element={<RoleGuard permission={Permission.USERS_MANAGE} />}>
          <Route path="/" element={<div>Usuarios</div>} />
        </Route>
        <Route path="/403" element={<div>Forbidden</div>} />
      </>,
    )
    expect(screen.getByText('Forbidden')).toBeInTheDocument()
  })
})

describe('shared components coverage', () => {
  it('Table, Select, PageHeader, Card y StatCard', () => {
    render(
      <>
        <PageHeader title="Título" description="Desc" actions={<button type="button">Acción</button>} />
        <Card>
          <CardTitle>Card</CardTitle>
          <CardBody>Body</CardBody>
        </Card>
        <Select
          aria-label="estado"
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]}
          placeholder="Elegir"
        />
        <Table
          data={[{ id: '1', name: 'Ana' }]}
          rowKey={(row) => row.id}
          columns={[{ key: 'name', header: 'Nombre', render: (row) => row.name }]}
        />
        <StatCard
          title="Clientes"
          value={10}
          description="Total"
          icon={<HomeIcon className="size-4" />}
        />
      </>,
    )
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Clientes')).toBeInTheDocument()
  })
})
