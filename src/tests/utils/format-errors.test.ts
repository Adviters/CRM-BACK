import { describe, expect, it } from 'vitest'
import { fullName, initials } from '@/utils/format'
import { getErrorMessage } from '@/utils/errors'
import axios from 'axios'

describe('format utils', () => {
  it('arma nombre completo e iniciales', () => {
    expect(fullName('Ana', 'Pérez')).toBe('Ana Pérez')
    expect(initials('Ana', 'Pérez')).toBe('AP')
    expect(initials('Ana')).toBe('A')
  })
})

describe('getErrorMessage', () => {
  it('usa fallback por defecto', () => {
    expect(getErrorMessage(null)).toBe('Ocurrió un error inesperado')
  })

  it('lee mensaje de Axios', () => {
    const error = {
      isAxiosError: true,
      response: { data: { message: 'Conflict' } },
      message: 'Request failed',
      toJSON: () => ({}),
      name: 'AxiosError',
    }
    Object.setPrototypeOf(error, axios.AxiosError.prototype)
    expect(getErrorMessage(error)).toBe('Conflict')
  })

  it('une mensajes de validación', () => {
    const error = {
      isAxiosError: true,
      response: { data: { message: ['a', 'b'] } },
      message: 'Request failed',
      toJSON: () => ({}),
      name: 'AxiosError',
    }
    Object.setPrototypeOf(error, axios.AxiosError.prototype)
    expect(getErrorMessage(error)).toBe('a, b')
  })

  it('usa Error.message', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
  })
})
