import { useMutation } from "@tanstack/react-query";

import { resendSystemNotification } from "@/api/notificationApi";

export function useResendSystemNotificationMutation() {
  return useMutation({
    mutationFn: resendSystemNotification,
  });
}
