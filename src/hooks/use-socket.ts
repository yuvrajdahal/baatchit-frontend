import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";

type Message = any;

interface ServerToClientEvents {
  "msg-receive": (message: Message) => void;
}

interface ClientToServerEvents {
  "send-msg": (message: Omit<Message, "id" | "timestamp">) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  "add-user": (userId: string) => void;
}

interface StoreState {
  isConnected: boolean;
  messages: Message[];
  error: string | null;
  initializeSocket: (userId: string) => void;
  cleanup: () => void;
  sendMessage: (message: Pick<Message, "message" | "to" | "from">) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  addUser: (userId: string) => void;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}
const useSocketStore = create<StoreState>((set, get) => ({
  isConnected: false,
  messages: [],
  error: null,
  socket: null,
  initializeSocket: (userId: string) => {
    const queryClient = new QueryClient();

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      (process.env.NODE_ENV === "development"
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/socket`
        : `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/socket`) as string,
      {
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: true,
        auth: {
          token: localStorage.getItem("token") as string,
        },
      }
    );
    if (socket.active) {
      set({ socket });
    }
    socket.on("connect", () => {
      set({ isConnected: true, error: null });
      console.log("Connected to socket server");
    });

    socket.on("msg-receive", (message: Message) => {
      console.log(message);
      set((state) => ({
        messages: [...state.messages, message],
      }));
      queryClient.setQueryData(
        ["messages"],
        (oldData: any) => ({
          ...oldData,
          data: [...(oldData?.data || []), message],
        })
      );
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
    const { socket } = get();
    if (socket) {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("msg-receive");
      socket.disconnect();
    }
  },

  addUser: (userId: string) => {
    const { socket } = get();
    if (socket && get().isConnected) {
      console.log("hey socket add-user");
      socket.emit("add-user", userId);
    }
  },
  sendMessage: (data: any) => {
    const { socket } = get();

    if (socket && get().isConnected) {
      socket.emit("send-msg", data);
    } else {
      console.warn("Cannot send message: Socket not connected");
    }
  },

  joinRoom: (roomId: string) => {
    const { socket } = get();

    if (socket && get().isConnected) {
      socket.emit("joinRoom", roomId);
    }
  },

  leaveRoom: (roomId: string) => {
    const { socket } = get();

    if (socket && get().isConnected) {
      socket.emit("leaveRoom", roomId);
    }
  },
}));

export default useSocketStore;
