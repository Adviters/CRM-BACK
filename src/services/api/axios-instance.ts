import axios from 'axios'
import { setupAuthInterceptor } from './interceptors/auth.interceptor'
import { setupErrorInterceptor } from './interceptors/error.interceptor'

const baseURL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
})

setupAuthInterceptor(api)
setupErrorInterceptor(api)
