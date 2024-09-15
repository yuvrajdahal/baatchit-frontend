"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Post, User } from "@/data-access/types";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import usePostStore from "@/hooks/use-post";
import { Flag, MoreHorizontal, Trash2 } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";
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
  deletePost?: (id: string) => Promise<boolean>;
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
  deletePost,
  avatarUrl,
  user,
  post,
  username,
  likesCount,
}) => {
  const { isCommentsLoading, comments } = usePostStore();
  const { toast } = useToast();
  const [deleteLoading, setDeleteLoading] = useState(false);

  return (
    <>
      {/* <div className="absolute top-6 right-6 z-[10000] ">
        <Cross2Icon className="h-5 w-5 cursor-pointer"color="white" />
      </div> */}
      <Dialog modal={modal} open={open} onOpenChange={onChange}>
        <DialogContent
          className="sm:max-w-4xl flex z-[1000] gap-0 p-0 outline-none"
          showCancelIcon="hide"
        >
          <div className="w-1/2  overflow-hiden aspect-square">
            <div className="relative pt-[125%] overflow-hiden ">
              <img
                src={image}
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
                  src={avatarUrl}
                  alt={`${username} avatar`}
                />
                <div>
                  <p className="font-semibold text-sm">
                    {username ?? "user06934"}
                  </p>
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
                    {user?._id === post?.user?._id && (
                      <MenubarItem
                        onClick={async (e) => {
                          e.preventDefault();
                          setDeleteLoading(true);
                          const success = await deletePost!(id);
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
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer " />
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
          className={twMerge("border-none bg-transparent")}
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
