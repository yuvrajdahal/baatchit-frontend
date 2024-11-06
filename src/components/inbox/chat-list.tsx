"use client";
import { ChevronDown } from "lucide-react";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useChatStore from "@/hooks/use-chat";
import ChatUserTile from "@/components/inbox/chat-user-tile";

export default function ChatList() {
  const { user } = useAuthStore();
  const { fetchUserChats, userChats } = useChatStore();
  useEffect(() => {
    fetchUserChats();
  }, []);
  const router = useRouter();
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer px-5 mb-4 mt-2">
          <div className="font-semibold ">{user?.username}</div>
          <ChevronDown />{" "}
        </div>
      </div>
      <div className="flex items-center text-sm mt-4 mb-2 font-semibold px-5">
        Messages
      </div>
      {userChats.map((u, i) => (
        <ChatUserTile user={u.receiver} key={i} router={router} />
      ))}
      {userChats.length == 0 && (
        <div className="flex items-center px-5 py-4  justify-between cursor-pointer bg-muted">
          Get a friend bro!
        </div>
      )}
    </div>
  );
}
