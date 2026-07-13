import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ROLE_LABELS } from '@/types/enums'
import { useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store/ui.store'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { fullName } from '@/utils/format'

export function Topbar() {
  const user = useAuthStore((state) => state.user)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const setSidebarMobileOpen = useUiStore((state) => state.setSidebarMobileOpen)
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={() => setSidebarMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Bars3Icon className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hidden lg:inline-flex"
        onClick={toggleSidebar}
        aria-label="Colapsar menú"
      >
        <Bars3Icon className="size-5" />
      </Button>

      <Breadcrumbs className="hidden sm:flex" />

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
        </Button>

        {user ? (
          <Dropdown
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 transition-colors hover:bg-surface-muted"
              >
                <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium text-ink">
                    {fullName(user.firstName, user.lastName)}
                  </span>
                  <span className="block text-xs text-ink-muted">{ROLE_LABELS[user.role]}</span>
                </span>
              </button>
            }
          >
            <div className="border-b border-border px-3 py-2 sm:hidden">
              <p className="text-sm font-medium text-ink">{fullName(user.firstName, user.lastName)}</p>
              <p className="text-xs text-ink-muted">{user.email}</p>
            </div>
            <DropdownItem
              danger
              onClick={() => {
                void logout.mutateAsync()
              }}
            >
              <ArrowRightStartOnRectangleIcon className="size-4" />
              Cerrar sesión
            </DropdownItem>
          </Dropdown>
        ) : null}
      </div>
    </header>
  )
}
