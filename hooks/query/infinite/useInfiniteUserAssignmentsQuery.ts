import { useInfiniteQuery } from "@tanstack/react-query";

import { getUserAssignmentsInfinite } from "@/api/userApi";
import { queryKeys } from "@/hooks/query/queryKeys";

type UseInfiniteUserAssignmentsQueryParams = {
  userId: string;
  limit?: number;
  enabled?: boolean;
};

export function useInfiniteUserAssignmentsQuery({
  userId,
  limit = 5,
  enabled = true,
}: UseInfiniteUserAssignmentsQueryParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.assignmentsInfinite(userId),
    enabled: enabled && Boolean(userId),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getUserAssignmentsInfinite(userId, pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
  });
}
