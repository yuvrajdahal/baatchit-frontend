import Sidebar from "@/components/home/sidebar";
import Suggestion from "@/components/home/suggetstion";
import ListPosts from "@/components/home/list-posts";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="bg-dark h-screen w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar />
        <div className="bg-muted/20 flex-1 snap-y snap-mandatory flex flex-col  items-center overflow-hidden overflow-y-scroll remove-scrollbar transition-all duration-300 ease-in-out">
          <Suspense>
            {" "}
            <ListPosts />
          </Suspense>
        </div>
        <Suspense>
          <Suggestion />
        </Suspense>
      </div>
    </div>
  );
}
