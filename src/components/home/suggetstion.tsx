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
  const { user, logout, isLoading } = useAuthStore();
  const [isMounted, setMounted] = useState(true);
  useEffect(() => {
    setMounted(false);
  }, []);
  if (isLoading || isMounted) return <SkeletonSuggestion />;
  return (
    <div className="bg-white p-4 max-w-lg border-l pr-6">
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
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex space-x-3 items-center">
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">{user?.username}</p>
                  <p className="text-gray-500 text-xs">
                    {user?.suggested ? "Suggested for you" : user?.mutuals}
                  </p>
                </div>
              </div>
              <a href="#" className="text-blue-500 text-xs font-semibold">
                Follow
              </a>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="text-gray-400 text-xs mt-10 space-y-2">
        <p>About · Help · Press · API · Jobs · Privacy · Terms · Locations</p>
        <p>Language · Meta Verified</p>
      </div>
      <p className="mt-6 text-gray-400 text-xs">&copy; 2024 BAATCHIT</p>
    </div>
  );
};

export default Suggestion;
