import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export interface AdminUserResponse {
  id: number;
  username: string;
  role: string;
  country: string | null;
  program: string | null;
  device_id: string | null;
  platform: string | null;
  is_notification_subscribed: boolean;
  is_suspended: boolean;
  created_at: string | null;
}

export interface AuthTokensResponse {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  message: string;
  tokens: AuthTokensResponse;
  user: AdminUserResponse;
}

export interface MeResponse {
  message: string;
  user: AdminUserResponse;
}

export async function loginRequest(payload: {
  username: string;
  password: string;
}) {
  const { data } = await API_CLIENT.post<LoginResponse>(
    endpoints.login,
    payload
  );

  return data;
}

export async function getCurrentAdminRequest() {
  const { data } = await API_CLIENT.get<MeResponse>(endpoints.me);
  return data;
}

export async function logoutRequest() {
  const { data } = await API_CLIENT.post<{ message: string }>(endpoints.logout);
  return data;
}

export function mapAdminUserToProfile(user: AdminUserResponse) {
  return {
    id: String(user.id),
    name: user.username,
    username: user.username,
    role: user.role,
  };
}
