import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <p className="text-sm font-semibold tracking-wide text-brand uppercase">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Página no encontrada</h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        La ruta que buscás no existe o fue movida.
      </p>
      <Link to={ROUTES.dashboard} className="mt-6">
        <Button>Ir al dashboard</Button>
      </Link>
    </div>
  )
}
