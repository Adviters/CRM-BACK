import { NavLink } from 'react-router-dom'
import {
  CalendarDaysIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/constants/routes'
import { Permission } from '@/constants/permissions'
import { usePermissions } from '@/hooks/use-permissions'
import { useUiStore } from '@/store/ui.store'
import { Button } from '@/components/ui/Button'

interface NavItem {
  label: string
  to: string
  icon: typeof HomeIcon
  permission: Permission
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: HomeIcon, permission: Permission.DASHBOARD_READ },
  { label: 'Clientes', to: ROUTES.customers, icon: UsersIcon, permission: Permission.CUSTOMERS_READ },
  { label: 'Mascotas', to: ROUTES.pets, icon: UserGroupIcon, permission: Permission.PETS_READ },
  {
    label: 'Turnos',
    to: ROUTES.appointments,
    icon: CalendarDaysIcon,
    permission: Permission.APPOINTMENTS_READ,
  },
  {
    label: 'Vacunas',
    to: ROUTES.vaccines,
    icon: ShieldCheckIcon,
    permission: Permission.VACCINES_READ,
  },
  {
    label: 'Usuarios',
    to: ROUTES.users,
    icon: UserCircleIcon,
    permission: Permission.USERS_MANAGE,
  },
]

export function Sidebar() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed)
  const mobileOpen = useUiStore((state) => state.sidebarMobileOpen)
  const setSidebarMobileOpen = useUiStore((state) => state.setSidebarMobileOpen)
  const { can } = usePermissions()

  const items = NAV_ITEMS.filter((item) => can(item.permission))

  const content = (
    <aside
      className={cn(
        'flex h-full min-h-0 flex-col border-r border-border bg-surface transition-[width] duration-200',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center gap-3 border-b border-border px-4', collapsed && 'justify-center px-2')}>
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
          PS
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">PetShop</p>
            <p className="truncate text-xs text-ink-muted">CRM Veterinario</p>
          </div>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
          aria-label="Cerrar menú"
        >
          <XMarkIcon className="size-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.dashboard}
              onClick={() => setSidebarMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-brand-soft text-brand'
                    : 'text-ink-secondary hover:bg-surface-muted hover:text-ink',
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )

  return (
    <>
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">{content}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Cerrar menú"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 h-full">{content}</div>
        </div>
      ) : null}
    </>
  )
}
