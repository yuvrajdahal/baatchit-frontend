import { getUserById } from "@/data-access/auth";
import {
  createComment,
  createPost,
  getComments,
  getPosts,
  likePost,
  uploadImage,
} from "@/data-access/posts";
import { Comment, User } from "@/data-access/types";
import { ApiError } from "@/lib/axios";

export async function createPostUsecase(
  description: string,
  image: FormData
): Promise<{
  success?: boolean;
  error?: string;
  post?: any;
}> {
  try {
    const { data, success: uploadSuccess } = await uploadImage(
      image,
      localStorage.getItem("token")!
    );
    console.log(data);
    if (uploadSuccess) {
      console.log(data);
      const { success, data: post } = await createPost(
        description,
        data.url,
        data.id,
        localStorage.getItem("token")!
      );
      return { success, post };
    }
    return { success: false, error: "An unexpected error occurred" };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return { success: false, error: apiError.data.error };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}

export async function getPostsUsecase(): Promise<{
  success: boolean;
  error?: string;
  posts?: any;
}> {
  try {
    const { data, success } = await getPosts(localStorage.getItem("token")!);
    return { success, posts: data };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.data.error || "Failed to fetch posts",
        posts: [],
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
        posts: [],
      };
    }
  }
}
export async function likePostUsecase(id: string): Promise<{
  success: boolean;
  error?: string;
  data?: {
    likesCount: number;
    links: User[];
    message: string;
  };
}> {
  try {
    const { success, data, message } = await likePost(
      id,
      localStorage.getItem("token")!
    );
    return {
      success,
      data: {
        likesCount: data.likesCount,
        links: data.links,
        message: message,
      },
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

export async function createCommentUsecase(
  message: string,
  postId: string
): Promise<{
  success?: boolean;
  error?: string;
  comment?: any;
}> {
  try {
    const { success, data } = await createComment(
      message,
      postId,
      localStorage.getItem("token")!
    );
    return { success, comment: data };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return { success: false, error: apiError.data.error };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}
export async function getCommentsUsecase(id: string): Promise<{
  success: boolean;
  error?: string;
  comments?: any;
}> {
  try {
    const { data, success } = await getComments(
      id,
      localStorage.getItem("token")!
    );
    return { success, comments: data };
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.data.error || "Failed to fetch comments",
        comments: [],
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
        comments: [],
      };
    }
  }
}
