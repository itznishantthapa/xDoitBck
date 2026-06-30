import axios from "axios";
import Cookies from "js-cookie";

import { endpoints } from "./endpoint";

const REFRESH_TOKEN_KEY = "doit_refresh_token";
const USER_KEY = "doit_user";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const cookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const authBridge = {
  getAccessToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return Cookies.get("auth_token") || null;
  },

  getRefreshToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setSession(tokens: { access: string; refresh: string }) {
    Cookies.set("auth_token", tokens.access, cookieOptions);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  },

  setAccessToken(accessToken: string) {
    Cookies.set("auth_token", accessToken, cookieOptions);
  },

  clearSession() {
    Cookies.remove("auth_token");
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async refreshAccessToken() {
    const refresh = authBridge.getRefreshToken();

    if (!refresh) {
      throw { message: "No refresh token" };
    }

    const response = await axios.post<{ access: string; message: string }>(
      `${API_BASE_URL}${endpoints.refresh}`,
      { refresh },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    authBridge.setAccessToken(response.data.access);
    return response.data.access;
  },

  async logout(options?: { redirect?: boolean }) {
    authBridge.clearSession();

    if (options?.redirect !== false && typeof window !== "undefined") {
      window.location.assign("/auth");
    }
  },
};
