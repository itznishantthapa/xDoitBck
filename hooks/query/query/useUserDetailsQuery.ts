import { useQuery } from "@tanstack/react-query";

import { getUserDetails } from "@/api/userApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useUserDetailsQuery(
  userId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => getUserDetails(userId),
    enabled: (options?.enabled ?? true) && Boolean(userId),
  });
}
