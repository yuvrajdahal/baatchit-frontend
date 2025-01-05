"use client";
import Sidebar from "@/components/home/sidebar";
import { useCurrentUser } from "@/hooks/use-auth";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function ArchivePage() {
  const { data: userData } = useCurrentUser();
  const router = useRouter();
  return (
    <div className="bg-dark h-[100dvh] w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar user={userData?.user!} />
        <div className="bg-muted/20 flex-1  flex flex-col   overflow-x-hidden  remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
          <div className="flex items-center gap-4 text-lg">
            <span
              className="flex  items-center gap-2 cursor-pointer"
              onClick={() => {
                router.push("/profile");
              }}
            >
              <ArrowLeft /> Archive
            </span>
          </div>
          <hr className="w-full mt-10" />
          <p className="text-sm py-6 self-start text-muted-foreground">
            Only you can see your archived stories here.
          </p>
          <div className="self-start">
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
