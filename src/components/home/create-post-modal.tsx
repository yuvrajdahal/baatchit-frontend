"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCreatePost } from "@/hooks/use-post";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import { useState, useEffect } from "react";

interface CreatePostModalProps {
  modal?: boolean;
  open?: boolean;
  onChange?: () => void;
  setOpenPostModal: (open: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  modal = true,
  open = false,
  onChange,
  setOpenPostModal,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [toggleForm, setToggleForm] = useState(false);
  const [description, setDescription] = useState("");
  const { data: userData } = useCurrentUser();
  const { toast } = useToast();
  const {
    mutate: createPost,
    isPending: isCreatingPost,
    error,
    isSuccess,
  } = useCreatePost();

  function onfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (!url) return;
    setImage(url);
  }

  useEffect(() => {
    if (open === false) {
      const interval = setTimeout(() => {
        setImage(null);
        setFile(null);
        setDescription("");
        setToggleForm(false);
      }, 300);
      return () => clearTimeout(interval);
    }
  }, [open]);

  async function handleImageUpload() {
    if (!file) return;
    
    const image = new FormData();
    image.append("image", file);
    
    createPost(
      { description, image },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Post created successfully",
          });
          setOpenPostModal(false);
          setTimeout(() => setToggleForm(false), 1000);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <Dialog modal={modal} open={open} onOpenChange={onChange}>
      <DialogContent className="max-w-sm  md:max-w-md z-[1000]">
        <DialogHeader>
          <div className="text-center font-semibold">Create new post</div>
          <hr />
        </DialogHeader>
        <div className="flex flex-col justify-center items-center">
          {!image && (
            <>
              <div className="flex flex-col">
                <h2 className="text-xl">Drag and drop or select a file</h2>
              </div>
              <Button type="submit" size="sm" className="relative mt-3 ">
                {file ? file.name : " Select or upload from your computer"}
                <input
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  type="file"
                  onChange={onfileChange}
                  accept="image/*"
                />
              </Button>
            </>
          )}
          {image && !toggleForm && (
            <div className="flex flex-col ">
              <DialogDescription className="text-center text-xs pb-2">
                The image will be croped to 4:5 ratio
              </DialogDescription>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  className="h-full w-full object-contain"
                  src={image}
                  alt="Post Image"
                />
              </div>

              <Button
                onClick={() => {
                  setToggleForm(true);
                }}
                size="sm"
                className="relative mt-3 "
              >
                Next
              </Button>
            </div>
          )}
          {image && toggleForm && (
            <form className="w-full flex flex-col items-start">
              <div className="flex space-x-3 items-center mb-2">
                <img
                  src={userData?.user?.profilePicture}
                  alt="User Profile"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">{userData?.user?.username}</p>
                  <p className="text-gray-500 text-sm">{userData?.user?.fullname}</p>
                </div>
              </div>
              <textarea
                className="resize-none h-[150px] w-full outline-none"
                placeholder="Write something..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Button
                size="sm"
                className="mt-2 w-full"
                disabled={isCreatingPost}
                onClick={(e) => {
                  e.preventDefault();
                  handleImageUpload();
                }}
              >
                {isCreatingPost ? <Loading /> : "Share"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
