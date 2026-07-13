import type { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import type { Permission } from '@/constants/permissions'

interface CanProps {
  permission?: Permission
  permissions?: readonly Permission[]
  fallback?: ReactNode
  children: ReactNode
}

export function Can({ permission, permissions, fallback = null, children }: CanProps) {
  const { can, canAny } = usePermissions()

  const allowed = permission
    ? can(permission)
    : permissions
      ? canAny(permissions)
      : false

  if (!allowed) return <>{fallback}</>
  return <>{children}</>
}
