import AuthProvider from "@/providers/auth-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baatchit: Explore",
  description:
    "Website where you can share your ideas and connect with like-minded people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="w-full h-full">
      <AuthProvider>
         {children}
      </AuthProvider>
    </section>
  );
}
