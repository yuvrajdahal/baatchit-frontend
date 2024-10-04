"use client";
import Sidebar from "@/components/home/sidebar";
import UserTile from "@/components/home/tiles/user-tile";
import { ChevronDown, FilePlus2 } from "lucide-react";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InboxPage() {
  const { getUsersByUserName, usersByUserName, user } = useAuthStore();
  useEffect(() => {
    getUsersByUserName("d");
  }, []);
  const router = useRouter();
  return (
    <div className="bg-dark h-screen w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar />
        <div className="w-[400px] border py-4 gap-y-4  h-full overflow-y-scroll overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer px-5 mb-4 mt-4">
              <div className="font-semibold ">{user?.username}</div>
              <ChevronDown />{" "}
            </div>
            <div>
              <FilePlus2 className=" text-gray-600 cursor-pointer" />
            </div>
          </div>
          {usersByUserName.map((u, i) => (
            <UserTile user={u} key={i} router={router} />
          ))}
        </div>
        <div className="bg-muted/20 flex-1  flex flex-col  items-center overflow-x-hidden  remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6"></div>
      </div>
    </div>
  );
}
