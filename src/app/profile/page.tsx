"use client";
import Sidebar from "@/components/home/sidebar";
import useAuthStore from "@/hooks/use-auth";
import Grid from "@/components/profile/grid";
import ProfileInfo from "@/components/profile/profile-info";
import { useEffect } from "react";
import usePostStore from "@/hooks/use-post";

export default function ProfilePage() {
  const { refreshUser, user, isLoading } = useAuthStore();
  const { setCommentsModalOpen, isCommentsModalOpen, deletePost, getComments } =
    usePostStore();
  useEffect(() => {
    refreshUser();
  }, []);
  return (
    <div className="bg-dark h-screen w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar />
        <div className="bg-muted/20 flex-1  flex flex-col  items-center overflow-x-hidden  remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
          <ProfileInfo user={user} isLoading={isLoading} />
          <Grid
            deletePost={deletePost}
            user={user}
            isLoading={isLoading}
            setCommentsModalOpen={setCommentsModalOpen}
            isCommentsModalOpen={isCommentsModalOpen}
            getComments={getComments}
          />
        </div>
      </div>
    </div>
  );
}
