import { useMutation } from "@tanstack/react-query";

import { resetUserPassword } from "@/api/userApi";

export function useResetUserPasswordMutation() {
  return useMutation({
    mutationFn: resetUserPassword,
  });
}
