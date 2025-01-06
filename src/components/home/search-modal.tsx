"use client";
import { User } from "@/data-access/types";
import { useUsersByUsername } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "../ui/input";

const SearchModal: React.FC<{
  show: boolean;
  minimizeSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  isLaptop: boolean;
}> = ({ show, setShow, isLaptop, minimizeSidebar }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: usersData, isLoading, refetch } = useUsersByUsername(search);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (show === false) {
      setSearch(event.target.value);
      refetch();
    }
  }

  // useEffect(() => {
  //   if (show) {
  //     setSearch("");
  //     queryClient.removeQueries({ queryKey: ["usersByUsername"] });
  //   }
  // }, [show, queryClient]);

  return (
    <div
      className={twMerge(
        "absolute top-0  flex transition h-full w-[360px] shadow-lg  border  border-r bg-white",
        "data-[show='false']:flex flex-col data-[show='true']:hidden",
        " py-5"
      )}
      style={{
        transform: `translateX(${show ? "-100%" : "55px"})`,
      }}
    >
      <div className="w-full flex justify-end px-5">
        <X
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            setShow(true);
            if (isLaptop) {
              minimizeSidebar(true);
            }
          }}
        />
      </div>

      <div className="flex flex-col mt-4 px-5">
        <Input placeholder="Search..." value={search} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-4 divider overflow-hidden py-4 overflow-y-scroll remove-scrollbar">
        {search.length > 0 &&
          !isLoading &&
          usersData?.data?.length! > 0 &&
          usersData?.data!.map((u) => (
            <UserTile user={u} key={u._id} router={router} />
          ))}
        {search.length > 0 && !isLoading && !usersData?.data?.length && (
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-sm">No users found</p>
          </div>
        )}
        {search.length === 0 && (
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-sm">
              Search users by{" "}
              <span className="underline underline-offset-4 decoration-dotted">
                username
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserTile: React.FC<{
  user: User | null;
  router: AppRouterInstance;
}> = ({ user, router }) => {
  return (
    <div
      className="flex items-center px-5 py-2  justify-between cursor-pointer hover:bg-muted"
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

export default SearchModal;
