import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { authBridge, API_BASE_URL } from "./authBridge";
import { endpoints } from "./endpoint";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

const isPublicAuthRequest = (url?: string) =>
  url?.includes(endpoints.login) || url?.includes(endpoints.refresh);

const shouldLogoutOnRefreshFailure = (refreshError: unknown) => {
  if (
    typeof refreshError === "object" &&
    refreshError !== null &&
    "message" in refreshError &&
    refreshError.message === "No refresh token"
  ) {
    return true;
  }

  if (!axios.isAxiosError(refreshError)) {
    return false;
  }

  const status = refreshError.response?.status;
  const refreshExpired = refreshError.response?.data?.refresh_expired;

  return status === 401 || refreshExpired === true;
};

const getRefreshedAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = authBridge.refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export const API_CLIENT = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

API_CLIENT.interceptors.request.use((config) => {
  if (isPublicAuthRequest(config.url)) {
    return config;
  }

  const accessToken = authBridge.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

API_CLIENT.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(endpoints.refresh) &&
      !originalRequest.url?.includes(endpoints.logout)
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await getRefreshedAccessToken();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API_CLIENT(originalRequest);
      } catch (refreshError) {
        if (shouldLogoutOnRefreshFailure(refreshError)) {
          await authBridge.logout();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed."
) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export { API_BASE_URL };
