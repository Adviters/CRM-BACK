import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/lib/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/constants/**/*.{ts,tsx}',
        'src/store/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/router/guards/**/*.{ts,tsx}',
        'src/components/forms/**/*.{ts,tsx}',
        'src/components/ui/**/*.{ts,tsx}',
        'src/components/feedback/**/*.{ts,tsx}',
        'src/components/layout/PageHeader.tsx',
        'src/services/api/token-storage.ts',
        'src/features/**/api/**/*.{ts,tsx}',
        'src/features/**/schemas/**/*.{ts,tsx}',
        'src/features/dashboard/components/StatCard.tsx',
        'src/types/enums.ts',
      ],
      exclude: [
        'src/tests/**',
        'src/**/*.types.ts',
        'src/components/ui/Modal.tsx',
        'src/components/ui/Drawer.tsx',
        'src/components/ui/Dropdown.tsx',
        'src/components/feedback/ConfirmDialog.tsx',
        'src/components/feedback/Skeleton.tsx',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
})
