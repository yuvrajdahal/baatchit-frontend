import { create } from "zustand";
import {
  getPostsUsecase,
  createPostUsecase,
  likePostUsecase,
  createCommentUsecase,
  getCommentsUsecase,
} from "@/use-cases/posts-usecase";
import { Comment, Post } from "@/data-access/types";

interface PostState {
  posts: Post[];
  togglePostModal: boolean;
  isCommentsModalOpen: boolean;
  isCreatingPost: boolean;
  isLoading: boolean;
  error: string | null;
  comments: Comment[];
  isCreatingComment: boolean;
  isCommentsLoading: boolean;
  createComment: (message: string, postId: string) => Promise<boolean>;
  setTogglePostModal: (togglePostModal: boolean) => void;
  setCommentsModalOpen: (isCommentsModalOpen: boolean) => void;
  fetchPosts: () => Promise<void>;
  createPost: (description: string, image: FormData) => Promise<boolean>;
  likePost: (id: string) => Promise<boolean>;
  getComments: (id: string) => Promise<void>;
  clearError: () => void;
}

const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  isCreatingPost: false,
  isCommentsModalOpen: false,
  isCommentsLoading: false,
  error: null,
  setTogglePostModal: (togglePostModal: boolean) => set({ togglePostModal }),
  setCommentsModalOpen: (isCommentsModalOpen: boolean) =>
    set({ isCommentsModalOpen }),
  togglePostModal: false,
  comments: [],
  isCreatingComment: false,
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
        set((state) => ({
          posts: [result.post, ...state.posts],
          isCreatingPost: false,
        }));
        get().fetchPosts();
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
  clearError: () => set({ error: null }),
}));

export default usePostStore;