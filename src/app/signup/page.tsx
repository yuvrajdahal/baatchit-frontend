"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstagramPost from "@/components/posts/IPost";

import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

function Signup() {
  const { register, isRegisterLoading, error } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullname = formData.get("fullname") as string;
    const username = formData.get("username") as string;
    const success = await register(email, fullname, username, password);
    if (success && !isRegisterLoading) {
      toast({
        title: "Success",
        description: "You have successfully registered",
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
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? <Loading /> : "Sinup"}
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
        {[...Array(10)].map((_, i) => {
          return (
            <div
              className="snap-center flex-shrink-0 h-full flex flex-col justify-center items-center"
              key={i}
            >
              <InstagramPost
                id="60c7b8d8c9b4d1d6c0b0"
                isLiked={false}
                avatarUrl="https://placeholder.pics/svg/200"
                postImageUrl="https://placeholder.pics/svg/1080"
                username="mihirlifts"
                timeAgo="10m"
                likes={6763}
                caption="6ft Aesthetics ✨"
                commentCount={66}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Signup;
