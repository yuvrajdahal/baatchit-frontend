import { login, signup, getUser } from "@/data-access/auth";
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
