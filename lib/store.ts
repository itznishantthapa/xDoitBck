import Cookies from "js-cookie";
import { create } from "zustand";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<UserProfile>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("doit_user") || "null")
      : null,
  accessToken:
    typeof window !== "undefined" ? Cookies.get("auth_token") || null : null,
  isLoading: false,

  login: async (payload) => {
    set({ isLoading: true });

    try {

      //promise for 5 sec for delay
      await new Promise((resolve) => setTimeout(resolve, 5000));


      const mockApiResponse = {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenString...",
        user: {
          id: "usr_9921",
          name: payload.username,
          email: `${payload.username}@doit.app`,
          role: "admin",
        },
      };

      const { accessToken, user } = mockApiResponse;

      Cookies.set("auth_token", accessToken, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      localStorage.setItem("doit_user", JSON.stringify(user));

      set({ user, accessToken, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("doit_user");
    set({ user: null, accessToken: null });
  },
}));
