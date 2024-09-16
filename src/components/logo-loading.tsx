import React from "react";
import { Grand_Hotel } from "next/font/google";
import { twMerge } from "tailwind-merge";
const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {}
const LogoLoading: React.FC<Props> = ({ className }) => {
  return (
    <p
      className={twMerge(
        "text-gray-500 animate-pulse text-6xl ",
        grandHotel.className,
        className
      )}
    >
      Baatchit
    </p>
  );
};
export default LogoLoading;
