import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/query/queryKeys";

export function invalidateAssignmentProgressQueries(
  queryClient: QueryClient,
  assignmentId: string
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.assignmentProgress.detail(assignmentId),
  });
  queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.working.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  queryClient.invalidateQueries({ queryKey: queryKeys.badges });
}
