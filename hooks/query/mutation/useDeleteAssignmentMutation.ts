import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAssignment } from "@/api/assignmentApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useDeleteAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.working.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.badges });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
