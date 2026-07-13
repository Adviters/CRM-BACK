import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/router/guards/AuthGuard'
import { GuestGuard } from '@/router/guards/GuestGuard'
import { RoleGuard } from '@/router/guards/RoleGuard'
import { Permission } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { Loader } from '@/components/feedback/Loader'
import { ForbiddenPage } from '@/app/pages/ForbiddenPage'
import { NotFoundPage } from '@/app/pages/NotFoundPage'

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)
const CustomersPage = lazy(() =>
  import('@/features/customers/pages/CustomersPage').then((module) => ({
    default: module.CustomersPage,
  })),
)
const CustomerCreatePage = lazy(() =>
  import('@/features/customers/pages/CustomerCreatePage').then((module) => ({
    default: module.CustomerCreatePage,
  })),
)
const CustomerEditPage = lazy(() =>
  import('@/features/customers/pages/CustomerEditPage').then((module) => ({
    default: module.CustomerEditPage,
  })),
)
const CustomerDetailPage = lazy(() =>
  import('@/features/customers/pages/CustomerDetailPage').then((module) => ({
    default: module.CustomerDetailPage,
  })),
)
const PetsPage = lazy(() =>
  import('@/features/pets/pages/PetsPage').then((module) => ({ default: module.PetsPage })),
)
const PetCreatePage = lazy(() =>
  import('@/features/pets/pages/PetCreatePage').then((module) => ({
    default: module.PetCreatePage,
  })),
)
const PetEditPage = lazy(() =>
  import('@/features/pets/pages/PetEditPage').then((module) => ({ default: module.PetEditPage })),
)
const PetDetailPage = lazy(() =>
  import('@/features/pets/pages/PetDetailPage').then((module) => ({
    default: module.PetDetailPage,
  })),
)
const AppointmentsPage = lazy(() =>
  import('@/features/appointments/pages/AppointmentsPage').then((module) => ({
    default: module.AppointmentsPage,
  })),
)
const VaccinesPage = lazy(() =>
  import('@/features/vaccines/pages/VaccinesPage').then((module) => ({
    default: module.VaccinesPage,
  })),
)
const UsersPage = lazy(() =>
  import('@/features/users/pages/UsersPage').then((module) => ({ default: module.UsersPage })),
)
const UserCreatePage = lazy(() =>
  import('@/features/users/pages/UserCreatePage').then((module) => ({
    default: module.UserCreatePage,
  })),
)
const UserEditPage = lazy(() =>
  import('@/features/users/pages/UserEditPage').then((module) => ({
    default: module.UserEditPage,
  })),
)

function Lazy({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader size="lg" label="Cargando..." />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        path: ROUTES.login,
        element: (
          <Lazy>
            <LoginPage />
          </Lazy>
        ),
        handle: { breadcrumb: 'Login' },
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: ROUTES.dashboard,
            element: (
              <Lazy>
                <DashboardPage />
              </Lazy>
            ),
            handle: { breadcrumb: 'Dashboard' },
          },
          {
            element: <RoleGuard permission={Permission.CUSTOMERS_READ} />,
            handle: { breadcrumb: 'Clientes' },
            children: [
              {
                path: ROUTES.customers,
                element: (
                  <Lazy>
                    <CustomersPage />
                  </Lazy>
                ),
              },
              {
                element: <RoleGuard permission={Permission.CUSTOMERS_WRITE} />,
                children: [
                  {
                    path: ROUTES.customerNew,
                    element: (
                      <Lazy>
                        <CustomerCreatePage />
                      </Lazy>
                    ),
                    handle: { breadcrumb: 'Nuevo' },
                  },
                  {
                    path: '/customers/:id/edit',
                    element: (
                      <Lazy>
                        <CustomerEditPage />
                      </Lazy>
                    ),
                    handle: { breadcrumb: 'Editar' },
                  },
                ],
              },
              {
                path: '/customers/:id',
                element: (
                  <Lazy>
                    <CustomerDetailPage />
                  </Lazy>
                ),
                handle: { breadcrumb: 'Detalle' },
              },
            ],
          },
          {
            element: <RoleGuard permission={Permission.PETS_READ} />,
            handle: { breadcrumb: 'Mascotas' },
            children: [
              {
                path: ROUTES.pets,
                element: (
                  <Lazy>
                    <PetsPage />
                  </Lazy>
                ),
              },
              {
                element: <RoleGuard permission={Permission.PETS_WRITE} />,
                children: [
                  {
                    path: ROUTES.petNew,
                    element: (
                      <Lazy>
                        <PetCreatePage />
                      </Lazy>
                    ),
                    handle: { breadcrumb: 'Nueva' },
                  },
                  {
                    path: '/pets/:id/edit',
                    element: (
                      <Lazy>
                        <PetEditPage />
                      </Lazy>
                    ),
                    handle: { breadcrumb: 'Editar' },
                  },
                ],
              },
              {
                path: '/pets/:id',
                element: (
                  <Lazy>
                    <PetDetailPage />
                  </Lazy>
                ),
                handle: { breadcrumb: 'Detalle' },
              },
            ],
          },
          {
            element: <RoleGuard permission={Permission.APPOINTMENTS_READ} />,
            children: [
              {
                path: ROUTES.appointments,
                element: (
                  <Lazy>
                    <AppointmentsPage />
                  </Lazy>
                ),
                handle: { breadcrumb: 'Turnos' },
              },
            ],
          },
          {
            element: <RoleGuard permission={Permission.VACCINES_READ} />,
            children: [
              {
                path: ROUTES.vaccines,
                element: (
                  <Lazy>
                    <VaccinesPage />
                  </Lazy>
                ),
                handle: { breadcrumb: 'Vacunas' },
              },
            ],
          },
          {
            element: <RoleGuard permission={Permission.USERS_MANAGE} />,
            handle: { breadcrumb: 'Usuarios' },
            children: [
              {
                path: ROUTES.users,
                element: (
                  <Lazy>
                    <UsersPage />
                  </Lazy>
                ),
              },
              {
                path: ROUTES.userNew,
                element: (
                  <Lazy>
                    <UserCreatePage />
                  </Lazy>
                ),
                handle: { breadcrumb: 'Nuevo' },
              },
              {
                path: '/users/:id/edit',
                element: (
                  <Lazy>
                    <UserEditPage />
                  </Lazy>
                ),
                handle: { breadcrumb: 'Editar' },
              },
            ],
          },
          {
            path: ROUTES.forbidden,
            element: <ForbiddenPage />,
            handle: { breadcrumb: 'Sin acceso' },
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to={ROUTES.dashboard} replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
