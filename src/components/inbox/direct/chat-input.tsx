import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";

interface ChatInputProps {
  sendMessage: (message: string) => void;
}

const ChatInput: FC<ChatInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState<string>("");
  return (
    <div className="h-[50px]   px-4 w-full mb-4">
      <div className="w-full border border-gray-300 bg-muted/20 flex items-center h-full rounded-full overflow-hidden">
        <input
          value={message}
          placeholder="Message..."
          onKeyUpCapture={(e) => {
            if (message.length > 0)
              if (e.key === "Enter") {
                sendMessage(message);
                setMessage("");
              }
          }}
          onChange={(e) => setMessage(e.target.value)}
          className="h-full w-full border-0 outline-none ring-0 text-sm pl-4 ring-0"
        />
        {message.length > 0 && (
          <button
            className="text-blue-500 text-sm font-semibold mr-4"
            onClick={() => {
              sendMessage(message);
              setMessage("");
            }}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
};
export default ChatInput;
