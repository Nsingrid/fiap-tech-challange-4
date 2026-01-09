import { create } from "zustand";
import { login, logout, signup } from "~/services/auth";
import type { AuthUserParams, CreateUserParams, AuthUserResponse, CreateUserResponse } from "~/types/services";

export type UserState = {
  username: string | null;
  token: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setEmail: (email: string) => void;
  clearUser: () => void;
  
  // Async actions
  login: (params: AuthUserParams) => Promise<void>;
  signup: (params: CreateUserParams) => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  username: null,
  token: null,
  email: null,
  loading: false,
  error: null,

  setUsername: (username) => set({ username }),
  setToken: (token) => set({ token }),
  setEmail: (email) => set({ email }),
  
  clearUser: () => set({ username: null, token: null, email: null, error: null }),

  login: async (params: AuthUserParams) => {
    set({ loading: true, error: null });
    try {
      const response: AuthUserResponse = await login(params);
      if (response.result?.token) {
        set({
          token: response.result.token,
          username: (response.result as { username?: string })?.username || params.email,
          email: params.email,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao fazer login",
        loading: false,
      });
      throw error;
    }
  },

  signup: async (params: CreateUserParams) => {
    set({ loading: true, error: null });
    try {
      const response: CreateUserResponse = await signup(params);
      if ((response.result as { id?: string })?.id) {
        set({
          username: params.username,
          email: params.email,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao registrar",
        loading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await logout();
      set({ username: null, token: null, email: null, loading: false, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao fazer logout",
        loading: false,
      });
    }
  },
}));
