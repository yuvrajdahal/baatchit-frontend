"use client";
import { useEffect, useState } from "react";
import DataProvider from "./data-provider";
import Loading from "@/components/loading";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Grand_Hotel } from "next/font/google";
import { twMerge } from "tailwind-merge";
const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isLoading, user, refreshUser } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
    refreshUser();
  }, []);
  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/login");
    }
  }, [router, isLoading, user]);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <p
          className={twMerge(
            "text-gray-500 animate-pulse text-4xl ",
            grandHotel.className
          )}
        >
          Baatchit
        </p>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
