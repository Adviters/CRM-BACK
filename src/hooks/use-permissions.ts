import { useAuthStore } from '@/store/auth.store'
import { hasAnyPermission, hasPermission, type Permission } from '@/constants/permissions'

export function usePermissions() {
  const role = useAuthStore((state) => state.user?.role)

  return {
    role,
    can: (permission: Permission) => hasPermission(role, permission),
    canAny: (permissions: readonly Permission[]) => hasAnyPermission(role, permissions),
  }
}
