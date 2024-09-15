"use client";
import { useEffect, useState } from "react";
import DataProvider from "./data-provider";
import Loading from "@/components/loading";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Grand_Hotel } from "next/font/google";
import { twMerge } from "tailwind-merge";
import LogoLoading from "@/components/logo-loading";
import { useToast } from "@/hooks/use-toast";
const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isLoading, user, refreshUser, loadMessage, setLoadMessage } =
    useAuthStore();
  const [showonce, setShowonce] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
    refreshUser();
  }, []);
  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/login");
    } else {
      if (isMounted && loadMessage === false) {
        toast({
          title: `Hello ${user?.fullname}`,
          description: "The first load of system can take a while",
        });
        setLoadMessage(true);
      }
    }
  }, [router, isLoading, user, isMounted]);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <LogoLoading />
      </div>
    );
  }

  return children;
};

export default AuthProvider;
