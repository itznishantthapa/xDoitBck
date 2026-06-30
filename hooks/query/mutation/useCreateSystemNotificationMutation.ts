import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSystemNotification } from "@/api/notificationApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useCreateSystemNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSystemNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
