import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/services/query-client'
import { router } from '@/router'
import { AppErrorBoundary } from '@/app/error-boundary/AppErrorBoundary'

export function AppProviders() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'text-sm',
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-ink)',
              border: '1px solid var(--color-border)',
            },
          }}
        />
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}
