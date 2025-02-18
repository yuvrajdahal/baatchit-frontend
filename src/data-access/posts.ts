import exp from "constants";
import { Comment, Post, User } from "./types";
import Api, { ApiError, asyncHandler } from "@/lib/axios";
const api = new Api();

export async function createPost(
  description: string,
  image: string,
  imageid: string,
  token: string
): Promise<{
  success: boolean;
  data: Post;
}> {
  return asyncHandler(() =>
    api.post<{ success: boolean; data: Post }>(
      "/posts/create",
      {
        description,
        image,
        imageid,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
}
export async function uploadImage(
  file: FormData,
  token: string
): Promise<{
  success: boolean;
  data: {
    url: string;
    id: string;
  };
}> {
  return asyncHandler(() =>
    api.post<{
      success: boolean;
      data: {
        url: string;
        id: string;
      };
    }>("/posts/upload", file, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
  );
}
export async function getPosts(token: string): Promise<{
  success: boolean;
  data: Post[];
  total: number;
  count: number;
}> {
  return asyncHandler(() =>
    api.get<{
      success: boolean;
      data: Post[];
      total: number;
      count: number;
    }>("/posts/recommended", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
export async function likePost(
  id: string,
  token: string
): Promise<{
  success: true;
  message: string;
  data: {
    likesCount: number;
    links: User[];
  };
}> {
  return asyncHandler(async () =>
    api.post<{
      success: true;
      message: string;
      data: {
        likesCount: number;
        links: User[];
      };
    }>(
      "/posts/like",
      {
        id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
}
export async function createComment(
  message: string,
  postId: string,
  token: string
): Promise<{
  success: boolean;
  data: Comment;
}> {
  return asyncHandler(() =>
    api.post<{
      success: boolean;
      data: Comment;
    }>(
      "/posts/comments/create",
      {
        message,
        postId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
}

export async function getComments(
  id: string,
  token: string
): Promise<{
  success: boolean;
  data: Comment[];
}> {
  return asyncHandler(() =>
    api.get<{
      success: boolean;
      data: Comment[];
      // router.route("/comments/:id").get(checkAuth, getComments);
    }>(`/posts/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export async function deletePost(
  id: string,
  token: string
): Promise<{
  success: boolean;
  data: {};
}> {
  return asyncHandler(() =>
    api.delete<{
      success: boolean;
      data: {};
    }>(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
export async function deleteComment(
  id: string,
  commentId: string,
  token: string
): Promise<{
  success: boolean;
  data: {};
}> {
  return asyncHandler(() =>
    api.delete<{
      success: boolean;
      data: {};
    }>(`/posts/${id}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
