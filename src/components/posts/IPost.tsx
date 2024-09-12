import React, { useOptimistic, useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { twMerge } from "tailwind-merge";
import CommentModal from "./comments-modal";
import Link from "next/link";
import { User } from "@/data-access/types";

interface InstagramPostProps {
  id: string;
  avatarUrl: string;
  postImageUrl: string;
  likePost?: (id: string) => Promise<boolean>;
  username: string;
  timeAgo: string;
  likes: number;
  disbaleLikeAndComment?: boolean;
  caption: string;
  commentCount: number;
  isLiked: boolean;
  createComment?: (message: string, postId: string) => Promise<boolean>;
  isCreatingComment?: boolean;
  postUserId?: string;
  isCommentsModalOpen?: boolean;
  setCommentsModalOpen?: (open: boolean) => void;
  handleComment?: (id: string) => void;
  user?: User | null;
}

const InstagramPost: React.FC<InstagramPostProps> = ({
  id,
  avatarUrl,
  postImageUrl,
  likePost,
  username,
  handleComment,
  disbaleLikeAndComment = false,
  timeAgo,
  likes,
  isLiked,
  postUserId,
  setCommentsModalOpen,
  caption,
  isCommentsModalOpen,
  isCreatingComment = false,
  createComment,
  commentCount,
  user,
}) => {
  const [comment, setComment] = useState("");
  return (
    <div className=" border border-neutral-400 border-1  min-w-[350px] mx-auto p-4 rounded-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full object-cover border"
            src={avatarUrl}
            alt={`${username} avatar`}
          />
          <div className=" ml-3">
            <Link
              href={
                user?._id === postUserId ? `/profile` : `/profile/${postUserId}`
              }
            >
              <p className="font-semibold text-sm cursor-pointer">{username}</p>
            </Link>
            <p className="text-muted-foreground text-xs">{timeAgo}</p>
          </div>
        </div>
        <MoreHorizontal
          className={twMerge(
            "text-muted-foreground ",
            disbaleLikeAndComment ? " " : "cursor-pointer"
          )}
        />
      </div>

      {/* Image */}
      <div className="w-full mb-3">
        <div className="relative pt-[125%]">
          {" "}
          {/* Aspect ratio is now 4:5 (1080:1350) */}
          <img
            src={postImageUrl} // Optimize for container width
            // srcSet={`
            //   ${getOptimizedImageUrl(postImageUrl, 300)} 300w,
            //   ${getOptimizedImageUrl(postImageUrl, 600)} 600w,
            //   ${getOptimizedImageUrl(postImageUrl, 900)} 900w,
            //   ${postImageUrl} 1080w
            // `}
            // sizes="(max-width: 600px) 100vw, 600px"
            alt={caption}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center ">
        <div className="flex space-x-4">
          <Heart
            className={twMerge(
              "h-5 w-5",
              isLiked ? "text-red-500" : "",
              disbaleLikeAndComment ? " text-gray-400" : "cursor-pointer"
            )}
            onClick={() => {
              if (disbaleLikeAndComment === false) likePost!(id);
            }}
          />{" "}
          <MessageCircle
            className={twMerge(
              "h-5 w-5",
              disbaleLikeAndComment ? " text-gray-400" : "cursor-pointer"
            )}
            onClick={() => {
              setCommentsModalOpen!(true);
              handleComment!(id);
            }}
          />
        </div>
      </div>

      <p className="font-semibold text-sm mt-1">{likes.toString()} likes</p>

      <p className="text-sm">
        <span className="font-semibold ">{username} </span>
        {caption}
      </p>

      <p
        className={twMerge(
          "text-muted-foreground text-sm mt-1",
          disbaleLikeAndComment ? "" : "cursor-pointer"
        )}
        onClick={() => {
          setCommentsModalOpen!(true);
          handleComment!(id);
        }}
      >
        View all {commentCount} comments
      </p>

      <div className="relative flex justify-center items-center mt-1">
        <input
          className="text-sm text-muted-foreground border-none w-full p-0 outline-none"
          placeholder="Add a comment... "
          onChange={(e) => setComment(e.target.value)}
          disabled={isCreatingComment || disbaleLikeAndComment}
        />
        {comment.length > 0 && (
          <div
            onClick={() => createComment!(comment, id)}
            className="cursor-pointer absolute right-2 font-semibold text-sm"
          >
            {isCreatingComment ? "..." : "Post"}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramPost;
