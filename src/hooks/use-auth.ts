"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/data-access/types";
import {
  regiserUserUsecase,
  loginUserUsecase,
  getCurrentUserUsecase,
  getUserByIdUsecase,
  unfollowUserUsecase,
  followUserUsecase,
} from "@/use-cases/auth-usecase";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoginLoading: boolean;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  isRegisterLoading: boolean;
  isLoading: boolean;
  userById: User | null;
  error: string | null;
  register: (
    email: string,
    fullname: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  getUserById: (id: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      userById: null,
      isLoginLoading: false,
      isRegisterLoading: false,
      error: null,
      register: async (
        email: string,
        fullname: string,
        username: string,
        password: string
      ) => {
        set({ isAuthenticated: false, isRegisterLoading: true, error: null });
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
                  isRegisterLoading: false,
                });
                return true;
              } else {
                set({
                  error: userResult.error || "Failed to get user data",
                  isRegisterLoading: false,
                  isAuthenticated: false,
                });
              }
            } else {
              set({
                error: "Token not found after registration",
                isRegisterLoading: false,
                isAuthenticated: false,
              });
            }
          } else {
            set({
              error: result.error || "Registration failed",
              isRegisterLoading: false,
              isAuthenticated: false,
            });
          }
          return false;
        } catch (error) {
          set({
            error: "An unexpected error occurred during registration",
            isRegisterLoading: false,
            isAuthenticated: false,
          });
          return false;
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
      getUserById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await getUserByIdUsecase(id);
          if (result.success && result.user) {
            set({
              userById: result.user,
              isLoading: false,
            });
          } else {
            set({
              error: result.error || "Failed to get user data",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "An unexpected error occurred while getting user data",
            isLoading: false,
          });
        }
      },
      followUser: async (userId: string) => {
        set({ error: null });
        try {
          set((state) => ({
            userById: state.userById
              ? {
                  ...state.userById,
                  isFollowing: !get().userById?.isFollowing,
                  followersCount: get().userById?.followersCount! + 1,
                }
              : null,
          }));
          const token = localStorage.getItem("token");
          if (token) {
            const result = await followUserUsecase(userId, token);
            if (result.success && result.data) {
              return true;
            } else {
              set((state) => ({
                userById: state.userById
                  ? {
                      ...state.userById,
                      isFollowing: !get().userById?.isFollowing,
                      followersCount: get().userById?.followersCount! - 1,
                    }
                  : null,
              }));
              set({
                error: result.error || "Failed to follow user",
              });
              return false;
            }
          } else {
            set({
              error: "Token not found after following user",
            });
            return false;
          }
        } catch (error) {
          set((state) => ({
            userById: state.userById
              ? {
                  ...state.userById,
                  isFollowing: !get().userById?.isFollowing,
                  followersCount: get().userById?.followersCount! - 1,
                }
              : null,
            error: "An unexpected error occurred while following user",
          }));
          return false;
        }
      },
      unfollowUser: async (userId: string) => {
        set({ error: null });
        try {
          set((state) => ({
            userById: state.userById
              ? {
                  ...state.userById,
                  isFollowing: !get().userById?.isFollowing,
                  followersCount: get().userById?.followersCount! - 1,
                }
              : null,
          }));
          const token = localStorage.getItem("token");
          if (token) {
            const result = await unfollowUserUsecase(userId, token);
            if (result.success && result.data) {
              return true;
            } else {
              set((state) => ({
                userById: state.userById
                  ? {
                      ...state.userById,
                      isFollowing: !get().userById?.isFollowing,
                      followersCount: get().userById?.followersCount! + 1,
                    }
                  : null,
              }));
              set({
                error: result.error || "Failed to unfollow user",
              });
              return false;
            }
          } else {
            set({
              error: "Token not found after unfollowing user",
            });
            return false;
          }
        } catch (error) {
          set((state) => ({
            userById: state.userById
              ? {
                  ...state.userById,
                  isFollowing: !get().userById?.isFollowing,
                  followersCount: get().userById?.followersCount! + 1,
                }
              : null,
            error: "An unexpected error occurred while unfollowing user",
          }));
          return false;
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
