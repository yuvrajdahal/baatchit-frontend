"use client";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useComments,
  useDeleteComment,
  useDeletePost,
  usePosts,
} from "@/hooks/use-post";
import { useEffect, useState } from "react";
import ImageModal from "./image-modal";

const ImageList = () => {
  const { data: userData } = useCurrentUser();
  const [isMounted, setMounted] = useState(true);
  const [index, setIndex] = useState(0);
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");

  // React Query hooks
  const { data: postsData, isLoading } = usePosts();
  const { data: commentsData, isLoading: isCommentsLoading } =
    useComments(selectedPostId);
  const { mutate: deletePostMutation } = useDeletePost();
  const { mutate: deleteCommentMutation, isPending: isCommentDeleting } =
    useDeleteComment();

  const posts = postsData?.posts || [];
  const comments = commentsData?.comments || [];

  useEffect(() => {
    setMounted(false);
  }, []);

  if (isLoading || isMounted) {
    return <SkeletalGrid />;
  }

  function handleGetComments(id: string) {
    setSelectedPostId(id);
  }

  function selectNext() {
    const nextIndex = (index + 1) % posts.length;
    setIndex(nextIndex);
    handleGetComments(posts[nextIndex]._id);
  }

  function selectPrev() {
    const prevIndex = index - 1 < 0 ? posts.length - 1 : index - 1;
    setIndex(prevIndex);
    handleGetComments(posts[prevIndex]._id);
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 w-full">
        {posts?.map((post, i) => (
          <>
            <div
              key={i}
              className="md:min-h-[400px] aspect-[4/5] relative overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => {
                setCommentsModalOpen(true);
                setIndex(i);
                handleGetComments(post._id);
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
              onChange={() => setCommentsModalOpen(false)}
              selectNext={selectNext}
              selectPrev={selectPrev}
              showLeftIcon={index > 0}
              showRightIcon={index < posts.length - 1}
              post={posts[index]}
              currentUser={userData?.user!}
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
