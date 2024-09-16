"use client";
import { useEffect, useState } from "react";
import InstagramPost from "../posts/IPost";
import { Post } from "@/data-access/types";
import usePostStore from "@/hooks/use-post";
import { useToast } from "@/hooks/use-toast";
import PostSkeleton from "../posts/skeletal-iposts";
import NoPostsYet from "../posts/no-post";
import CommentModal from "../posts/comments-modal";
import useAuthStore from "@/hooks/use-auth";
const ListPosts: React.FC = () => {
  const [isMounted, setMounted] = useState(true);
  const [index, setIndex] = useState(0);
  const { toast } = useToast();
  const {
    posts,
    error,
    fetchPosts,
    likePost,
    isLoading,
    createComment,
    isCreatingComment,
    isCommentsModalOpen,
    getComments,
    setCommentsModalOpen,
    deletePost,
    isCommentDeleting,
    deleteComment,
    isPostDeletingLoading,
  } = usePostStore();
  const { user } = useAuthStore();
  useEffect(() => {
    setMounted(false);
    fetchPosts();
  }, []);
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  if (isMounted || isLoading)
    return [...Array(5)].map((_, i) => {
      return <PostSkeleton key={i} />;
    });
  function handleComment(id: string) {
    getComments(id);
  }
  return (
    <>
      {posts.map((post, i) => {
        return (
          <div
            className="snap-center flex-shrink-0 h-full flex flex-col justify-center items-center"
            key={i}
            onClick={() => {
              setIndex(i);
            }}
          >
            <InstagramPost
              createComment={createComment}
              isCreatingComment={isCreatingComment}
              post={post}
              handleComment={handleComment}
              likePost={likePost}
              user={user}
              isCommentsModalOpen={isCommentsModalOpen}
              setCommentsModalOpen={setCommentsModalOpen}
              isPostDeletingLoading={isPostDeletingLoading}
              deletePost={deletePost}
            />
          </div>
        );
      })}

      {posts.length === 0 && <NoPostsYet />}
      <CommentModal
        open={isCommentsModalOpen}
        onChange={() => setCommentsModalOpen!(!isCommentsModalOpen)}
        setOpenCommentsModal={setCommentsModalOpen}
        id={posts[index]?._id}
        post={posts[index]}
        description={posts[index]?.description!}
        image={posts[index]?.image!}
        likesCount={posts[index]?.likesCount!}
        avatarUrl={posts[index]?.user?.profilePicture ?? ""}
        username={posts[index]?.user.username ?? ""}
        user={user}
        deletePost={deletePost}
      />
    </>
  );
};
export default ListPosts;
const postsdata: Post[] = [
  {
    _id: "60c7b8d8c9b4d1d6c0b0",
    createdAt: new Date(),
    comments: [],
    description: "6ft Aesthetics ✨",
    image: "https://placeholder.pics/svg/1080",
    imageid: "60c7b8d8c9b4d1d6c0b0",
    isLiked: false,
    likesCount: 0,
    links: [],
    user: {
      _id: "60c7b8d8c9b4d1d6c0b0",
      createdAt: new Date(),
      email: "",
      emailToken: "",
      fullname: "mihirlifts",
      followers: [],
      following: [],
      isFollowing: false,
      isVerified: false,
      password: "",
      profilePicture: "https://placeholder.pics/svg/200",
      username: "mihirlifts",
    },
  },
];
