import { User } from "@/data-access/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const UserTile: React.FC<{
  user: User | null;
  router: AppRouterInstance;
}> = ({ user, router }) => {
  return (
    <div
      className="flex items-center px-5 py-4  justify-between cursor-pointer hover:bg-muted"
      onClick={() => {
        router.push(`/profile/${user?._id}`);
      }}
    >
      <div className="flex space-x-3 items-center">
        <img
          src={user?.profilePicture}
          alt={user?.username}
          width={40}
          height={40}
          className="rounded-full border"
        />
        <div>
          {" "}
          <p className="text-sm flex justify-between items-center">
            <span>{user?.username}</span>
            {user?.isFollowing && (
              <span className="text-blue-500 text-xs font-semibold">
                {" "}
                · Following
              </span>
            )}
          </p>
          <p className="text-muted-foreground flex items-center text-xs">
            {user?.fullname} · {user?.followersCount} followers
            {user?.mutualFollowers!?.length > 0 && (
              <span className="">
                ·{" "}
                {user?.mutualFollowersCount! > 1
                  ? `${user?.mutualFollowersCount} mutual followers`
                  : `${user?.mutualFollowersCount} mutual follower`}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTile;
