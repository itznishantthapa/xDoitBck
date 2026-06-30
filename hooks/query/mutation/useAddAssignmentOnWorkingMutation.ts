import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addAssignmentOnWorking } from "@/api/assignmentApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useAddAssignmentOnWorkingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAssignmentOnWorking,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.working.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.badges });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignmentProgress.detail(variables.assignmentId),
      });
    },
  });
}
