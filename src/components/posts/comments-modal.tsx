"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Post, User } from "@/data-access/types";
import { useCurrentUser } from "@/hooks/use-auth";
import { useComments, useDeleteComment, useDeletePost } from "@/hooks/use-post";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNowStrict } from "date-fns";
import { Flag, MoreHorizontal, Trash2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Loading from "../loading";

interface CommentModalProps {
  modal?: boolean;
  open?: boolean;
  onChange?: () => void;
  setOpenCommentsModal?: (open: boolean) => void;
  id: string;
  description: string;
  image: string;
  post?: Post | null;
  likesCount: number;
  avatarUrl: string;
  username: string;
  deletePost?: (id: string) => void;
  user?: User | null;
}

const CommentModal: React.FC<CommentModalProps> = ({
  modal = true,
  open = false,
  onChange,
  id,
  setOpenCommentsModal,
  description,
  image,
  avatarUrl,
  user,
  post,
  username,
  likesCount,
}) => {
  const { data: commentData, isLoading: isCommentsLoading } = useComments(id);
  const {
    mutate: deleteComment,
    isPending: isCommentDeleting,
    isSuccess: isCommentDeleteSuccess,
  } = useDeleteComment();
  const { mutate: deletePost, isSuccess: isPostDeletingSuccess } =
    useDeletePost();

  const { toast } = useToast();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { data: userData } = useCurrentUser();
  const existingUser = userData?.user;
  return (
    <>
      <Dialog modal={modal} open={open} onOpenChange={onChange}>
        <DialogContent
          className="flex flex-col md:flex-row z-[1000] gap-0 p-0 outline-none max-w-sm md:max-w-3xl lg:max-w-4xl 2xl:max-w-6xl"
          showCancelIcon="hide"
        >
          <div className="w-full   bg-black/90 md:w-1/2 overflow-hidden">
            <div className="relative pt-[100%] md:pt-[125%] overflow-hidden">
              {/* <div className="relative pt-[100%] md:pt-[125%] overflow-hidden"> */}
              <div
                className="absolute z-10 block cursor-pointer md:hidden top-2 right-2"
                onClick={() => setOpenCommentsModal!(false)}
              >
                <X className="text-muted-foreground" />
              </div>

              <img
                src={image}
                sizes="(max-width: 639px) 100vw, (max-width: 1079px) 300px, 357px"
                className="absolute inset-0 w-full h-full object-contain md:object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[30vh] md:h-auto overflow-y-auto">
            <div className="flex justify-between items-center p-2 sm:px-2">
              <div className="flex space-x-3 items-center  pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border"
                  src={avatarUrl}
                  alt={`${username} avatar`}
                />
                <div>
                  <Link
                    onClick={() => {
                      setOpenCommentsModal!(false);
                    }}
                    href={
                      user?._id === post?.user._id
                        ? `/profile`
                        : `/profile/${post?.user._id}`
                    }
                  >
                    <p className="font-semibold text-sm">
                      {username ?? "user06934"}
                    </p>
                  </Link>
                  <p className="text-muted-foreground pt-0.5 text-xs 2xl:text-sm">
                    {formatDistanceToNowStrict(
                      post?.createdAt ? new Date(post?.createdAt!) : new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </div>
              </div>
              <div>
                <MoreButton
                  trigger={
                    <MoreHorizontal
                      className={twMerge(
                        "text-muted-foreground h-5 w-5 bg-transparent border-none cursor-pointer"
                      )}
                    />
                  }
                >
                  <div className="flex flex-col divide-y divide-gray-300">
                    {existingUser?._id === post?.user?._id && (
                      <MenubarItem
                        onClick={async (e) => {
                          e.preventDefault();
                          setDeleteLoading(true);
                          await deletePost!(id);
                          setDeleteLoading(false);
                          setOpenCommentsModal!(false);

                          if (isPostDeletingSuccess) {
                            toast({
                              title: "Post deleted",
                              description: "Post deleted successfully",
                            });
                          }
                        }}
                        className={twMerge(
                          `relative flex rounded-none items-center justify-between py-2  tranition duration-300 ease-in-out  space-x-4 `,
                          deleteLoading
                            ? "cursor-wait text-muted-foreground"
                            : "cursor-pointer"
                        )}
                      >
                        Delete
                        {deleteLoading ? (
                          <Loading className="w-4 h-4 text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-500" />
                        )}
                      </MenubarItem>
                    )}
                    <MenubarItem
                      className={twMerge(
                        `relative  flex rounded-none items-center justify-between py-2  cursor-pointer tranition duration-300 ease-in-out  space-x-4 `
                      )}
                    >
                      Report
                      <Flag className="w-4 h-4 text-red-500" />
                    </MenubarItem>
                  </div>
                </MoreButton>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="flex flex-col overflow-y-auto mt-4 gap-4 p-2 sm:px-2">
              {!isCommentsLoading &&
                commentData?.comments.map((cmt: any, i: number) => {
                  return (
                    <div key={i} className="flex items-start justify-between">
                      <div className="flex items center gap-2">
                        <div className="flex">
                          <img
                            className="w-12 h-12 rounded-full object-cover border"
                            src={cmt.user.profilePicture}
                            alt={`${username} avatar`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Link
                              onClick={() => {
                                setOpenCommentsModal!(false);
                              }}
                              href={
                                user?._id === cmt?.user._id
                                  ? `/profile`
                                  : `/profile/${cmt.user?._id}`
                              }
                            >
                              {" "}
                              <p className="text-sm">{cmt.user.username}</p>
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm">{cmt.message}</p>
                        </div>
                      </div>
                      <MoreButton
                        trigger={
                          <MoreHorizontal
                            className={twMerge(
                              "text-muted-foreground h-5 w-5 bg-transparent border-none cursor-pointer"
                            )}
                          />
                        }
                      >
                        <div className="flex flex-col divide-y divide-gray-300">
                          {user?._id === cmt?.user?._id && (
                            <MenubarItem
                              onClick={async (e) => {
                                e.preventDefault();
                                setDeleteLoading(true);
                                const success = await deleteComment!({
                                  commentId: cmt._id,
                                  postId: id,
                                });
                                setDeleteLoading(false);
                                setOpenCommentsModal!(false);

                                if (isCommentDeleteSuccess) {
                                  toast({
                                    title: "Post deleted",
                                    description: "Post deleted successfully",
                                  });
                                }
                              }}
                              className={twMerge(
                                `relative flex rounded-none items-center justify-between py-2  tranition duration-300 ease-in-out  space-x-4 `,
                                isCommentDeleting
                                  ? "cursor-wait text-muted-foreground"
                                  : "cursor-pointer"
                              )}
                            >
                              Delete
                              {isCommentDeleting ? (
                                <Loading className="w-4 h-4 text-red-500" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              )}
                            </MenubarItem>
                          )}{" "}
                          <MenubarItem className="flex justify-between items-center">
                            Report <Flag className="w-4 h-4 text-red-500" />
                          </MenubarItem>
                        </div>
                      </MoreButton>
                    </div>
                  );
                })}
              {!isCommentsLoading && commentData?.comments.length === 0 && (
                <div className="flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    No comments yet
                  </p>
                </div>
              )}
              {isCommentsLoading &&
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex space-x-3 items-center mt-2">
                      <div className="h-10 w-10 rounded-full border bg-gray-300 animate-pulse" />
                      <div>
                        <p className="animate-pulse bg-gray-300 font-semibold text-sm w-[100px] h-2"></p>
                        <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[50px] h-2"></p>
                      </div>
                    </div>
                    <div className="w-4 h-1.5 bg-gray-300 animate-pulse"></div>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CommentModal;
interface MoreItemProps {
  trigger: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
}
const MoreButton: React.FC<MoreItemProps> = ({
  trigger,
  onClick,
  children,
}) => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger
          onClick={onClick}
          className={twMerge("border-none bg-transparent px-0 pr-1")}
        >
          {trigger}
        </MenubarTrigger>
        <MenubarContent
          className={twMerge(" bg-white border rounded min-w-32 z-[3000] mr-2 md:mr-auto")}
        >
          {children}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
