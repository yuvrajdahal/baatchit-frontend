"use client";
import { User } from "@/data-access/types";
import { usePosts } from "@/hooks/use-post";
import CommentModal from "../posts/comments-modal";
import { useState } from "react";

interface GridProps {
  user?: User | null;
  isLoading?: boolean;
  deletePost?: (id: string) => void;
  setCommentsModalOpen?: (open: boolean) => void;
  isCommentsModalOpen?: boolean;
  selectedPostId?: string | null;
  handleComment?: (id: string) => void;
}

const Grid: React.FC<GridProps> = ({
  user,
  isLoading,
  deletePost,
  setCommentsModalOpen,
  isCommentsModalOpen,
  handleComment,
}) => {
  const { data: postsData, isLoading: isPostsLoading } = usePosts();
  const posts =
    postsData?.posts.filter((post) => post.user._id === user?._id) || [];
  const [selectPost, setSelectPost] = useState<number>(0);
  if (isLoading || isPostsLoading) {
    return <SkeletalGrid />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post, index) => (
          <div
            key={index}
            className="min-h-[400px] aspect-[4/5] relative overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => {
              setCommentsModalOpen?.(true);
              setSelectPost(index);
            }}
          >
            <img
              src={post.image}
              alt={post.description}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        ))}
        <CommentModal
          post={user?.posts?.[selectPost]}
          open={isCommentsModalOpen}
          onChange={() => setCommentsModalOpen!(!isCommentsModalOpen)}
          setOpenCommentsModal={setCommentsModalOpen}
          id={user?.posts?.[selectPost]?._id!}
          description={user?.posts?.[selectPost]?.description!}
          image={user?.posts?.[selectPost]?.image!}
          likesCount={user?.posts?.[selectPost]?.likesCount!}
          avatarUrl={user?.profilePicture ?? ""}
          username={user?.fullname ?? ""}
          deletePost={deletePost}
          user={user}
        />
      </div>
    </div>
  );
};

const SkeletalGrid = () => {
  return (
    <div className="w-full grid grid-cols-3 gap-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
      ))}
    </div>
  );
};

export default Grid;
