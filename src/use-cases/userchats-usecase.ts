import { createUserChats, getUserChats } from "@/data-access/chats";
import { Comment, User } from "@/data-access/types";
import { ApiError } from "@/lib/axios";

export async function createUserChatsUsecase(user: string): Promise<{
  success?: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const { success, data } = await createUserChats(
      user,
      localStorage.getItem("token")!
    );
    return { success, data };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return { success: false, error: apiError.data.error };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}
export async function getUserChatsUsecase(): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const { success, data } = await getUserChats(
      localStorage.getItem("token")!
    );
    return { success, data };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return { success: false, error: apiError.data.error };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}
