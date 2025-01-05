"use client";
import { useEffect, useState } from "react";
import InstagramPost from "../posts/IPost";
import { Post, User } from "@/data-access/types";
import { useToast } from "@/hooks/use-toast";
import PostSkeleton from "../posts/skeletal-iposts";
import NoPostsYet from "../posts/no-post";
import CommentModal from "../posts/comments-modal";
import { useCreateComment, useLikePost, usePosts } from "@/hooks/use-post";
import { useCurrentUser } from "@/hooks/use-auth";

const ListPosts: React.FC<{
  user: User | null;
}> = ({ user }) => {
  const [isMounted, setMounted] = useState(true);
  const [index, setIndex] = useState(0);
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);
  const { toast } = useToast();
  const { data: postsData, isLoading, error } = usePosts();
  const { mutate: likeMutation } = useLikePost();
  const { mutate: createCommentMutation, isPending: isCreatingComment } =
    useCreateComment();

  const posts = postsData?.posts || [];

  useEffect(() => {
    setMounted(false);
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isMounted || isLoading)
    return [...Array(5)].map((_, i) => {
      return <PostSkeleton key={i} />;
    });
  return (
    <>
      {posts.map((post, i) => (
        <div
          className="snap-center flex-shrink-0 h-full flex flex-col justify-center items-center"
          key={i}
          onClick={() => setIndex(i)}
        >
          <InstagramPost
            createComment={(message, postId) =>
              createCommentMutation({ message, postId })
            }
            isCreatingComment={isCreatingComment}
            post={post}
            handleComment={() => setCommentsModalOpen(true)}
            likePost={(id) => likeMutation(id)}
            user={user}
            isCommentsModalOpen={isCommentsModalOpen}
            setCommentsModalOpen={setCommentsModalOpen}
          />
        </div>
      ))}

      {posts.length === 0 && <NoPostsYet />}

      {posts[index] && (
        <CommentModal
          open={isCommentsModalOpen}
          onChange={() => setCommentsModalOpen(!isCommentsModalOpen)}
          setOpenCommentsModal={setCommentsModalOpen}
          id={posts[index]._id}
          post={posts[index]}
          description={posts[index].description}
          image={posts[index].image}
          likesCount={posts[index].likesCount}
          avatarUrl={posts[index].user?.profilePicture ?? ""}
          username={posts[index].user.username ?? ""}
          user={user}
        />
      )}
    </>
  );
};

export default ListPosts;
