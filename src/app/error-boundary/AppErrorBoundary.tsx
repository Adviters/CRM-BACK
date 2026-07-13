import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('AppErrorBoundary', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Algo salió mal</h1>
          <p className="max-w-md text-sm text-ink-muted">
            Ocurrió un error inesperado en la interfaz. Podés recargar la página para continuar.
          </p>
          <Button onClick={() => window.location.assign('/')}>Volver al inicio</Button>
        </div>
      )
    }

    return this.props.children
  }
}
