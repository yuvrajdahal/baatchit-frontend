"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Comment, Post, User } from "@/data-access/types";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Flag,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  Menubar,
  MenubarItem,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { twMerge } from "tailwind-merge";
import Loading from "../loading";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNowStrict } from "date-fns";
import useAuthStore from "@/hooks/use-auth";

interface ImageModalProps {
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
  deletePost?: (id: string) => Promise<boolean>;
  user?: User | null;
  selectNext: (id: string) => void;
  selectPrev: (id: string) => void;
  showLeftIcon: boolean;
  showRightIcon: boolean;
  comments: Comment[];
  isCommentsLoading: boolean;
  deleteComment: (id: string, commentId: string) => Promise<boolean>;
  isCommentDeleting: boolean;
}
interface NImageModalProps {
  modal?: boolean;
  open?: boolean;
  onChange?: () => void;
  setOpenCommentsModal?: (open: boolean) => void;
  post?: Post;
  currentUser?: User | null;
  isCommentsLoading: boolean;
  comments: Comment[];
  deleteComment: (id: string, commentId: string) => Promise<boolean>;
  isCommentDeleting: boolean;
  selectNext: () => void;
  selectPrev: () => void;
  showLeftIcon: boolean;
  showRightIcon: boolean;
  deletePost?: (id: string) => Promise<boolean>;
}
const ImageModal: React.FC<NImageModalProps> = ({
  modal = true,
  open = false,
  onChange,
  setOpenCommentsModal,
  deletePost,
  selectNext,
  selectPrev,
  showLeftIcon,
  showRightIcon,
  comments,
  isCommentsLoading,
  deleteComment,
  isCommentDeleting,
  currentUser,
  post,
}) => {
  const { toast } = useToast();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user: existingUser } = useAuthStore();
  return (
    <>
      <Dialog modal={modal} open={open} onOpenChange={onChange}>
        <DialogContent
          className=" sm:max-w-4xl flex z-[1000] gap-0 p-0 outline-none"
          showCancelIcon="hide"
        >
          {showLeftIcon && (
            <div
              onClick={selectPrev}
              className="text-xl cursor-pointer fixed flex justify-center items-center text-white h-10 w-10 rounded-full bg-white -left-[20%] top-[40%]"
            >
              <ChevronLeft className="text-gray-500" />
            </div>
          )}

          <div className="w-1/2  overflow-hiden aspect-square">
            <div className="relative pt-[125%] overflow-hiden ">
              <img
                src={post?.image}
                sizes="(max-width: 639px) 33vw, (max-width: 1079px) 300px, 357px"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />{" "}
            </div>{" "}
          </div>
          <div className="w-1/2  aspect-square">
            <div className="flex justify-between items-center  px-2">
              <div className="flex space-x-3 items-center  pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border"
                  src={post?.user?.profilePicture}
                  alt={`${post?.user?.username} avatar`}
                />
                <div>
                  <Link
                    onClick={() => {
                      setOpenCommentsModal!(false);
                    }}
                    href={
                      currentUser?._id === post?.user?._id
                        ? `/profile`
                        : `/profile/${post?.user._id}`
                    }
                  >
                    <p className="font-semibold text-sm">
                      {post?.user?.username ?? "user06934"}
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
                          const success = await deletePost!(post?._id!);
                          setDeleteLoading(false);
                          setOpenCommentsModal!(false);

                          if (success) {
                            toast({
                              title: "Post deleted",
                              description: "Post deleted successfully",
                            });
                          }
                          // MenubarTrigger.call(this, {});
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
            <div className="flex flex-col overflow-hidden  mt-4 gap-4 px-2 ">
              {!isCommentsLoading &&
                comments.map((cmt, i) => {
                  return (
                    <div key={i} className="flex items-start justify-between">
                      <div className="flex items center gap-2">
                        <div className="flex">
                          <img
                            className="w-12 h-12 rounded-full object-cover border"
                            src={cmt.user.profilePicture}
                            alt={`${cmt.user.username} avatar`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Link
                              onClick={() => {
                                setOpenCommentsModal!(false);
                              }}
                              href={
                                currentUser?._id === cmt?.user._id
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
                          {currentUser?._id === cmt?.user?._id && (
                            <MenubarItem
                              onClick={async (e) => {
                                e.preventDefault();
                                setDeleteLoading(true);
                                const success = await deleteComment!(
                                  post?._id!,
                                  cmt._id
                                );
                                setDeleteLoading(false);
                                setOpenCommentsModal!(false);

                                if (success) {
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
                          )}
                    
                        </div>
                      </MoreButton>
                    </div>
                  );
                })}
              {!isCommentsLoading && comments.length === 0 && (
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
          {showRightIcon && (
            <div
              onClick={selectNext}
              className="text-xl cursor-pointer flex justify-center items-center fixed text-white h-10 w-10 rounded-full bg-white -right-[20%] top-[40%]"
            >
              <ChevronRight className="text-gray-500" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ImageModal;
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
          className={twMerge(" bg-white border rounded min-w-32 z-[3000]")}
        >
          {children}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
