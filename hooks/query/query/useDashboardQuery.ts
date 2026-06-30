import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "@/api/dashboardApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useDashboardQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardData,
    enabled: options?.enabled ?? true,
  });
}
