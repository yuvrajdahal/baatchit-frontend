import {
  login,
  signup,
  getUser,
  getUserById,
  unfollowUser,
  followUser,
  getSuggestedUsers,
} from "@/data-access/auth";
import { User } from "@/data-access/types";
import { ApiError } from "@/lib/axios";
export async function regiserUserUsecase(
  email: string,
  fullname: string,
  username: string,
  password: string
) {
  try {
    const { success, token } = await signup(
      email,
      fullname,
      username,
      password
    );
    if (success) {
      localStorage.setItem("token", token);
    }
    return {
      success,
    };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return { success: false, error: apiError.data.error };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}
export async function loginUserUsecase(
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { success, token } = await login(email, password);
    if (success) {
      localStorage.setItem("token", token);
    }
    return { success };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return { success: false, error: apiError.data.error };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}
export async function getCurrentUserUsecase(token: string): Promise<{
  success: boolean;
  error?: string;
  user?: User;
}> {
  try {
    const { success, data: user } = await getUser(token);
    return { success: true, user };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return { success: false, error: apiError?.data?.error ?? "" };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}
export async function getUserByIdUsecase(id: string): Promise<{
  success: boolean;
  error?: string;
  user?: any;
}> {
  try {
    const { data, success } = await getUserById(
      id,
      localStorage.getItem("token")!
    );
    return { success, user: data };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.data.error || "Failed to fetch user",
        user: null,
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
        user: null,
      };
    }
  }
}
export async function followUserUsecase(
  id: string,
  token: string
): Promise<{
  success: boolean;
  error?: string;
  data?: User;
}> {
  try {
    const { success: followSuccess, data } = await followUser(id, token);
    if (followSuccess) {
      return { success: true, data };
    } else {
      return { success: false, error: "Failed to follow user" };
    }
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.data.error || "Failed to fetch user",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
}

export async function unfollowUserUsecase(
  id: string,
  token: string
): Promise<{
  success: boolean;
  error?: string;
  data?: User;
}> {
  try {
    const { success: unfollowSuccess, data } = await unfollowUser(id, token);
    if (unfollowSuccess) {
      return { success: true, data };
    } else {
      return { success: false, error: "Failed to unfollow user" };
    }
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.data.error || "Failed to fetch user",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
}
export async function getSuggestedUsersUsecase(token: string): Promise<{
  success: boolean;
  error?: string;
  data?: User[];
}> {
  try {
    const { success, data } = await getSuggestedUsers(token!);
    return { success, data };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.data.error || "Failed to fetch user",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
}