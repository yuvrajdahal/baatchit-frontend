"use client";
import useAuthStore from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SkeletonSuggestion from "./skeletal-suggetions";

interface SUser {
  username: string;
  fullName: string;
  mutuals: string;
  avatar: string;
  suggested: boolean;
}

const users: SUser[] = [
  {
    username: "meghaa.bhujel_06",
    fullName: "Followed by malbin55 + 4 more",
    mutuals: "Followed by malbin55 + 4 more",
    avatar: "https://placeholder.pics/svg/200",
    suggested: true,
  },
  {
    username: "kafle.kewal",
    fullName: "Suggested for you",
    mutuals: "",
    avatar: "https://placeholder.pics/svg/200",
    suggested: true,
  },
  {
    username: "_sauravii_",
    fullName: "Followed by osm.10_____ + 6 more",
    mutuals: "Followed by osm.10_____ + 6 more",
    avatar: "https://placeholder.pics/svg/200",
    suggested: false,
  },
  {
    username: "garima___golchha",
    fullName: "Following ankitshrm.brt + 3 more",
    mutuals: "Following ankitshrm.brt + 3 more",
    avatar: "https://placeholder.pics/svg/200",
    suggested: false,
  },
  {
    username: "monsoon.basnet",
    fullName: "Followed by prasuna.dahal.1 + ...",
    mutuals: "Followed by prasuna.dahal.1 + ...",
    avatar: "https://placeholder.pics/svg/200",
    suggested: false,
  },
];

const Suggestion: React.FC = () => {
  const {
    user,
    logout,
    isLoading,
    isSuggestedUsersLoading,
    getSuggestedUsers,
    suggestedUsers,
  } = useAuthStore();
  const [isMounted, setMounted] = useState(true);
  useEffect(() => {
    setMounted(false);
    getSuggestedUsers();
  }, []);
  if (isLoading || isMounted || isSuggestedUsersLoading)
    return <SkeletonSuggestion />;
  console.log(suggestedUsers);
  return (
    <div className="bg-white p-4 min-w-[350px] border-l pr-6">
      {/* Profile section */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3 items-center">
          <img
            src={user?.profilePicture ?? "https://placeholder.pics/svg/200"}
            alt="User Profile"
            width={50}
            height={50}
            className="rounded-full border"
          />
          <div>
            <p className="font-semibold text-sm">
              {user?.username ?? "user06934"}
            </p>
            <p className="text-gray-500 text-sm">{user?.fullname ?? "user"}</p>
          </div>
        </div>
        <Link
          href="/login?logout=true"
          className="text-blue-500 text-xs font-semibold"
        >
          Switch
        </Link>
      </div>
      {/* Suggested section */}
      <div className="mt-6">
        <div className="flex justify-between">
          <p className="text-gray-500 text-sm">Suggested for you</p>
          <a href="#" className="text-xs font-semibold">
            See All
          </a>
        </div>
        <div className="mt-4 space-y-3">
          {suggestedUsers?.map((suser, i) => {
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex space-x-3 items-center">
                  <img
                    src={suser?.profilePicture}
                    alt={suser?.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <Link
                      href={
                        user?._id === suser?._id
                          ? `/profile`
                          : `/profile/${suser?._id}`
                      }
                    >
                      {" "}
                      <p className="text-sm">{suser?.username}</p>
                    </Link>
                    <p className="text-gray-500 text-xs">
                      {/* {suser?.suggested ? "Suggested for you" : user?.mutuals} */}
                      Suggested for you
                    </p>
                  </div>
                </div>
                <div
                  // onClick={() => unfollowUser(user?._id)}
                  className="text-blue-500 text-xs font-semibold cursor-pointer"
                >
                  Follow
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <div className="text-gray-400 text-xs mt-10 space-y-2">
        <p>About · Help · Privacy · Terms · Locations</p>
        <p>Language · English · Nepali</p>
      </div>
      <p className="mt-6 text-gray-400 text-xs">&copy; 2024 BAATCHIT</p>
    </div>
  );
};

export default Suggestion;
