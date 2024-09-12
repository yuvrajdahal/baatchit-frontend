"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstagramPost from "@/components/posts/IPost";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import usePostStore from "@/hooks/use-post";
import PostSkeleton from "@/components/posts/skeletal-iposts";


function Login() {
  const { toast } = useToast();
  const { login, logout, error, isLoginLoading } = useAuthStore();
  const [isMounted, setMounted] = useState(true);
  const { posts, error: postError, fetchPosts, isLoading } = usePostStore();

  const router = useRouter();
  const params = useSearchParams();
  const param=params.get("logout");
  useEffect(() => {
    setMounted(false);
    fetchPosts();
  }, []);

  useEffect(() => {
    if (param) {
      logout();
      router.replace("/login", undefined);
    }
  }, [param]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const success = await login(email, password);
    if (success && !isLoginLoading) {
      toast({
        title: "Success",
        description: "You have successfully logged in",
        variant: "default",
      });
      router.push("/");
    }
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }
  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <form className="mx-auto grid  gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2 ">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
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
            <Button type="submit" className="w-full" disabled={isLoginLoading}>
              {isLoginLoading ? <Loading /> : "Login"}
            </Button>
          </div>
          <div className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/signup"} className="underline">
              Signup
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted  snap-y snap-mandatory lg:flex flex-col  items-center overflow-hidden overflow-y-scroll remove-scrollbar transition-all duration-300 ease-in-out">
        {(isLoading || isMounted) &&
          [...Array(5)].map((_, i) => {
            return <PostSkeleton key={i} />;
          })}
        {posts.map((post, i) => {
          return (
            <div
              className="snap-center flex-shrink-0 h-full flex flex-col justify-center items-center"
              key={i}
            >
              <InstagramPost
                id={post?._id}
                isLiked={false}
                disbaleLikeAndComment={true}
                avatarUrl={post?.user?.profilePicture ?? ""}
                postImageUrl={post?.image ?? ""}
                username={post?.user?.username ?? ""}
                timeAgo="10m"
                likes={post?.likesCount}
                caption={post?.description ?? ""}
                commentCount={post?.comments?.length ?? 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Login;
