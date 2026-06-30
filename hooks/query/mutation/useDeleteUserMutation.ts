import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUser } from "@/api/userApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
