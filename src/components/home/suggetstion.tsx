"use client";
import { User } from "@/data-access/types";
import {
  useCurrentUser,
  useFollowUser,
  useSuggestedUsers,
} from "@/hooks/use-auth";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import SkeletonSuggestion from "./skeletal-suggetions";

const Suggestion: React.FC = () => {
  const { data: suggestedData, isLoading: isSuggestedLoading } =
    useSuggestedUsers();
  const { data: userData, isLoading: isUserLoading } = useCurrentUser();
  const { mutate: followUser, isPending: isFollowing } = useFollowUser();
  const user = userData?.user;
  return (
    <div className="bg-white p-4 hidden md:block min-w-[350px] border-l pr-6">
      <SuggetionCurrentUser user={user!} isLoading={isUserLoading} />
      <SuggetedUsers
        suggestedUsers={suggestedData?.data!}
        user={user!}
        handleFollow={followUser}
        isLoading={isSuggestedLoading}
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

const SuggetedUsers: React.FC<{
  suggestedUsers: User[] | null;
  user: User | null;
  handleFollow: (id: string) => void;
  isLoading: boolean;
}> = ({ suggestedUsers, user, handleFollow, isLoading }) => {
  if (isLoading) return <SkeletonSuggestion />;

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between">
        <p className="text-gray-500 text-sm">Suggested for you</p>
        <div className="h-[1px] mt-4 bg-gray-300 w-full" />
      </div>
      <div className="mt-4 space-y-3">
        {suggestedUsers?.map((suser) => (
          <SuggestedUserTile
            user={suser}
            currentUserId={user?._id!}
            key={suser._id}
            handleFollow={handleFollow}
          />
        ))}
      </div>
    </div>
  );
};

const SuggestedUserTile: React.FC<{
  user: User | null;
  currentUserId: string;
  handleFollow: (id: string) => void;
}> = ({ user, currentUserId, handleFollow }) => {
  const { isPending: isFollowing } = useFollowUser();

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
            <p className="text-sm">{user?.username}</p>
          </Link>
          <p className="text-gray-500 text-xs">Suggested for you</p>
        </div>
      </div>
      <button
        onClick={() => user?._id && handleFollow(user._id)}
        disabled={isFollowing}
        className="text-blue-500 text-xs font-semibold cursor-pointer"
      >
        {isFollowing ? "..." : "Follow"}
      </button>
    </div>
  );
};

export default Suggestion;
