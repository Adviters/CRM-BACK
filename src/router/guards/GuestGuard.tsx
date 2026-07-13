import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/constants/routes'

export function GuestGuard() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
