import Link from "next/link";

const SkeletonSuggestion: React.FC = () => {
  return (
    <div className="bg-white p-4 min-w-[350px] border-l pr-6">
      {/* Profile section */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3 items-center">
          <div className="h-[50px] w-[50px] rounded-full border bg-gray-300 animate-pulse" />
          <div>
            <p className="animate-pulse bg-gray-300 font-semibold text-sm w-[100px] h-2"></p>
            <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[50px] h-2"></p>
          </div>
        </div>
        <div className="bg-gray-300 animate-pulse w-[40px] h-2"></div>
      </div>
      {/* Suggested section */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="animate-pulse bg-gray-300 font-semibold text-sm w-[100px] h-2"></p>
          <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[50px] h-2"></p>
        </div>
        <div className="mt-4 space-y-3">
          {[...Array(5)].map((_, index) => {
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex space-x-3 items-center">
                  <div className="h-[50px] w-[50px] rounded-full border bg-gray-300 animate-pulse" />
                  <div>
                    <p className="animate-pulse bg-gray-300 font-semibold text-sm w-[100px] h-2"></p>{" "}
                    <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[50px] h-2"></p>
                  </div>
                </div>
                <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[50px] h-2"></p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <div className="text-gray-400 text-xs mt-10 space-y-2">
        <p>About · Help · Privacy · Terms · Locations</p>
        <p>Language · English · Nepali</p>
      </div>
      <p className="mt-6 text-gray-400 text-xs">&copy; 2024 BAATCHIT</p>
    </div>
  );
};
export default SkeletonSuggestion;
