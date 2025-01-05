import { User, UserChats, UserMessages } from "@/data-access/types";
import {
  createUserChatsUsecase,
  getUserChatsUsecase,
  getUserMessagesUsecase,
} from "@/use-cases/userchats-usecase";
import { create } from "zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserChats = () => {
  return useQuery({
    queryKey: ["userChats"],
    queryFn: () => getUserChatsUsecase(),
  });
};

export const useUserMessages = (from: string, to: string) => {
  return useQuery({
    queryKey: ["messages", from, to],
    queryFn: () => getUserMessagesUsecase(from, to),
    enabled: !!from && !!to,
  });
};

export const useCreateUserChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => createUserChatsUsecase(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    },
  });
};

