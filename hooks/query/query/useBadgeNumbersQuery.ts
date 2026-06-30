import { useQuery } from "@tanstack/react-query";

import { getBadgeNumbers } from "@/api/badgeApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useBadgeNumbersQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.badges,
    queryFn: getBadgeNumbers,
    enabled: options?.enabled ?? true,
  });
}
