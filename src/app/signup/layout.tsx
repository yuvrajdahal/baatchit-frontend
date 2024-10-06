import Loading from "@/components/loading";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Baatchit: Signup",
  description:
    "Website where you can share your ideas and connect with like-minded people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="w-full h-full">{children}</section>;
}
