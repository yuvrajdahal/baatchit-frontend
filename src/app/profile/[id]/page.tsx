"use client";
import Sidebar from "@/components/home/sidebar";
import Grid from "@/components/profile/grid";
import OthersProfileInfo from "@/components/profile/others-profile";
import { useUserById } from "@/hooks/use-auth";
import {useDeletePost } from "@/hooks/use-post";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const params: { id: string } = useParams();
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const { data: user, isLoading: userByIdLoading } = useUserById(params.id);
  const { mutate: deletePost } = useDeletePost();
  // const handleCommentsModal = (postId: string) => {
  //   setSelectedPostId(postId);
  //   setCommentsModalOpen(true);
  // };

  return (
    <div className="bg-dark h-[100dvh] w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar  />
        <div className="bg-muted/20 flex-1 flex flex-col items-center overflow-x-hidden remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
          <OthersProfileInfo
            user={user?.user || null}
            isLoading={userByIdLoading}
          />
          <hr className="mb-10 w-full " />
          <Grid
            user={user?.user || null}
            isLoading={userByIdLoading}
            deletePost={deletePost}
            setCommentsModalOpen={setCommentsModalOpen}
            isCommentsModalOpen={commentsModalOpen}
          />
        </div>
      </div>
    </div>
  );
}
