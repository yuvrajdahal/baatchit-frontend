import { create } from "zustand";
import { io, Socket } from "socket.io-client";

// Define message types
type Message = any;

// Define socket events
interface ServerToClientEvents {
  "msg-receive": (message: Message) => void;
}

interface ClientToServerEvents {
  sendMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  "add-user": (userId: string) => void;
}

// Define store state
interface StoreState {
  isConnected: boolean;
  messages: Message[];
  error: string | null;
  initializeSocket: () => void;
  cleanup: () => void;
  sendMessage: (message: Pick<Message, "message" | "to" | "from">) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  addUser: (userId: string) => void;
}
// baseURL: string = (process.env.NODE_ENV === "development"
//   ? process.env.NEXT_PUBLIC_BACKEND_URL
//   : process.env.NEXT_PUBLIC_PROD_BACKEND_URL) as string

// Create socket instance with proper typing
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  (process.env.NODE_ENV === "development"
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/socket`
    : `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/socket`) as string,
  {
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
  }
);

const useSocketStore = create<StoreState>((set, get) => ({
  isConnected: false,
  messages: [],
  error: null,
  initializeSocket: () => {
    socket.on("connect", () => {
      set({ isConnected: true, error: null });
      console.log("Connected to socket server");
    });

    socket.on("msg-receive", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
      console.log("Received message:", message);
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
      console.log("Disconnected from socket server");
    });

    socket.on("connect_error", (error: Error) => {
      set({ error: error.message });
      console.error("Socket connection error:", error);
    });
  },

  cleanup: () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("msg-receive");
    socket.disconnect();
  },

  addUser: (userId: string) => {
    if (get().isConnected) {
      socket.emit("add-user", userId);
    }
  },
  sendMessage: (data: any) => {
    if (get().isConnected) {
      socket.emit("sendMessage", data);
    } else {
      console.warn("Cannot send message: Socket not connected");
    }
  },

  joinRoom: (roomId: string) => {
    if (get().isConnected) {
      socket.emit("joinRoom", roomId);
    }
  },

  leaveRoom: (roomId: string) => {
    if (get().isConnected) {
      socket.emit("leaveRoom", roomId);
    }
  },
}));

export default useSocketStore;
