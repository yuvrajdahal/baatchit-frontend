"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/data-access/types";
import {
  regiserUserUsecase,
  loginUserUsecase,
  getCurrentUserUsecase,
} from "@/use-cases/auth-usecase";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoginLoading: boolean;
  isLoading: boolean;
  error: string | null;
  register: (
    email: string,
    fullname: string,
    username: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isLoginLoading: false,
      register: async (
        email: string,
        fullname: string,
        username: string,
        password: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          const result = await regiserUserUsecase(
            email,
            fullname,
            username,
            password
          );
          if (result.success) {
            const token = localStorage.getItem("token");
            if (token) {
              const userResult = await getCurrentUserUsecase(token);
              if (userResult.success && userResult.user) {
                set({
                  user: userResult.user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                set({
                  error: userResult.error || "Failed to get user data",
                  isLoading: false,
                });
              }
            } else {
              set({
                error: "Token not found after registration",
                isLoading: false,
              });
            }
          } else {
            set({
              error: result.error || "Registration failed",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "An unexpected error occurred during registration",
            isLoading: false,
          });
        }
      },
      login: async (email: string, password: string) => {
        set({ isAuthenticated: false, isLoginLoading: true, error: null });
        try {
          const result = await loginUserUsecase(email, password);
          if (result.success) {
            const token = localStorage.getItem("token");
            if (token) {
              const userResult = await getCurrentUserUsecase(token);
              if (userResult.success && userResult.user) {
                set({
                  user: userResult.user,
                  token,
                  isAuthenticated: true,
                  isLoginLoading: false,
                });
                return true;
              } else {
                set({
                  error: userResult.error || "Failed to get user data",
                  isLoginLoading: false,
                  isAuthenticated: false,
                });
              }
            } else {
              set({
                error: "Token not found after login",
                isLoginLoading: false,
                isAuthenticated: false,
              });
            }
          } else {
            set({
              error: result.error || "Login failed",
              isLoginLoading: false,
              isAuthenticated: false,
            });
          }
          return false;
        } catch (error) {
          set({
            error: "An unexpected error occurred during login",
            isLoginLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },
      logout: () => {
        localStorage.clear();
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },
      refreshUser: async () => {
        const token = localStorage.getItem("token");
        if (token) {
          set({ isLoading: true, error: null });
          try {
            const result = await getCurrentUserUsecase(token);
            if (result.success && result.user) {
              set({
                user: result.user,
                token,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({
                error: result.error || "Failed to refresh user data",
                isLoading: false,
              });
            }
          } catch (error) {
            set({
              error: "An unexpected error occurred while refreshing user data",
              isLoading: false,
            });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
export default useAuthStore;
