import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";

const PostSkeleton: React.FC = () => {
  return (
    <div
      className="snap-center flex-shrink-0 h-full flex flex-col justify-center items-center"
    >
      <div className="border border-neutral-400 border-1 min-w-[290px] sm:min-w-[300px] md:min-w-[350px] 2xl:min-w-[400px] mx-auto p-4 rounded-lg animate-pulse">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div className="ml-3">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-16" />
            </div>
          </div>
          <MoreHorizontal className="text-gray-300" />
        </div>

        {/* Image */}
        <div className="w-full border h-[350px] 2xl:h-[400px] bg-gray-300 rounded-lg mb-3" />

        {/* Action buttons */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-4">
            <Heart className="text-gray-300" />
            <MessageCircle className="text-gray-300" />
          </div>
        </div>

        <div className="h-4 bg-gray-300 rounded w-20 mb-3" />

        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />

        <div className="h-4 bg-gray-300 rounded w-1/2 mb-3" />

        <div className="h-4 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
  );
};

export default PostSkeleton;
