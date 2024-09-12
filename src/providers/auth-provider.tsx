"use client";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false);
  const { refreshUser, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted === false) return;
    if (mounted && !isAuthenticated && !isLoading) {
      refreshUser();
      router.push("/login");
    }
  }, [mounted, isAuthenticated, isLoading, refreshUser]);
  return children;
};

export default AuthProvider;
