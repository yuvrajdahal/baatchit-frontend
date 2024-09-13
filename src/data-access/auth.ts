import { User } from "./types";
import Api, { ApiError, asyncHandler } from "@/lib/axios";
const api = new Api();
export function signup(
  email: string,
  fullname: string,
  username: string,
  password: string
) {
  return new Promise<{
    success: boolean;
    token: string;
  }>((resolve, reject) => {
    api
      .post<{
        success: boolean;
        token: string;
      }>("/auth/register", {
        email: email,
        fullname: fullname,
        username: username,
        password: password,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function login(
  email: string,
  password: string
): Promise<{
  success: boolean;
  token: string;
}> {
  return asyncHandler(() =>
    api.post<{ success: boolean; token: string }>(
      "/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    )
  );
}

export async function getUser(
  token: string
): Promise<{ success: boolean; data: User }> {
  return asyncHandler(() =>
    api.get<{
      success: boolean;
      data: User;
    }>("/auth/current_user", {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}
export async function getUserById(
  id: string,
  token: string
): Promise<{ success: boolean; data: User }> {
  return asyncHandler(() =>
    api.get<{
      success: boolean;
      data: User;
    }>(`/auth/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function followUser(
  userId: string,
  token: string
): Promise<{ success: boolean; data: User }> {
  return asyncHandler(() =>
    api.post<{
      success: boolean;
      data: User;
    }>(
      `/auth/follow/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
}

export async function unfollowUser(
  userId: string,
  token: string
): Promise<{ success: boolean; data: User }> {
  return asyncHandler(() =>
    api.post<{
      success: boolean;
      data: User;
    }>(
      `/auth/unfollow/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
}
export async function getSuggestedUsers(
  token: string
): Promise<{ success: boolean; data: User[] }> {
  return asyncHandler(() =>
    api.get<{
      success: boolean;
      data: User[];
    }>("/auth/suggested_friends", {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}
