import Sidebar from "@/components/home/sidebar";
import Suggestion from "@/components/home/suggetstion";
import ListPosts from "@/components/home/list-posts";
import useAuthStore from "@/hooks/use-auth";
import { Suspense, useEffect } from "react";
import Grid from "@/components/profile/grid";
import ProfileInfo from "@/components/profile/profile-info";
import Loading from "@/components/loading";

export default function ProfilePage() {
  return (
    <div className="bg-dark h-screen w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar />
        <div className="bg-muted/20 flex-1  flex flex-col  items-center overflow-x-hidden  remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
            <ProfileInfo />
            <Grid />
        </div>
      </div>
    </div>
  );
}
