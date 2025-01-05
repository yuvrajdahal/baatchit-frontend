"use client";
import LogoLoading from "@/components/logo-loading";
import { useCurrentUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { data: userData, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (!userData?.user && !isLoading) {
        router.push("/login");
      }
    }
  }, [router, isLoading, userData, isMounted]);

  if (!isMounted || isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <LogoLoading />
      </div>
    );
  }

  if (isError) {
    router.push("/login");
    return null;
  }

  return children;
};

export default AuthProvider;
