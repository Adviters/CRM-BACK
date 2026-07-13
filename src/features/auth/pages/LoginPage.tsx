import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#d8efe7_0%,_transparent_42%),radial-gradient(circle_at_bottom_right,_#dde5f2_0%,_transparent_40%),linear-gradient(180deg,#f6f7f9_0%,#eef1f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,_#12352c_0%,_transparent_40%),radial-gradient(circle_at_bottom_right,_#1a2433_0%,_transparent_45%),linear-gradient(180deg,#0d1117_0%,#121820_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px]" />

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
