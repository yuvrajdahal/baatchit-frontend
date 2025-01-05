"use client";
import { User } from "@/data-access/types";
import useToggleStore from "@/hooks/use-toggle";
import { Archive, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ProfileInfoProps {
  user: User | null;
  isLoading: boolean;
}
const ProfileInfo: React.FC<ProfileInfoProps> = ({ isLoading, user }) => {
  const [isMounted, setMounted] = useState(true);
  const { setToggleSettingsModal } = useToggleStore();
  const router = useRouter();
  useEffect(() => {
    setMounted(false);
  }, []);
  if (isLoading || isMounted) {
    return (
      <div className="animate-pulse">
        <div className="w-full">
          <div className="flex justify-center items-start gap-[3rem] pt-10">
            <div className="flex items-center space-x-4">
              <div className="w-[150px] h-[150px] bg-gray-300 rounded-full" />
            </div>
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex space-x-2 gap-6">
                <div>
                  <div className="h-8 bg-gray-300 w-40 mb-2 rounded" />
                  <div className="h-4 bg-gray-300 w-32 rounded" />
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-10 bg-gray-300 w-[100px]  rounded" />

                  <div className="h-10 bg-gray-300 w-[40px]  rounded" />
                  <div className="h-10 bg-gray-300 w-[40px]  rounded" />
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
    <div className=" w-full">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-[1.5rem] md:gap-[3rem]  pt-10">
          <div className="flex items-center space-x-4 bg-">
            <img
              src={user?.profilePicture ?? "https://placeholder.pics/svg/200"}
              alt="User Profile"
              width={150}
              height={150}
              className="rounded-full  border"
            />
          </div>
          <div className="flex flex-col gap-6  md:mt-4 ">
            <div className="flex flex-col justify-center md:justify-start md:flex-row space-x-2 gap-6">
              <div className="flex flex-col justify-center items-center md:items-start">
                <h1 className="text-2xl font-bold">{user?.username}</h1>
                <p className="text-muted-foreground">{user?.fullname}</p>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Button size={"lg"}
                onClick={
                  ()=>router.push("/accounts/edit")
                }
                >Edit profile</Button>
                <Button
                  size={"lg"}
                  className="px-4"
                  onClick={() => router.push("/archive")}
                >
                  <Archive size={20} />
                </Button>
                <Button
                  size={"lg"}
                  className="px-4"
                  onClick={() => setToggleSettingsModal(true)}
                >
                  <Settings size={20} />
                </Button>
              </div>
            </div>
            <div className="flex gap-10 justify-center md:justify-start">
              <div className="flex flex-col">
                <p>
                  <span className="font-semibold">{user?.posts?.length}</span>{" "}
                  Posts
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  <span className="font-semibold">{user?.followersCount}</span>{" "}
                  Followers
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  <span className="font-semibold">{user?.followingCount}</span>{" "}
                  Following
                </p>
              </div>
            </div>
            <div className="mb-8  text-center md:text-left ">
              <p>
                Hi there, I'm <span className="font-semibold underline underline-offset-2">{user?.fullname}</span> and I'm a user on Baatchit.{" "}
                <br /> I'm here to share my ideas and connect with like-minded
                people.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
