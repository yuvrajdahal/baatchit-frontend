import React, { useOptimistic, useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { twMerge } from "tailwind-merge";
import CommentModal from "./comments-modal";
import Link from "next/link";
import { Post, User } from "@/data-access/types";
import { useToast } from "@/hooks/use-toast";

// interface InstagramPostProps {
//   id: string;
//   avatarUrl: string;
//   postImageUrl: string;
//   likePost?: (id: string) => Promise<boolean>;
//   username: string;
//   timeAgo: string;
//   likes: number;
//   disbaleLikeAndComment?: boolean;
//   caption: string;
//   commentCount: number;
//   isLiked: boolean;
//   createComment?: (message: string, postId: string) => Promise<boolean>;
//   isCreatingComment?: boolean;
//   postUserId?: string;
//   isCommentsModalOpen?: boolean;
//   setCommentsModalOpen?: (open: boolean) => void;
//   handleComment?: (id: string) => void;
//   user?: User | null;
// }
interface IPostProps {
  post: Post | null;
  user?: User | null;
  isCommentsModalOpen?: boolean;
  setCommentsModalOpen?: (open: boolean) => void;
  disbaleLikeAndComment?: boolean;
  createComment?: (message: string, postId: string) => Promise<boolean>;
  isCreatingComment?: boolean;
  handleComment?: (id: string) => void;
  likePost?: (id: string) => Promise<boolean>;
}

const InstagramPost: React.FC<IPostProps> = ({
  handleComment,
  disbaleLikeAndComment = false,
  setCommentsModalOpen,
  isCommentsModalOpen,
  isCreatingComment = false,
  likePost,
  createComment,
  post,
  user,
}) => {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  async function submitComment(id: string) {
    const success = await createComment!(comment, id);
    if (success) {
      setComment("");
    }
  }
  return (
    <div className=" border border-neutral-400 border-1  min-w-[350px] mx-auto p-4 rounded-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full object-cover border"
            src={post?.user.profilePicture}
            alt={`${post?.user.username} avatar`}
          />
          <div className=" ml-3">
            <Link
              href={
                disbaleLikeAndComment
                  ? ""
                  : user?._id === post?._id
                  ? `/profile`
                  : `/profile/${post?._id}`
              }
            >
              <p
                className={twMerge(
                  "font-semibold text-sm",
                  disbaleLikeAndComment ? "cursor-default" : "cursor-pointer"
                )}
              >
                {post?.user.username}
              </p>
            </Link>
            <p className="text-muted-foreground text-xs">
              {new Date(post?.createdAt!).toDateString()}
            </p>
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
          <img
            src={post?.image}
            alt={post?.description}
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
              post?.isLiked ? "text-red-500" : "",
              disbaleLikeAndComment ? " text-gray-400" : "cursor-pointer"
            )}
            onClick={() => {
              if (disbaleLikeAndComment === false) likePost!(post?._id!);
            }}
          />{" "}
          <MessageCircle
            className={twMerge(
              "h-5 w-5",
              disbaleLikeAndComment ? " text-gray-400" : "cursor-pointer"
            )}
            onClick={() => {
              if (disbaleLikeAndComment) return;
              setCommentsModalOpen!(true);
              handleComment!(post?._id!);
            }}
          />
        </div>
      </div>

      <p className="font-semibold text-sm mt-1">
        {post?.likesCount.toString()} likes
      </p>

      <p className="text-sm">
        <span className="font-semibold ">{post?.user?.username} </span>
        {post?.description}
      </p>

      <p
        className={twMerge(
          "text-muted-foreground text-sm mt-1",
          disbaleLikeAndComment ? "" : "cursor-pointer"
        )}
        onClick={() => {
          if (disbaleLikeAndComment) return;
          setCommentsModalOpen!(true);
          handleComment!(post?._id!);
        }}
      >
        View all {post?.comments.length} comments
      </p>

      <div className="relative flex justify-center items-center mt-1">
        <input
          className="text-sm text-muted-foreground bg-transparent border-none w-full p-0 outline-none"
          placeholder="Add a comment... "
          onChange={(e) => setComment(e.target.value)}
          disabled={isCreatingComment || disbaleLikeAndComment}
        />
        {comment.length > 0 && (
          <div
            onClick={() => submitComment(post?._id!)}
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
