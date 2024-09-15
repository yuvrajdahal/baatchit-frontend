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
  getSuggestedUsersUsecase,
} from "@/use-cases/auth-usecase";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loadMessage: boolean;
  setLoadMessage: (loadMessage: boolean) => void;
  isLoginLoading: boolean;
  isFollowingLoading: boolean;
  isUnfollowingLoading: boolean;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  isRegisterLoading: boolean;
  isLoading: boolean;
  userByIdLoading: boolean;
  userById: User | null;
  error: string | null;
  suggestedUsers: User[] | null;
  isSuggestedUsersLoading: boolean;
  getSuggestedUsers: () => Promise<boolean>;
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
  followSuggestedUser: (id: string) => Promise<boolean>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isFollowingLoading: false,
      isUnfollowingLoading: false,
      userByIdLoading: false,
      loadMessage: false,
      isLoading: false,
      userById: null,
      isLoginLoading: false,
      isRegisterLoading: false,
      error: null,
      suggestedUsers: null,
      isSuggestedUsersLoading: false,
      setLoadMessage: (loadMessage: boolean) => set({ loadMessage }),
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
        set({ userByIdLoading: true, error: null });
        try {
          const result = await getUserByIdUsecase(id);
          if (result.success && result.user) {
            set({
              userById: result.user,
              userByIdLoading: false,
            });
          } else {
            set({
              error: result.error || "Failed to get user data",
              userByIdLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "An unexpected error occurred while getting user data",
            userByIdLoading: false,
          });
        }
      },
      followUser: async (userId: string) => {
        set({ isFollowingLoading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const result = await followUserUsecase(userId, token);
            if (result.success && result.data) {
              set((state) => ({
                isFollowingLoading: false,
                userById: state.userById
                  ? {
                      ...state.userById,
                      isFollowing: !get().userById?.isFollowing,
                      followersCount: get().userById?.followersCount! + 1,
                    }
                  : null,
              }));
              return true;
            } else {
              set((state) => ({
                isFollowingLoading: false,
                // userById: state.userById
                //   ? {
                //       ...state.userById,
                //       isFollowing: !get().userById?.isFollowing,
                //       followersCount: get().userById?.followersCount! - 1,
                //     }
                //   : null,
                error: result.error || "Failed to follow user",
              }));
              return false;
            }
          } else {
            set({
              isFollowingLoading: false,
              error: "Token not found after following user",
            });
            return false;
          }
        } catch (error) {
          set((state) => ({
            isFollowingLoading: false,

            // userById: state.userById
            //   ? {
            //       ...state.userById,
            //       isFollowing: !get().userById?.isFollowing,
            //       followersCount: get().userById?.followersCount! - 1,
            //     }
            //   : null,
            error: "An unexpected error occurred while following user",
          }));
          return false;
        }
      },
      unfollowUser: async (userId: string) => {
        set({ isUnfollowingLoading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (token!) {
            const result = await unfollowUserUsecase(userId, token);
            if (result.success && result.data) {
              set((state) => ({
                isUnfollowingLoading: false,
                userById: state.userById
                  ? {
                      ...state.userById,
                      isFollowing: !get().userById?.isFollowing,
                      followersCount: get().userById?.followersCount! - 1,
                    }
                  : null,
              }));
              return true;
            } else {
              set({
                isUnfollowingLoading: false,
                error: result.error || "Failed to unfollow user",
              });
              return false;
            }
          } else {
            set({
              isUnfollowingLoading: false,
              error: "Token not found after unfollowing user",
            });
            return false;
          }
        } catch (error) {
          set((state) => ({
            isUnfollowingLoading: false,

            // userById: state.userById
            //   ? {
            //       ...state.userById,
            //       isFollowing: !get().userById?.isFollowing,
            //       followersCount: get().userById?.followersCount! + 1,
            //     }
            //   : null,
            error: "An unexpected error occurred while unfollowing user",
          }));
          return false;
        }
      },
      getSuggestedUsers: async () => {
        set({ isSuggestedUsersLoading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const result = await getSuggestedUsersUsecase(token);
            if (result.success && result.data) {
              set({
                suggestedUsers: [...result.data],
                isSuggestedUsersLoading: false,
              });
              return true;
            } else {
              set({
                error: result.error || "Failed to get suggested users",
                isSuggestedUsersLoading: false,
              });
              return false;
            }
          } else {
            set({
              error: "Token not found after getting suggested users",
              isSuggestedUsersLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: "An unexpected error occurred while getting suggested users",
            isSuggestedUsersLoading: false,
          });
          return false;
        }
      },
      followSuggestedUser: async (userId: string) => {
        set({ error: null });
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const result = await followUserUsecase(userId, token);
            if (result.success && result.data) {
              set((state) => ({
                suggestedUsers: state.suggestedUsers?.filter(
                  (user) => user._id !== userId
                ),
              }));

              return true;
            } else {
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
