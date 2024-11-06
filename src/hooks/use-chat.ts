import { User, UserChats } from "@/data-access/types";
import {
  createUserChatsUsecase,
  getUserChatsUsecase,
} from "@/use-cases/userchats-usecase";
import { create } from "zustand";

interface ChatType {
  userChats: UserChats[];
  createUserChatLoading: boolean;
  fetchUserChatsLoading: boolean;
  error: string | null;
  clearError: () => void;
  createUserChat: (id: string) => Promise<boolean>;
  fetchUserChats: () => Promise<void>;
  getUserFromId: (id: string) => UserChats | undefined;
}

export const useChatStore = create<ChatType>((set, get) => ({
  userChats: [],
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
  getUserFromId: (id: string) => {
    const user = get().userChats.find((user) => user.receiver._id === id);
    return user;
  },
}));
export default useChatStore;
