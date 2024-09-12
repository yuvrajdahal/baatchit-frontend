"use client";
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import usePostStore from "@/hooks/use-post";

const NoPostsYet: React.FC = () => {
  const { setTogglePostModal } = usePostStore();
  return (
    <div className="snap-center flex-shrink-0 h-full flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted rounded-lg p-8 text-center">
        <PlusCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Posts Yet</h2>
        <p className="text-muted-foreground mb-6">
          Be the first to share a moment!
        </p>
        <Button
          size={"default"}
          onClick={() => {
            setTogglePostModal(true);
          }}
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};

export default NoPostsYet;
