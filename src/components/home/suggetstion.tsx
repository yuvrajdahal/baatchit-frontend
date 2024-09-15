"use client";
import useAuthStore from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SkeletonSuggestion from "./skeletal-suggetions";
import { User } from "@/data-access/types";
import { MoreHorizontal } from "lucide-react";
import usePostStore from "@/hooks/use-post";

interface SUser {
  username: string;
  fullName: string;
  mutuals: string;
  avatar: string;
  suggested: boolean;
}

const Suggestion: React.FC = () => {
  const {
    user,
    logout,
    followSuggestedUser,
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
  async function handleFollow(id: string) {
    await followSuggestedUser(id);
  }
  return (
    <div className="bg-white p-4 min-w-[350px] border-l pr-6">
      <SuggetionCurrentUser user={user} isLoading={isLoading} />
      <SuggetedUsers
        suggestedUsers={suggestedUsers}
        user={user}
        handleFollow={handleFollow}
        isLoading={isSuggestedUsersLoading}
      />
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
const SuggetionCurrentUser: React.FC<{
  user: User | null;
  isLoading: boolean;
}> = ({ user, isLoading }) => {
  if (isLoading)
    return (
      <div className="flex justify-between items-center ">
        <div className="flex space-x-3 items-center">
          <div className="h-[50px] w-[50px] rounded-full border bg-gray-300 animate-pulse" />
          <div>
            <p className="animate-pulse bg-gray-300 font-semibold text-sm w-[100px] h-2"></p>
            <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[50px] h-2"></p>
          </div>
        </div>
        <MoreHorizontal className="text-gray-300" />
      </div>
    );
  return (
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
  );
};
export const SuggetedUsers: React.FC<{
  suggestedUsers: User[] | null;
  user: User | null;
  handleFollow: (id: string) => void;
  isLoading: boolean;
}> = ({ suggestedUsers, user, handleFollow, isLoading }) => {
  if (isLoading) return <SkeletonSuggestion />;
  return (
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
            <SuggestedUserTile
              user={suser}
              currentUserId={user?._id!}
              key={i}
              handleFollow={handleFollow}
            />
          );
        })}
      </div>
    </div>
  );
};
const SuggestedUserTile: React.FC<{
  user: User | null;
  currentUserId: string;
  handleFollow: (id: string) => void;
}> = ({ user, handleFollow ,currentUserId}) => {
  const [isLoading, setIsLoading] = useState(false);
  async function followUserHandler(id: string) {
    setIsLoading(true);
    await handleFollow(id);
    setIsLoading(false);
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-3 items-center">
        <img
          src={user?.profilePicture}
          alt={user?.username}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <Link
            href={
              currentUserId === user?._id ? `/profile` : `/profile/${user?._id}`
            }
          >
            {" "}
            <p className="text-sm">{user?.username}</p>
          </Link>
          <p className="text-gray-500 text-xs">
            {/* {user?.suggested ? "Suggested for you" : user?.mutuals} */}
            Suggested for you
          </p>
        </div>
      </div>
      <div
        onClick={() => followUserHandler(user?._id!)}
        className="text-blue-500 text-xs font-semibold cursor-pointer"
      >
        {isLoading ? "..." : "Follow"}
      </div>
    </div>
  );
};
