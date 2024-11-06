"use client";

import { useEffect, useState } from "react";
import ChatBody from "@/components/inbox/direct/chat-body";
import ChatHeader from "@/components/inbox/direct/chat-header";
import ChatInput from "@/components/inbox/direct/chat-input";
import { useParams } from "next/navigation";
import useChatStore from "@/hooks/use-chat";
import { User, UserChats } from "@/data-access/types";

const Page = () => {
  const { id } = useParams();
  const { getUserFromId, userChats } = useChatStore();
  const [receiver, setReceiver] = useState<UserChats["receiver"] | undefined>();
  useEffect(() => {
    const userFromChatId = getUserFromId(id as string);
    setReceiver(userFromChatId?.receiver);
  }, [id, userChats]);

  return (
    <div className="h-screen w-full flex flex-col justify-between">
      <ChatHeader receiver={receiver} />
      <ChatBody />
      <ChatInput />
    </div>
  );
};
export default Page;
