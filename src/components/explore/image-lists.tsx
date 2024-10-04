"use client";

import useAuthStore from "@/hooks/use-auth";
import Grid from "../profile/grid";
import usePostStore from "@/hooks/use-post";
import CommentModal from "../posts/comments-modal";
import { useEffect, useState } from "react";
import ImageModal from "./image-modal";

const ImageList = () => {
  const {
    getUserById,
    user,
    followUser,
    isFollowingLoading,
    isUnfollowingLoading,
    unfollowUser,
    userByIdLoading,
  } = useAuthStore();
  const {
    setCommentsModalOpen,
    isCommentsModalOpen,
    isLoading,
    deletePost,
    isCommentsLoading,
    comments,
    deleteComment,
    isCommentDeleting,
    getComments,
    posts,
    fetchPosts,
    clearComments,
  } = usePostStore();
  const [isMounted, setMounted] = useState(true);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setMounted(false);
    fetchPosts();
  }, []);
  if (isLoading || isMounted) {
    return <SkeletalGrid />;
  }

  async function handleGetComments(id: string) {
    await getComments(id);
  }
  function selectNext(id:string) {
    setIndex((prev) => (prev + 1) % posts?.length);
    clearComments();
    handleGetComments(id);
  }
  function selectPrev(id:string) {
    setIndex((prev) => (prev - 1) % posts?.length);
    clearComments();
    handleGetComments(id);
  }

  return (
    <div className=" w-full">
      <div className="grid grid-cols-3 gap-1 w-full">
        {posts?.map((post, i) => (
          <>
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
            <ImageModal
              modal={isCommentsModalOpen}
              open={isCommentsModalOpen}
              onChange={() => {
                setCommentsModalOpen(false);
              }}
              comments={comments}
              isCommentsLoading={isCommentsLoading}
              deleteComment={deleteComment}
              isCommentDeleting={isCommentDeleting}
              selectNext={() => {
                const nextIndex = (index + 1) % posts?.length;
                selectNext(posts[nextIndex]?._id);
              }}
              selectPrev={()=>{
                const prevIndex = (index - 1) % posts?.length;
                selectPrev(posts[prevIndex]?._id);
              }}
              showLeftIcon={index > 0}
              showRightIcon={index < posts?.length - 1}
              deletePost={deletePost}
              post={posts[index]}
              currentUser={user}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default ImageList;
const SkeletalGrid: React.FC = () => {
  return (
    <div className="max-w-[1200px] w-full grid grid-cols-3 gap-1 pt-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-[450px] bg-gray-300 animate-pulse border border-white"
        ></div>
      ))}
    </div>
  );
};
