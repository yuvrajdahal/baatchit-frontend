import { useRef, useState } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Input } from "../ui/input";
import useAuthStore from "@/hooks/use-auth";
import { User } from "@/data-access/types";
import Link from "next/link";

const SearchModal: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ show, setShow }) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    getUsersByUserName,
    usersByUserName,
    user,
    isUsersByUserNameLoading,
  } = useAuthStore();
  const [search, setSearch] = useState("");
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearch(value);
    if (value.length > 0) {
      getUsersByUserName(value);
    }
  }
  return (
    <div
      ref={ref}
      className={twMerge(
        " absolute flex transition h-full w-[360px] shadow-lg  border  border-r bg-white",
        "data-[show='false']:flex flex-col data-[show='true']:hidden",
        "z-40  py-5"
      )}
      style={{
        transform: `translateX(${show ? "-100%" : "55px"})`,
      }}
    >
      <div className="w-full flex justify-end px-5">
        <X
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            setShow((prev) => !prev);
          }}
        />
      </div>

      <div className="flex flex-col mt-4 px-5">
        <Input placeholder="Search..." value={search} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-4 divider overflow-hidden py-4 overflow-y-scroll remove-scrollbar">
        {usersByUserName &&
          usersByUserName.map((user) => <UserTile user={user} />)}
      </div>
    </div>
  );
};

export default SearchModal;
const UserTile: React.FC<{
  user: User | null;
}> = ({ user }) => {
  return (
    <div className="flex items-center px-5 py-2  justify-between cursor-pointer hover:bg-muted">
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
          <p className="text-sm">{user?.username}</p>
          <p className="text-gray-500 text-xs">
            {/* {user?.mutuals}/{user?.suggested} */}
          </p>
        </div>
      </div>
    </div>
  );
};
