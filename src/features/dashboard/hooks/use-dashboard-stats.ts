import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { dashboardApi } from '../api/dashboard.api'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardApi.getStats,
  })
}
