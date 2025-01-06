"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/data-access/types";
import {
  regiserUserUsecase,
  loginUserUsecase,
  getCurrentUserUsecase,
  getUserByIdUsecase,
  unfollowUserUsecase,
  followUserUsecase,
  getSuggestedUsersUsecase,
  getUsersByUserNameUsecase,
} from "@/use-cases/auth-usecase";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoginLoading: boolean;
  isFollowingLoading: boolean;
  isUnfollowingLoading: boolean;
  isRegisterLoading: boolean;
  isLoading: boolean;
  userByIdLoading: boolean;
  userById: User | null;
  error: string | null;
  suggestedUsers: User[] | null;
  isSuggestedUsersLoading: boolean;
  isUsersByUserNameLoading: boolean;
  usersByUserName: User[];
  messagingUsers: User[];
  getUsersByUserName: (username: string) => Promise<boolean>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
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
  clearUsersByUserName: () => void;
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      return getCurrentUserUsecase(token);
    },
  });
};
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      return getUserByIdUsecase(id, token);
    },
    // staleTime: 0,
    // refetchOnMount: true,
    // gcTime: 0,
    // enabled: !!id,
    // refetchOnWindowFocus: true,
  });
};
export const useSuggestedUsers = () => {
  return useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      return getSuggestedUsersUsecase(token);
    },
  });
};

export const useUsersByUsername = (username: string) => {
  return useQuery({
    queryKey: ["usersByUsername", username],
    queryFn: async () => {
      if (!username) return null;
      const data = getUsersByUserNameUsecase(username);
      return data;
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => loginUserUsecase(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      fullname,
      username,
      password,
    }: {
      email: string;
      fullname: string;
      username: string;
      password: string;
    }) => regiserUserUsecase(email, fullname, username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("token");
      const result = await followUserUsecase(userId, token!);
      await queryClient.fetchQuery({
        queryKey: ["user", userId],
      });
      return result;
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("token");
      const result = await unfollowUserUsecase(userId, token!);
      await queryClient.fetchQuery({
        queryKey: ["user", userId],
      });
      return result;
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
    },
  });
};
