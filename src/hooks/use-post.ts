import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostsUsecase,
  createPostUsecase,
  likePostUsecase,
  createCommentUsecase,
  getCommentsUsecase,
  deletePostUsecase,
  deleteCommentUsecase,
  getExplorePostsUsecase,
} from "@/use-cases/posts-usecase";
import { Post } from "@/data-access/types";
import { create } from "zustand";

export const usePosts = () => {
  return useQuery<
    {
      success: boolean;
      error?: string;
      posts: Post[];
    },
    Error
  >({
    queryKey: ["posts"],
    queryFn: async () => {
      const data = await getPostsUsecase(localStorage.getItem("token")!);
      return {
        ...data,
        posts: data.posts ?? [],
      };
    },
  });
};
export const useExplorePosts = () => {
  return useQuery<
    {
      success: boolean;
      error?: string;
      posts: Post[];
    },
    Error
  >({
    queryKey: ["recommended"],
    queryFn: async () => {
      const data = await getExplorePostsUsecase(localStorage.getItem("token")!);
      return {
        ...data,
        posts: data.posts ?? [],
      };
    },
  });
};

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsUsecase(postId, localStorage.getItem("token")!),
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      description,
      image,
    }: {
      description: string;
      image: FormData;
    }) => createPostUsecase(description, image, localStorage.getItem("token")!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      likePostUsecase(postId, localStorage.getItem("token")!),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => ({
        ...old,
        posts: old.posts.map((post: any) =>
          post._id === postId
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

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ message, postId }: { message: string; postId: string }) =>
      createCommentUsecase(message, postId, localStorage.getItem("token")!),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deletePostUsecase(id, localStorage.getItem("token")!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) =>
      deleteCommentUsecase(postId, commentId, localStorage.getItem("token")!),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

interface PostState {
  togglePostModal: boolean;
  setTogglePostModal: (togglePostModal: boolean) => void;
}

const usePostStore = create<PostState>((set, get) => ({
  togglePostModal: false,
  setTogglePostModal: (togglePostModal: boolean) => set({ togglePostModal }),
}));

export default usePostStore;
