"use client";
import useAuthStore from "@/hooks/use-auth";
import { Archive, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { User } from "@/data-access/types";

interface ProfileInfoProps {
  user: User | null;
  isLoading: boolean;
}
const ProfileInfo: React.FC<ProfileInfoProps> = ({ isLoading, user }) => {
  const [isMounted, setMounted] = useState(true);
  useEffect(() => {
    setMounted(false);
  }, []);
  if (isLoading || isMounted) {
    return (
      <div className="animate-pulse">
        <div className="w-full">
          <div className="flex justify-center items-start gap-[3rem] mb-8 pt-10">
            <div className="flex items-center space-x-4">
              <div className="w-[150px] h-[150px] bg-gray-300 rounded-full" />
            </div>
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex space-x-2 gap-6">
                <div>
                  <div className="h-8 bg-gray-300 w-40 mb-2 rounded" />
                  <div className="h-4 bg-gray-300 w-32 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="lg"
                    disabled
                    className="bg-gray-300 text-transparent"
                  >
                    Edit profile
                  </Button>
                  <Button size="lg" disabled className="px-4 bg-gray-300">
                    <Archive size={20} className="text-gray-400" />
                  </Button>
                  <Button size="lg" disabled className="px-4 bg-gray-300">
                    <Settings size={20} className="text-gray-400" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-300 w-20 rounded" />
                </div>
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-300 w-20 rounded" />
                </div>
                <div className="flex flex-col">
                  <div className="h-4 bg-gray-300 w-20 rounded" />
                </div>
              </div>
              <div className="mb-8">
                <div className="h-4 bg-gray-300 w-full mb-2 rounded" />
                <div className="h-4 bg-gray-300 w-3/4 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className=" ">
      <div className="w-full">
        <div className="flex  justify-center items-start gap-[3rem] mb-8  pt-10">
          <div className="flex items-center space-x-4">
            <img
              src={user?.profilePicture ?? "https://placeholder.pics/svg/200"}
              alt="User Profile"
              width={150}
              height={150}
              className="rounded-full  border"
            />
          </div>
          <div className="flex flex-col gap-6 mt-4 ">
            <div className="flex space-x-2 gap-6">
              <div>
                <h1 className="text-2xl font-bold">{user?.username}</h1>
                <p className="text-muted-foreground">{user?.fullname}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size={"lg"}>Edit profile</Button>
                <Button size={"lg"} className="px-4">
                  <Archive size={20} />
                </Button>
                <Button size={"lg"} className="px-4">
                  <Settings size={20} />
                </Button>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="flex flex-col">
                <p>
                  <span className="font-semibold">{user?.posts?.length}</span>{" "}
                  Posts
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  <span className="font-semibold">114</span> Followers
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  <span className="font-semibold">189</span> Following
                </p>
              </div>
            </div>
            <div className="mb-8">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Nostrum.
              </p>
              <a
                href={`https://twitter.com/${user?.username}`}
                className="text-blue-400 hover:underline"
              >
                {`https://twitter.com/${user?.username}`}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;