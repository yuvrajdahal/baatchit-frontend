import { User } from "@/data-access/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const ChatUserTile: React.FC<{
  user: User | null;
  router: AppRouterInstance;
}> = ({ user, router }) => {
  return (
    <div
      className="flex items-center px-5 py-4  justify-between cursor-pointer hover:bg-muted"
      onClick={() => {
        router.push(`/inbox/direct/${user?._id}`);
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
          </p>
          <p className="text-muted-foreground flex items-center text-xs">
            Where are you bro?
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatUserTile;
