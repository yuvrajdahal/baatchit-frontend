"use client";
import useAuthStore from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { refreshUser, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  // useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading]);
  return children;
};

export default AuthProvider;
