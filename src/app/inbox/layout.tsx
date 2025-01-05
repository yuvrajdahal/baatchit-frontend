import Sidebar from "@/components/home/sidebar";
import ChatList from "@/components/inbox/chat-list";
import AuthProvider from "@/providers/auth-provider";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="bg-dark h-[100dvh] w-screen text-light ">
        <div className="h-full w-full flex justify-between">
          <Sidebar />
          <div className="w-[400px] border py-4 gap-y-4  h-full overflow-y-scroll overflow-hidden">
            <ChatList />
          </div>
          <div className="bg-muted/20 flex-1 h-full w-full  flex flex-col  items-center overflow-x-hidden  remove-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
