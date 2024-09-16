import { create } from "zustand";
import {
  getPostsUsecase,
  createPostUsecase,
  likePostUsecase,
  createCommentUsecase,
  getCommentsUsecase,
  deletePostUsecase,
  deleteCommentUsecase,
} from "@/use-cases/posts-usecase";
import { Comment, Post } from "@/data-access/types";
import { getCurrentUserUsecase } from "@/use-cases/auth-usecase";
import useAuthStore from "./use-auth";
import { Elsie_Swash_Caps } from "next/font/google";

interface PostState {
  posts: Post[];
  togglePostModal: boolean;
  isCommentsModalOpen: boolean;
  isCreatingPost: boolean;
  isLoading: boolean;
  error: string | null;
  isCommentDeleting: boolean;
  isPostDeletingLoading: boolean;
  comments: Comment[];
  isCreatingComment: boolean;
  isCommentsLoading: boolean;
  createComment: (message: string, postId: string) => Promise<boolean>;
  setTogglePostModal: (togglePostModal: boolean) => void;
  deleteComment: (id: string, commentId: string) => Promise<boolean>;
  setCommentsModalOpen: (isCommentsModalOpen: boolean) => void;
  fetchPosts: () => Promise<void>;
  createPost: (description: string, image: FormData) => Promise<boolean>;
  likePost: (id: string) => Promise<boolean>;
  getComments: (id: string) => Promise<void>;
  clearError: () => void;
  deletePost: (id: string) => Promise<boolean>;
}

const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  isCreatingPost: false,
  isCommentsModalOpen: false,
  isCommentsLoading: false,
  isPostDeletingLoading: false,
  isCommentDeleting: false,
  error: null,
  togglePostModal: false,
  comments: [],
  isCreatingComment: false,
  setTogglePostModal: (togglePostModal: boolean) => set({ togglePostModal }),
  setCommentsModalOpen: (isCommentsModalOpen: boolean) =>
    set({ isCommentsModalOpen }),
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getPostsUsecase();
      if (result.success && result.posts) {
        set({ posts: result.posts, isLoading: false });
      } else {
        set({
          error: result.error || "Failed to fetch posts",
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred while fetching posts",
        isLoading: false,
      });
    }
  },

  createPost: async (description: string, image: FormData) => {
    set({ isCreatingPost: true, error: null });
    try {
      const result = await createPostUsecase(description, image);
      if (result.success && result.post) {
        const user = await getCurrentUserUsecase(
          localStorage.getItem("token")!
        );
        const posts = await getPostsUsecase();
        if (user.success && user.user) {
          useAuthStore.getState().user = user.user;
        }
        if (posts.success && posts.posts) {
          get().posts = posts.posts;
        }
        set((state) => ({
          isCreatingPost: false,
        }));
        return true;
      } else {
        set({
          error: result.error || "Failed to create post",
          isCreatingPost: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred while creating the post",
        isCreatingPost: false,
      });
      return false;
    }
  },

  likePost: async (id: string) => {
    try {
      // Optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === id
            ? {
                ...post,
                likesCount: post.isLiked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
                isLiked: !post.isLiked,
              }
            : post
        ),
      }));

      const result = await likePostUsecase(id);

      if (result.success && result.data) {
        // Server confirmed update
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === id
              ? {
                  ...post,
                  likesCount: result.data!.likesCount,
                  isLiked: result.data!.message === "Post liked",
                }
              : post
          ),
        }));
        return true;
      } else {
        // Revert optimistic update
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === id
              ? {
                  ...post,
                  likesCount: post.isLiked
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                  isLiked: !post.isLiked,
                }
              : post
          ),
          error: result.error || "Failed to like post",
        }));
        return false;
      }
    } catch (error) {
      set({ error: "An unexpected error occurred while liking the post" });
      return false;
    }
  },
  createComment: async (message: string, postId: string) => {
    set({ isCreatingComment: true, error: null });
    try {
      const result = await createCommentUsecase(message, postId);
      if (result.success && result.comment) {
        set((state) => ({
          posts: get().posts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                comments: [...post.comments, result.comment],
              };
            }
            return post;
          }),

          comments: [...state.comments, result.comment],
          isCreatingComment: false,
        }));
        return true;
      } else {
        set({
          error: result.error || "Failed to create comment",
          isCreatingComment: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred while creating the comment",
        isCreatingComment: false,
      });
      return false;
    }
  },
  getComments: async (id: string) => {
    set({ isCommentsLoading: true, error: null });
    try {
      const result = await getCommentsUsecase(id);
      if (result.success && result.comments) {
        set({ comments: result.comments, isCommentsLoading: false });
      } else {
        set({
          error: result.error || "Failed to fetch comments",
          isCommentsLoading: false,
        });
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred while fetching comments",
        isCommentsLoading: false,
      });
    }
  },
  deletePost: async (id: string) => {
    set({ isPostDeletingLoading: true, error: null });
    try {
      const result = await deletePostUsecase(id);
      if (result.success) {
        useAuthStore.getState().user!.posts = useAuthStore
          .getState()
          .user?.posts?.filter((post) => post._id !== id);
        set((state) => ({
          posts: state.posts.filter((post) => post._id !== id),
          isPostDeletingLoading: false,
        }));
        return true;
      } else {
        set({
          error: result.error || "Failed to delete post",
          isPostDeletingLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred while deleting the post",
        isPostDeletingLoading: false,
      });
      return false;
    }
  },
  deleteComment: async (id: string, commentId: string) => {
    set({ isCommentDeleting: true, error: null });
    try {
      const result = await deleteCommentUsecase(id, commentId);
      if (result.success) {
        set((state) => ({
          posts: get().posts.map((post) => {
            return {
              ...post,
              comments: post.comments.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }),
          comments: state.comments.filter(
            (comment) => comment._id !== commentId
          ),
          isCommentDeleting: false,
        }));
        return true;
      } else {
        set({
          error: result.error || "Failed to delete comment",
          isCommentDeleting: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred while deleting the comment",
        isCommentDeleting: false,
      });
      return false;
    }
  },
  clearError: () => set({ error: null }),
}));

export default usePostStore;
