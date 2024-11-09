import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";

interface ChatInputProps {
  sendMessage: (message: string) => void;
}

const ChatInput: FC<ChatInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState<string>("");
  return (
    <div className="px-4 w-full mb-4">
      <div className="w-full border border-gray-300 bg-muted/20 flex items-center h-12 rounded-full overflow-hidden">
        <Input
          value={message}
          placeholder="Message..."
          onChange={(e) => setMessage(e.target.value)}
          className="h-full border-0 outline-none ring-0 text-sm pl-4 ring-0"
        />
        {message.length > 0 && (
          <button
            className="text-blue-500 text-sm font-semibold mr-4"
            onClick={() => {
              sendMessage(message);
              setMessage("");
            }}
            onKeyUpCapture={(e) => {
              if (e.key === "Enter") {
                sendMessage(message);
                setMessage("");
              }
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
