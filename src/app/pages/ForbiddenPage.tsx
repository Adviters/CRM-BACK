import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function ForbiddenPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold tracking-wide text-brand uppercase">403</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Sin permisos</h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        Tu rol no tiene acceso a esta sección del sistema.
      </p>
      <Link to={ROUTES.dashboard} className="mt-6">
        <Button>Volver al dashboard</Button>
      </Link>
    </div>
  )
}
