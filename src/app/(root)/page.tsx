"use client";
import Sidebar from "@/components/home/sidebar";
import Suggestion from "@/components/home/suggetstion";
import ListPosts from "@/components/home/list-posts";
import { Suspense } from "react";
import AuthProvider from "@/providers/auth-provider";
import { useCurrentUser } from "@/hooks/use-auth";

export default async function Home() {
  const { data: userData, isPending: userLoading } = useCurrentUser();
  return (
    <AuthProvider>
      <div className="bg-dark h-screen w-screen text-light ">
        <div className="h-full w-full flex justify-between">
          <Sidebar user={userData?.user!} />
          <div className="bg-muted/20 flex-1 snap-y snap-mandatory flex flex-col  items-center overflow-hidden overflow-y-scroll remove-scrollbar transition-all duration-300 ease-in-out">
            <ListPosts user={userData?.user!} />
          </div>
          <Suggestion user={userData?.user!} userLoading={userLoading} />
        </div>
      </div>
    </AuthProvider>
  );
}
