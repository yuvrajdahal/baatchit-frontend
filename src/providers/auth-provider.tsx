"use client";
import { useEffect, useState } from "react";
import DataProvider from "./data-provider";
import Loading from "@/components/loading";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

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
        <Loading className="h-6 w-6" />
      </div>
    );
  }

  return children;
};

export default AuthProvider;
