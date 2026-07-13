export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: (params: unknown) => ['customers', 'list', params] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
  },
  pets: {
    all: ['pets'] as const,
    list: (params: unknown) => ['pets', 'list', params] as const,
    detail: (id: string) => ['pets', 'detail', id] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: (params: unknown) => ['appointments', 'list', params] as const,
    detail: (id: string) => ['appointments', 'detail', id] as const,
  },
  medicalRecords: {
    all: ['medical-records'] as const,
    list: (params: unknown) => ['medical-records', 'list', params] as const,
    detail: (id: string) => ['medical-records', 'detail', id] as const,
  },
  vaccines: {
    all: ['vaccines'] as const,
    list: (params: unknown) => ['vaccines', 'list', params] as const,
    detail: (id: string) => ['vaccines', 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: unknown) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
} as const
