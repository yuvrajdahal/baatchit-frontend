"use client";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatUserTile from "@/components/inbox/chat-user-tile";
import { useUserChats } from "@/hooks/use-chat";
import { useCurrentUser } from "@/hooks/use-auth";

export default function ChatList() {
  const { data: userData } = useCurrentUser();
  const { data: chatsData, isLoading } = useUserChats();
  const router = useRouter();

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer px-5 mb-4 mt-2">
          <div className="font-semibold ">{userData?.user?.username}</div>
          <ChevronDown />
        </div>
      </div>
      <div className="flex items-center text-sm mt-4 mb-2 font-semibold px-5">
        Messages
      </div>
      {isLoading ? (
        <div className="flex items-center px-5 py-4">Loading...</div>
      ) : (
        <>
          {chatsData?.data?.map((chat: any) => (
            <ChatUserTile
              user={
                userData?.user?._id === chat.receiver._id
                  ? chat.sender
                  : chat.receiver
              }
              key={chat._id}
              router={router}
            />
          ))}
          {!chatsData?.data?.length && (
            <div className="flex items-center px-5 py-4 justify-between cursor-pointer bg-muted">
              Get a friend bro!
            </div>
          )}
        </>
      )}
    </div>
  );
}
