import ListPosts from "@/components/home/list-posts";
import Sidebar from "@/components/home/sidebar";
import Suggestion from "@/components/home/suggetstion";
import AuthProvider from "@/providers/auth-provider";

export default async function Home() {
  return (
    <AuthProvider>
      <div className="bg-dark h-[100dvh] w-screen text-light ">
        <div className="h-full w-full flex justify-between">
          <Sidebar />
          <div className="bg-muted/20 flex-1 snap-y snap-mandatory flex flex-col  items-center overflow-hidden overflow-y-scroll remove-scrollbar transition-all duration-300 ease-in-out">
            <ListPosts  />
          </div>
          <Suggestion/>
        </div>
      </div>
    </AuthProvider>
  );
}
