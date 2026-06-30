import { useQuery } from "@tanstack/react-query";

import { getAssignmentProgress } from "@/api/assignmentProgressApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useAssignmentProgressQuery(
  assignmentId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.assignmentProgress.detail(assignmentId),
    queryFn: () => getAssignmentProgress(assignmentId),
    enabled: (options?.enabled ?? true) && Boolean(assignmentId),
  });
}
