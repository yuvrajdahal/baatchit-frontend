"use client";
import useAuthStore from "@/hooks/use-auth";
import usePostStore from "@/hooks/use-post";
import CommentModal from "../posts/comments-modal";
import { useEffect, useState } from "react";
import NoPostsYet from "../posts/no-post";

const Grid: React.FC = () => {
  const { user, isLoading } = useAuthStore();
  const { setCommentsModalOpen, isCommentsModalOpen, getComments } =
    usePostStore();
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
      {user?.posts?.length === 0 && (
        <div className="col-span-3  w-full flex flex-col justify-center">
          <hr/>
          <span className="mt-4 text-center text-lg text-center text-muted-foreground">
            No Posts Yet
          </span>
        </div>
      )}
      <CommentModal
        open={isCommentsModalOpen}
        onChange={() => setCommentsModalOpen!(!isCommentsModalOpen)}
        setOpenCommentsModal={setCommentsModalOpen}
        id={user?.posts?.[index]?._id!}
        description={user?.posts?.[index]?.description!}
        image={user?.posts?.[index]?.image!}
        likesCount={user?.posts?.[index]?.likesCount!}
        avatarUrl={user?.profilePicture ?? ""}
        username={user?.fullname ?? ""}
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
