import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeFromWorking } from "@/api/workingApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useRemoveFromWorkingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWorking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.working.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.badges });
    },
  });
}
