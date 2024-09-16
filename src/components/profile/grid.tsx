"use client";
import useAuthStore from "@/hooks/use-auth";
import usePostStore from "@/hooks/use-post";
import CommentModal from "../posts/comments-modal";
import { useEffect, useState } from "react";
import NoPostsYet from "../posts/no-post";
import { User } from "@/data-access/types";

interface GridProps {
  user: User | null;
  isLoading: boolean;
  setCommentsModalOpen: (open: boolean) => void;
  isCommentsModalOpen: boolean;
  getComments: (id: string) => void;
  deletePost?: (id: string) => Promise<boolean>;
  isCommentDeleting: boolean;
  deleteComment: (id: string, commentId: string) => Promise<boolean>;
}
const Grid: React.FC<GridProps> = ({
  user,
  isLoading,
  setCommentsModalOpen,
  isCommentsModalOpen,
  deletePost,
  getComments,
  isCommentDeleting,
  deleteComment,
}) => {
  const [isMounted, setMounted] = useState(true);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setMounted(false);
  }, []);
  if (isLoading || isMounted) {
    return <SkeletalGrid />;
  }

  return (
    <div className="grid grid-cols-3 gap-1 w-full">
      {user?.posts?.map((post, i) => (
        <div
          key={i}
          className="min-h-[400px] aspect-[4/5] relative overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => {
            setCommentsModalOpen(true);
            setIndex(i);
            getComments(post._id);
          }}
        >
          <img
            src={post.image}
            sizes="(max-width: 639px) 33vw, (max-width: 1079px) 300px, 357px"
            alt={post.description}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
      <CommentModal
        post={user?.posts?.[index]}
        open={isCommentsModalOpen}
        onChange={() => setCommentsModalOpen!(!isCommentsModalOpen)}
        setOpenCommentsModal={setCommentsModalOpen}
        id={user?.posts?.[index]?._id!}
        description={user?.posts?.[index]?.description!}
        image={user?.posts?.[index]?.image!}
        likesCount={user?.posts?.[index]?.likesCount!}
        avatarUrl={user?.profilePicture ?? ""}
        username={user?.fullname ?? ""}
        deletePost={deletePost}
        user={user}
        deleteComment={deleteComment}
        isCommentDeleting={isCommentDeleting}
      />
    </div>
  );
};
export default Grid;
const SkeletalGrid: React.FC = () => {
  return (
    <div className="max-w-[1200px] w-full grid grid-cols-3 gap-1 pt-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-[350px] bg-gray-300 animate-pulse border border-white"
        ></div>
      ))}
    </div>
  );
};
