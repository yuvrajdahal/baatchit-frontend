"use client";
import { User, UserMessages } from "@/data-access/types";
import Link from "next/link";
import { FC, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface ChatBodyProps {
  messages: UserMessages[];
  user: User | null;
}

const ChatBody: FC<ChatBodyProps> = ({ user, messages }) => {
  const isUserSender = (message: UserMessages) => {
    return message.sender._id === user?._id;
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="h-[calc(100dvh_-_60px_-_50px)] overflow-y-auto flex flex-col"
    >
      <div className="px-3 pb-4 gap-2 flex-1 flex flex-col justify-end py-1">
        {messages.map((message) => (
          <div
            key={message._id}
            className={twMerge(
              "flex w-full",
              isUserSender(message) && "justify-end",
              !isUserSender(message) && "justify-start"
            )}
          >
            <UserMessage
              message={message.message}
              user={message.sender}
              isUserSender={isUserSender(message)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
const UserMessage: FC<{
  message: string;
  user: User;
  isUserSender: boolean;
}> = ({ message, user, isUserSender }) => {
  return (
    <div
      className={twMerge(
        "flex items-center gap-3",

        isUserSender && "flex-row-reverse"
      )}
    >
      <Link href={`/profile/${user?._id}`}>
        <img
          src={user?.profilePicture}
          alt={user?.username}
          width={40}
          height={40}
          className="rounded-full border"
        />
      </Link>
      <div className="bg-gray-200/90 p-2 rounded-md">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
export default ChatBody;
