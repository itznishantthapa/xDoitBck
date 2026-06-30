import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getBadgeNumbers } from "@/api/badgeApi";
import { getDashboardData } from "@/api/dashboardApi";
import {
  CompleteLoginResponse,
  loginRequest,
  mapAdminUserToProfile,
  totpSetupRequest,
  totpVerifyRequest,
} from "@/api/loginApi";
import { queryKeys } from "@/hooks/query/queryKeys";
import { useAuthStore } from "@/lib/store";
import { authBridge } from "@/service/authBridge";

async function finalizeAuthSession(
  response: CompleteLoginResponse,
  setAuth: ReturnType<typeof useAuthStore.getState>["setAuth"],
  queryClient: ReturnType<typeof useQueryClient>
) {
  const user = mapAdminUserToProfile(response.user);

  authBridge.setSession(response.tokens);
  localStorage.setItem("doit_user", JSON.stringify(user));
  setAuth(user, response.tokens.access);

  await queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardData,
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.badges,
    queryFn: getBadgeNumbers,
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginRequest,
  });
}

export function useTotpSetupMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: totpSetupRequest,
    onSuccess: async (response) => {
      await finalizeAuthSession(response, setAuth, queryClient);
    },
  });
}

export function useTotpVerifyMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: totpVerifyRequest,
    onSuccess: async (response) => {
      await finalizeAuthSession(response, setAuth, queryClient);
    },
  });
}
