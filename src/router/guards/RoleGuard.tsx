import { Navigate, Outlet } from 'react-router-dom'
import { usePermissions } from '@/hooks/use-permissions'
import type { Permission } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'

interface RoleGuardProps {
  permission?: Permission
  permissions?: readonly Permission[]
}

export function RoleGuard({ permission, permissions }: RoleGuardProps) {
  const { can, canAny } = usePermissions()

  const allowed = permission
    ? can(permission)
    : permissions
      ? canAny(permissions)
      : false

  if (!allowed) {
    return <Navigate to={ROUTES.forbidden} replace />
  }

  return <Outlet />
}
