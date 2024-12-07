"use client";

import { useEffect, useState, useRef } from "react";
import ChatBody from "@/components/inbox/direct/chat-body";
import ChatHeader from "@/components/inbox/direct/chat-header";
import ChatInput from "@/components/inbox/direct/chat-input";
import { useParams } from "next/navigation";
import useChatStore from "@/hooks/use-chat";
import { User, UserChats } from "@/data-access/types";
import { io } from "socket.io-client";
import useAuthStore from "@/hooks/use-auth";
import useSocketStore from "@/hooks/use-socket";

const Page = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { initializeSocket, cleanup, sendMessage } = useSocketStore();
  const { getUserFromId, userChats, fetchUserMessages, userMessages } =
    useChatStore();
  const [receiver, setReceiver] = useState<UserChats["receiver"] | undefined>();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      initializeSocket();
    }
    return cleanup;
  }, [user]);

  // useEffect(() => {
  //   if (token) {
  //     const socket = io("http://localhost:5000/api/v1/socket", {
  //       query: {
  //         token,
  //       },
  //     });

  //     socketref.current = socket;

  //     socket.emit("add-user", id as string);
  //     socket.on("msg-stored", (data) => {
  //       console.log("msg-stored", data);
  //     });
  //   }
  // }, [token]);

  useEffect(() => {
    if (user) {
      const userFromChatId = getUserFromId(id as string, user?._id as string);
      setReceiver(userFromChatId);
    }
  }, [id, userChats, user]);

  useEffect(() => {
    fetchUserMessages(id as string, user?._id as string);
  }, [id, user]);

  function sendMessageHandler(message: string) {
    sendMessage({
      from: user?._id as string,
      to: id as string,
      message,
    });
    fetchUserMessages(id as string, user?._id as string);
  }
  return (
    <div className="h-screen w-full flex flex-col justify-between">
      <ChatHeader receiver={receiver} />
      <ChatBody messages={userMessages} user={user} />
      <ChatInput sendMessage={sendMessageHandler} />
    </div>
  );
};
export default Page;
