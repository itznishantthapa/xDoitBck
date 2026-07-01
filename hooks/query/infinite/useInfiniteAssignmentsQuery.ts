import { useInfiniteQuery } from "@tanstack/react-query";

import {
  getAssignmentsInfinite,
  type AssignmentTabStatus,
} from "@/api/assignmentApi";
import { queryKeys } from "@/hooks/query/queryKeys";

type UseInfiniteAssignmentsQueryParams = {
  status?: AssignmentTabStatus;
  limit?: number;
  enabled?: boolean;
};

export function useInfiniteAssignmentsQuery({
  status = "in_review",
  limit = 8,
  enabled = true,
}: UseInfiniteAssignmentsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.assignments.infinite({ status }),
    enabled,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getAssignmentsInfinite(pageParam, limit, status),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
  });
}
