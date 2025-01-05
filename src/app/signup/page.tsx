"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstagramPost from "@/components/posts/IPost";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { Post } from "@/data-access/types";
import { useEffect, useState } from "react";
import PostSkeleton from "@/components/posts/skeletal-iposts";
import LogoLoading from "@/components/logo-loading";
import { useRegister } from "@/hooks/use-auth";
import { usePosts } from "@/hooks/use-post";

function Signup() {
  const { toast } = useToast();
  const [isMounted, setMounted] = useState(true);
  const { data: postsData, isLoading } = usePosts();
  const posts = postsData?.posts || [];
  const router = useRouter();

  const registerMutation = useRegister();

  useEffect(() => {
    setMounted(false);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullname = formData.get("fullname") as string;
    const username = formData.get("username") as string;

    registerMutation.mutate(
      { email, fullname, username, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast({
              title: "Success",
              description: "You have successfully registered",
              variant: "default",
            });
            router.push("/");
          } else {
            toast({
              title: "Error",
              description: data.error || "Registration failed",
              variant: "destructive",
            });
          }
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
        },
      }
    );
  }

  if (isMounted)
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center">
        <LogoLoading />
      </div>
    );
  return (
    <div className="w-full lg:grid h-[100dvh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <form className="mx-auto grid  gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2 ">
            <h1 className="text-3xl font-bold">Signup</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to signup to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="John Doe"
                name="fullname"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                name="username"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                name="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? <Loading /> : "Signup"}
            </Button>
          </div>

          <div className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted  snap-y snap-mandatory lg:flex flex-col  items-center overflow-hidden overflow-y-scroll remove-scrollbar transition-all duration-300 ease-in-out">
        {(posts.length === 0 || isLoading || isMounted) &&
          [...Array(5)].map((_, i) => {
            return <PostSkeleton key={i} />;
          })}
        {posts.map((post, i) => {
          return (
            <div
              className="snap-center flex-shrink-0 h-full flex flex-col justify-center items-center"
              key={i}
            >
              <InstagramPost post={post} disbaleLikeAndComment />
            </div>
          );
        })}
      </div>
    </div>
  );
}
const post: Post = {
  _id: "60c7b8d8c9b4d1d6c0b0",
  createdAt: new Date(),
  comments: [],
  description: "6ft Aesthetics ✨",
  image: "https://placeholder.pics/svg/1080",
  imageid: "60c7b8d8c9b4d1d6c0b0",
  isLiked: false,
  likesCount: 0,
  links: [],
  user: {
    _id: "60c7b8d8c9b4d1d6c0b0",
    createdAt: new Date(),
    email: "",
    emailToken: "",
    fullname: "mihirlifts",
    followers: [],
    following: [],
    isFollowing: false,
    isVerified: false,
    password: "",
    profilePicture: "https://placeholder.pics/svg/200",
    username: "mihirlifts",
  },
};
export default Signup;
