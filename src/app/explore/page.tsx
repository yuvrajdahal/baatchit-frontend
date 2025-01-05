import ImageList from "@/components/explore/image-lists";
import Sidebar from "@/components/home/sidebar";

const Explore = () => {
  return (
    <div className="h-[100dvh] flex flex-col w-full overflow-hidden">
      <div className="h-full w-full flex justify-between">
      <Sidebar  />
      <div className="bg-muted/20 flex-1  flex flex-col  items-center overflow-x-hidden  remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
          <ImageList />
          <div className="w-full flex flex-col justify-center items-center mt-4">
            <div className="text-gray-400 text-xs text-center ">
              <p>
                About · Help · Privacy · Terms · Locations · Language · English
                · Nepali
              </p>
            </div>
            <p className="mt-2 text-gray-400 text-xs">&copy; 2024 BAATCHIT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
