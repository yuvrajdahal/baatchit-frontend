"use client";
import { User } from "@/data-access/types";
import { usePosts } from "@/hooks/use-post";
import CommentModal from "../posts/comments-modal";

interface GridProps {
  user?: User | null;
  isLoading?: boolean;
  deletePost?: (id: string) => void;
  setCommentsModalOpen?: (open: boolean) => void;
  isCommentsModalOpen?: boolean;
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
              handleComment?.(post._id);
            }}
          >
            <img
              src={post.image}
              alt={post.description}
              className="object-cover w-full h-full"
              loading="lazy"
            />
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
            />
          </div>
        ))}
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
