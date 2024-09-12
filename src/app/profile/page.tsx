"use client";
import Sidebar from "@/components/home/sidebar";
import Suggestion from "@/components/home/suggetstion";
import ListPosts from "@/components/home/list-posts";
import useAuthStore from "@/hooks/use-auth";
import Grid from "@/components/profile/grid";
import ProfileInfo from "@/components/profile/profile-info";
import Loading from "@/components/loading";
import { useEffect } from "react";
import usePostStore from "@/hooks/use-post";

export default function ProfilePage() {
  const { refreshUser, user, isLoading } = useAuthStore();
  const { setCommentsModalOpen, isCommentsModalOpen, getComments } =
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