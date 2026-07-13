import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { Pagination } from '@/components/ui/Pagination'
import { Avatar } from '@/components/ui/Avatar'
import { FormField } from '@/components/forms/FormField'

describe('UI components', () => {
  it('renderiza Button y dispara click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('muestra loading en Button', () => {
    render(<Button isLoading>Guardar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renderiza Badge, Input, Checkbox, Avatar y FormField', () => {
    render(
      <>
        <Badge>Activo</Badge>
        <Input aria-label="nombre" />
        <Checkbox label="Recordarme" />
        <Avatar firstName="Ana" lastName="Perez" />
        <FormField label="Email" error="Requerido">
          <Input />
        </FormField>
      </>,
    )
    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByLabelText('nombre')).toBeInTheDocument()
    expect(screen.getByText('Recordarme')).toBeInTheDocument()
    expect(screen.getByText('AP')).toBeInTheDocument()
    expect(screen.getByText('Requerido')).toBeInTheDocument()
  })

  it('renderiza EmptyState, ErrorState, Loader y Pagination', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const onPageChange = vi.fn()

    render(
      <>
        <EmptyState title="Sin datos" description="Nada aún" />
        <ErrorState onRetry={onRetry} />
        <Loader label="Cargando" />
        <Pagination page={1} totalPages={3} total={30} limit={10} onPageChange={onPageChange} />
      </>,
    )

    expect(screen.getByText('Sin datos')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onRetry).toHaveBeenCalledOnce()
    expect(screen.getAllByText('Cargando').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: /Siguiente/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
