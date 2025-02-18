"use client";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useComments,
  useDeleteComment,
  useDeletePost,
  useExplorePosts,
} from "@/hooks/use-post";
import { useEffect, useState } from "react";
import ImageModal from "./image-modal";

const ImageList = () => {
  const { data: userData } = useCurrentUser();
  const [isMounted, setMounted] = useState(true);
  const [index, setIndex] = useState(0);
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);

  const { data: postsData, isLoading } = useExplorePosts();

  const posts = postsData?.posts || [];

  useEffect(() => {
    setMounted(false);
  }, []);

  if (isLoading || isMounted) {
    return <SkeletalGrid />;
  }


  function selectNext() {
    const nextIndex = (index + 1) % posts.length;
    setIndex(nextIndex);
  }

  function selectPrev() {
    const prevIndex = index - 1 < 0 ? posts.length - 1 : index - 1;
    setIndex(prevIndex);
  }

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 w-full">
        {posts?.map((post, i) => (
          <>
            <div
              key={i}
              className="min-h-[200px] md:min-h-[400px] aspect-[4/5] relative overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => {
                setCommentsModalOpen(true);
                setIndex(i);
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
          </>
        ))}
        <ImageModal
          modal={isCommentsModalOpen}
          open={isCommentsModalOpen}
          onChange={() => setCommentsModalOpen((prev) => !prev)}
          selectNext={selectNext}
          setOpenCommentsModal={setCommentsModalOpen}
          selectPrev={selectPrev}
          showLeftIcon={index > 0}
          showRightIcon={index < posts.length - 1}
          post={posts[index]}
          currentUser={userData?.user!}
        />
      </div>
    </div>
  );
};

export default ImageList;

const SkeletalGrid: React.FC = () => {
  return (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 w-full">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-[450px] bg-gray-300 animate-pulse border border-white"
        ></div>
      ))}
    </div>
  );
};
