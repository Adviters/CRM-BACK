import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="login-backdrop pointer-events-none" aria-hidden />
      <div className="login-backdrop-grid pointer-events-none" aria-hidden />

      <div className="relative w-full max-w-md page-enter">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white shadow-panel">
            PS
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink">PetShop CRM</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Acceso exclusivo para el equipo de la veterinaria
          </p>
        </div>

        <div className="panel p-6 md:p-8">
          <h2 className="mb-1 text-lg font-semibold text-ink">Iniciar sesión</h2>
          <p className="mb-6 text-sm text-ink-muted">Ingresá tus credenciales para continuar</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
