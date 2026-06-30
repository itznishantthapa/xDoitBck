import Cookies from "js-cookie";
import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  setAuth: (user: UserProfile, accessToken: string) => void;
  clearAuth: () => void;
}

function readStoredUser(): UserProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = Cookies.get("auth_token");
  if (!token) {
    localStorage.removeItem("doit_user");
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem("doit_user") || "null");
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readStoredUser(),
  accessToken:
    typeof window !== "undefined" ? Cookies.get("auth_token") || null : null,

  setAuth: (user, accessToken) => {
    set({ user, accessToken });
  },

  clearAuth: () => {
    set({ user: null, accessToken: null });
  },
}));
