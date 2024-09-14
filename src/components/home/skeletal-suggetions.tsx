import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const SkeletonSuggestion: React.FC = () => {
  return (
    <div className=" mt-6 ">
      <div className="flex items-center justify-between">
        <p className="animate-pulse bg-gray-300 font-semibold text-sm w-[60px] h-2"></p>
        <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[20px] h-2"></p>
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
              <MoreHorizontal className="text-gray-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SkeletonSuggestion;
