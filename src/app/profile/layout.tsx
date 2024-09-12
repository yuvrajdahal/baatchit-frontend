import Loading from "@/components/loading";
import AuthProvider from "@/providers/auth-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "User Profile Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="w-full h-full">
      <AuthProvider> {children}</AuthProvider>
    </section>
  );
}
