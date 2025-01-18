"use client";

import { useEffect } from "react";
import ChatBody from "@/components/inbox/direct/chat-body";
import ChatHeader from "@/components/inbox/direct/chat-header";
import ChatInput from "@/components/inbox/direct/chat-input";
import { useParams } from "next/navigation";
import {
  useUserChats,
  useUserMessages,
  useCreateUserChat,
} from "@/hooks/use-chat";
import useSocketStore from "@/hooks/use-socket";
import { useCurrentUser } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

const Page = () => {
  const { id } = useParams();
  const { data: userData } = useCurrentUser();
  const { data: userChats } = useUserChats();
  const { data: messages } = useUserMessages(
    userData?.user?._id || "",
    id as string
  );
  const queryClient = useQueryClient();
  const { initializeSocket, addUser, cleanup, sendMessage, socket } =
    useSocketStore();

  const receiver = userChats?.data?.find(
    (chat: any) => chat.receiver._id === id || chat.sender._id === id
  )?.receiver;

  useEffect(() => {
    if (userData) {
      if (!socket) {
        initializeSocket(userData.user?._id!);
      }
      console.log(socket);

      addUser(userData.user?._id!);
    }
  }, [userData, socket]);

  function sendMessageHandler(message: string) {
    if (!userData?.user) return;

    sendMessage({
      from: userData.user._id,
      to: id as string,
      message,
    });
    queryClient.invalidateQueries({ queryKey: ["messages"] });
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col justify-between">
      <ChatHeader receiver={receiver} />
      <ChatBody messages={messages?.data || []} user={userData?.user!} />
      <ChatInput sendMessage={sendMessageHandler} />
    </div>
  );
};

export default Page;
