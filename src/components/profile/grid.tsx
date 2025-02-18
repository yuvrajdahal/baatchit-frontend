"use client";
import { Post, User } from "@/data-access/types";
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
  const [selectedPostIndex, setSelectPost] = useState<number | null>(null);
  const [selectedPost, setPost] = useState<Post | null>(null);

  if (isLoading||isPostsLoading) {
    return <SkeletalGrid />;
  }

  return (
    <div className="w-full">
      <div className="grid  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-1">
        {posts.map((post, index) => (
          <div
            key={index}
            className=" min-h-[400px] aspect-[4/5] relative overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => {
              setSelectPost(index);
              setPost(post);
              setCommentsModalOpen?.(true);
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
        {selectedPostIndex !== null && (
          <CommentModal
            post={selectedPost}
            open={isCommentsModalOpen}
            onChange={() => setCommentsModalOpen!(!isCommentsModalOpen)}
            setOpenCommentsModal={setCommentsModalOpen}
            id={selectedPost?._id!}
            description={selectedPost?.description!}
            image={selectedPost?.image!}
            likesCount={selectedPost?.likesCount!}
            avatarUrl={user?.profilePicture ?? ""}
            username={user?.fullname ?? ""}
            deletePost={deletePost}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

const SkeletalGrid = () => {
  return (
    <div className="grid  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-1">
      {[...Array(6)].map((_, i) => (
        <div key={i}
         className="aspect-[4/5] bg-gray-200  min-h-[400px]  animate-pulse"
          />
      ))}
    </div>
  );
};

export default Grid;
