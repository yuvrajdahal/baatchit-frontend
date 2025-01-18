import { UserChats } from "@/data-access/types";
import { FC } from "react";
import { Info } from "lucide-react";
type ChatHeaderProps = {
  receiver: UserChats["receiver"] | undefined;
};

const ChatHeader: FC<ChatHeaderProps> = ({ receiver }) => {
  return (
    <div className="py-2 h-[60px] overflow-hidden border-y border-gray-300 px-5 bg-muted/20 flex items-center justify-between">
      <div className="flex space-x-2 items-center">
        <img
          src={receiver?.profilePicture}
          alt={receiver?.username}
          width={45}
          height={45}
          className="rounded-full border"
        />
        <p className="text-sm font-semibold capitalize">{receiver?.fullname}</p>
      </div>
      <div title="Coming soon">
        <Info className="text-muted-foreground cursor-pointer" />
      </div>
    </div>
  );
};
export default ChatHeader;
