"use client";
import ImageModal from "@/components/explore/image-modal";
import Sidebar from "@/components/home/sidebar";
import Grid from "@/components/profile/grid";
import ProfileInfo from "@/components/profile/profile-info";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDeleteComment, useDeletePost } from "@/hooks/use-post";
import { useState } from "react";

export default function ProfilePage() {
  const { data: userData, isLoading: isUserLoading } = useCurrentUser();
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");

  const { mutate: deletePostMutation } = useDeletePost();
  const { mutate: deleteCommentMutation, isPending: isCommentDeleting } =
    useDeleteComment();

  const user = userData?.user;


  return (
    <div className="bg-dark h-screen w-screen text-light">
      <div className="h-full w-full flex justify-between">
        <Sidebar user={user!} />
        <div className="bg-muted/20 flex-1 flex flex-col items-center overflow-x-hidden remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
          <ProfileInfo user={user!} isLoading={isUserLoading} />
          <hr className="mb-10 w-full" />
          <Grid
            user={user}
            isLoading={isUserLoading}
            deletePost={(id) => deletePostMutation(id)}
            setCommentsModalOpen={setCommentsModalOpen}
            isCommentsModalOpen={isCommentsModalOpen}
            handleComment={(id) => setSelectedPostId(id)}
          />
        </div>
      </div>
     
    </div>
  );
}
