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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import OthersProfileInfo from "@/components/profile/others-profile";

export default function ProfilePage() {
  const {
    getUserById,
    userById: user,
    followUser,
    isFollowingLoading,
    isUnfollowingLoading,
    unfollowUser,
    userByIdLoading,
  } = useAuthStore();
  const { setCommentsModalOpen, isCommentsModalOpen, deletePost, getComments } =
    usePostStore();
  const params: { id: string } = useParams();
  useEffect(() => {
    if (params.id) {
      getUserById(params.id);
    }
  }, [params]);
  return (
    <div className="bg-dark h-screen w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar />
        <div className="bg-muted/20 flex-1  flex flex-col  items-center overflow-x-hidden  remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
          <OthersProfileInfo
            isUnfollowingLoadin={isUnfollowingLoading}
            isFollowingLoading={isFollowingLoading}
            folowUser={followUser}
            unfollowUser={unfollowUser}
            user={user}
            isLoading={userByIdLoading}
          />
          <hr className="mb-10 w-full " />
          <Grid
            user={user}
            isLoading={userByIdLoading}
            deletePost={deletePost}
            setCommentsModalOpen={setCommentsModalOpen}
            isCommentsModalOpen={isCommentsModalOpen}
            getComments={getComments}
          />{" "}
        </div>
      </div>
    </div>
  );
}
