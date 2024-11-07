import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./(root)/globals.css";
import SystemMessage from "@/components/system-message";
import ModalProvider from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baatchit: A Social Media Platform",
  description:
    "Website where you can share your ideas and connect with like-minded people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
        <SystemMessage />
        <ModalProvider />
      </body>
    </html>
  );
}
