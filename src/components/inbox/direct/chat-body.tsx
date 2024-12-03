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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="px-3 flex pb-4 flex-col gap-2 justify-end py-1 w-full h-full overflow-y-scroll"
      ref={scrollRef}
    >
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
        <p className="text-sm">
          {message}
        </p>
      </div>
    </div>
  );
};
export default ChatBody;
