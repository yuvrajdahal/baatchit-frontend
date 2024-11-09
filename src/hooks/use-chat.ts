import { User, UserChats, UserMessages } from "@/data-access/types";
import {
  createUserChatsUsecase,
  getUserChatsUsecase,
  getUserMessagesUsecase,
} from "@/use-cases/userchats-usecase";
import { create } from "zustand";

interface ChatType {
  userChats: UserChats[];
  userMessages: UserMessages[];
  usersMessageLoading: boolean;
  createUserChatLoading: boolean;
  fetchUserChatsLoading: boolean;
  error: string | null;
  clearError: () => void;
  createUserChat: (id: string) => Promise<boolean>;
  fetchUserChats: () => Promise<void>;
  fetchUserMessages: (from: string, to: string) => Promise<void>;
  getUserFromId: (id: string) => UserChats | undefined;
}

export const useChatStore = create<ChatType>((set, get) => ({
  userChats: [],
  userMessages: [],
  usersMessageLoading: false,
  createUserChatLoading: false,
  fetchUserChatsLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  createUserChat: async (user) => {
    set({ createUserChatLoading: true, error: null });
    try {
      const result = await createUserChatsUsecase(user);
      if (result.success && result.data) {
        await get().fetchUserChats();
        set((state) => ({
          createUserChatLoading: false,
        }));
        return true;
      } else {
        set({
          error: result.error || "Failed to fetch user chats",
          createUserChatLoading: false,
        });
        return false;
      }
    } catch (e) {
      set({
        error: "An unexpected error occurred while fetching user chats",
        createUserChatLoading: false,
      });
      return false;
    }
  },
  fetchUserChats: async () => {
    set({ fetchUserChatsLoading: true, error: null });
    try {
      const result = await getUserChatsUsecase();
      if (result.success && result.data) {
        set((state) => ({
          userChats: result.data,
          fetchUserChatsLoading: false,
        }));
      } else {
        set({
          error: result.error || "Failed to fetch user chats",
          fetchUserChatsLoading: false,
        });
      }
    } catch (e) {
      set({
        error: "An unexpected error occurred while fetching user chats",
        fetchUserChatsLoading: false,
      });
    }
  },
  fetchUserMessages: async (from, to) => {
    set({ usersMessageLoading: true, error: null });
    try {
      const result = await getUserMessagesUsecase(from, to);
      if (result.success && result.data) {
        set((state) => ({
          userMessages: result.data,
          usersMessageLoading: false,
        }));
      } else {
        set({
          error: result.error || "Failed to fetch user messages",
          usersMessageLoading: false,
        });
      }
    } catch (e) {
      set({
        error: "An unexpected error occurred while fetching user messages",
        usersMessageLoading: false,
      });
    }
  },
  getUserFromId: (id: string) => {
    const user = get().userChats.find((user) => user.receiver._id === id);
    return user;
  },
}));
export default useChatStore;
