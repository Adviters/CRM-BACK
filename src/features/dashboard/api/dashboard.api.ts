import { api } from '@/services/api/axios-instance'
import type { DashboardStatsDto } from '../types/dashboard.types'

export const dashboardApi = {
  getStats: async (): Promise<DashboardStatsDto> => {
    const { data } = await api.get<DashboardStatsDto>('/dashboard/stats')
    return data
  },
}
