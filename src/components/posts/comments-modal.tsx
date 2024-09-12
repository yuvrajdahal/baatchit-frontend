"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Post } from "@/data-access/types";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import usePostStore from "@/hooks/use-post";
import { MoreHorizontal } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";

interface CommentModalProps {
  modal?: boolean;
  open?: boolean;
  onChange?: () => void;
  setOpenCommentsModal?: (open: boolean) => void;
  id: string;
  description: string;
  image: string;
  likesCount: number;
  avatarUrl: string;
  username: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
  modal = true,
  open = false,
  onChange,
  id,
  description,
  image,
  avatarUrl,
  username,
  likesCount,
}) => {
  const { isCommentsLoading, comments } = usePostStore();
  return (
    <>
      {/* <div className="absolute top-6 right-6 z-[10000] ">
        <Cross2Icon className="h-5 w-5 cursor-pointer"color="white" />
      </div> */}
      <Dialog modal={modal} open={open} onOpenChange={onChange}>
        <DialogContent
          className="sm:max-w-4xl  flex  gap-0 p-0 outline-none"
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
            <div className="flex space-x-3 items-center px-2 pt-2">
              <img
                className="w-10 h-10 rounded-full object-cover border"
                src={avatarUrl}
                alt={`${username} avatar`}
              />
              <div>
                <p className="font-semibold text-sm">
                  {username ?? "user06934"}
                </p>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="flex flex-col overflow-hidden  mt-4 gap-4 px-2 ">
              {!isCommentsLoading &&
                comments.map((cmt, i) => {
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items center gap-2">
                        <div className="flex">
                          <img
                            className="w-10 h-10 rounded-full object-cover border"
                            src={cmt.user.profilePicture}
                            alt={`${username} avatar`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm">{cmt.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </p>
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
          {/* <div className="w-1/2 aspect-square ">
          <img
            className="h-full w-full bg-contain  rounded-lg "
            style={{ backgroundImage: `url(${image})` }}
          />
        </div> */}
          {/* <div className="w-1/2 aspect-square p-2">
          <div className="flex space-x-3 items-center ">
            <img
              className="w-10 h-10 rounded-full object-cover border"
              src={avatarUrl}
              alt={`${username} avatar`}
            />
            <div>
              <p className="font-semibold text-sm">{username ?? "user06934"}</p>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="flex flex-col overflow-hidden  mt-2 gap-2 ">
            {!isCommentsLoading &&
              comments.map((cmt, i) => {
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items center gap-2">
                      <div className="flex">
                        <img
                          className="w-10 h-10 rounded-full object-cover border"
                          src={cmt.user.profilePicture}
                          alt={`${username} avatar`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm">{cmt.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <MoreHorizontal className="text-muted-foreground " />
                  </div>
                );
              })}
            {isCommentsLoading && (
              <div className="flex space-x-3 items-center mt-2">
                <div className="h-10 w-10 rounded-full border bg-gray-300 animate-pulse" />
                <div>
                  <p className="animate-pulse bg-gray-300 font-semibold text-sm w-[100px] h-2"></p>
                  <p className="animate-pulse bg-gray-300 text-sm mt-1 w-[50px] h-2"></p>
                </div>
              </div>
            )}
          </div>
        </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CommentModal;
