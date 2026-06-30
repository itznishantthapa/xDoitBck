import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { logoutRequest } from "@/api/loginApi";
import { useAuthStore } from "@/lib/store";
import { authBridge } from "@/service/authBridge";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      authBridge.clearSession();
      localStorage.removeItem("doit_user");
      clearAuth();
      queryClient.clear();
    },
    onError: (error) => {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Admin logout request failed:", error);
      }
    },
  });
}
