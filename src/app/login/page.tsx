"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstagramPost from "@/components/posts/IPost";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import PostSkeleton from "@/components/posts/skeletal-iposts";
import LogoLoading from "@/components/logo-loading";
import { usePosts } from "@/hooks/use-post";
import { useLogin } from "@/hooks/use-auth";

function Login() {
  const { toast } = useToast();
  const [isMounted, setMounted] = useState(true);
  const { data: postsData, isLoading } = usePosts();
  const posts = postsData?.posts || [];
  const router = useRouter();
  const params = useSearchParams();
  const param = params.get("logout");

  const loginMutation = useLogin();

  useEffect(() => {
    setMounted(false);
  }, []);

  useEffect(() => {
    if (param) {
      localStorage.clear();
      router.replace("/login", undefined);
    }
  }, [param, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast({
              title: "Success",
              description: "You have successfully logged in",
              variant: "default",
            });
            router.push("/");
          } else {
            toast({
              title: "Error",
              description: data.error || "Login failed",
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <Loading /> : "Login"}
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
      <div className="hidden bg-muted snap-y snap-mandatory lg:flex flex-col items-center overflow-hidden overflow-y-scroll remove-scrollbar transition-all duration-300 ease-in-out">
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

export default Login;
