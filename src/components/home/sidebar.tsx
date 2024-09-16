"use client";
import {
  Home,
  Search,
  Compass,
  MessageSquare,
  Heart,
  PlusSquare,
  User,
  Menu,
} from "lucide-react";
import CreatePostModal from "./create-post-modal";
import usePostStore from "@/hooks/use-post";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { twMerge } from "tailwind-merge";
import useAuthStore from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Grand_Hotel } from "next/font/google";
import { useState } from "react";
import { Button } from "../ui/button";

const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
interface SidebarItemProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  show?: boolean;
  active?: boolean;
  notification?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}
const MenuSideBarItem: React.FC<SidebarItemProps> = ({
  Icon,
  text,
  show = true,
  active,
  onClick,
  children,
}) => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger
          onClick={onClick}
          className={twMerge(
            `relative group flex items-center cursor-pointer w-full  bg-white duration-300 ease-in-out hover:bg-muted py-3  gap-4`,
            active ? "font-bold" : "",
            show ? "px-5" : "justify-center"
          )}
        >
          <Icon className="w-6 h-6  group-hover:scale-110" />
          <span className={twMerge("text-lg", show ? "opacity-100" : "opacity-0 absolute")}>
            {text}
          </span>
        </MenubarTrigger>
        <MenubarContent align="end" className={twMerge("w-full")}>
          {children}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  Icon,
  text,
  show = true,
  active,
  notification,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      data-show={show}
      className={twMerge(
        `relative group flex  items-center cursor-pointer  tranition duration-300 ease-in-out hover:bg-muted py-3 space-x-4 `,
        active ? "font-bold" : "",
        show ? "px-5" : "justify-center"
      )}
    >
      <Icon className="w-6 h-6 group-hover:scale-110" />
      <span className={twMerge("text-lg", show ? "opacity-100" : "opacity-0 absolute")}>
        {text}
      </span>
      {notification && (
        <span className="absolute top-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex justify-center items-center">
          {notification}
        </span>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [show, setShow] = useState(true);
  const { fetchPosts, setTogglePostModal, togglePostModal } = usePostStore();
  const router = useRouter();
  const pathName = usePathname();
  return (
    <>
      <div className={twMerge("h-screen  group w-64")}>
        <div
          className={twMerge(
            "h-full pb-5  bg-white transition-all duration-600 flex flex-col items-start border-r",
            "data-[show='true']:w-full data-[show='false']:w-14"
          )}
          data-show={show}
        >
          <h1
            className={twMerge(
              "text-4xl font-bold mb-6 py-5 ",
              show ? "px-5" : "pl-4",
              grandHotel.className
            )}
          >
            {show ? "Baatchit" : "B"}
          </h1>
          <div className="flex flex-col  w-full">
            <SidebarItem
              Icon={Home}
              show={show}
              text="Home"
              active={pathName === "/"}
              onClick={() => {
                fetchPosts();
                router.push("/");
              }}
            />
            <SidebarItem
              Icon={Search}
              text="Search"
              show={show}
              onClick={() => {
                setShow((prev) => !prev);
              }}
            />
            <SidebarItem
              Icon={Compass}
              text="Explore"
              show={show}
              active={pathName === "/explore"}
              onClick={() => {
                router.push("/explore");
              }}
            />
            <SidebarItem
              Icon={MessageSquare}
              text="Messages"
              show={show}
              notification="3"
            />
            <SidebarItem Icon={Heart} text="Notifications" show={show} />
            <SidebarItem
              Icon={PlusSquare}
              text="Create"
              show={show}
              onClick={() => setTogglePostModal(true)}
            />
            <SidebarItem
              Icon={User}
              active={pathName === "/profile"}
              text="Profile"
              show={show}
              onClick={() => {
                router.push("/profile");
              }}
            />
          </div>
          <div className="w-full mt-auto">
            <MenuSideBarItem Icon={Menu} text="More" show={show}>
              <MenubarItem
                className={twMerge(
                  `relative flex items-center cursor-pointer  duration-300 ease-in-out  py-2 px-5 space-x-4 `
                )}
                onClick={() => {
                  router.push("/login?logout=true");
                }}
              >
                Logout
              </MenubarItem>
            </MenuSideBarItem>
          </div>
        </div>
      </div>
      <SearchModal show={show} />
      <CreatePostModal
        open={togglePostModal}
        onChange={() => setTogglePostModal(!togglePostModal)}
        setOpenPostModal={setTogglePostModal}
      />
    </>
  );
};

export default Sidebar;
const SearchModal: React.FC<{
  show: boolean;
}> = ({ show }) => {
  return (
    <div
      className={twMerge(
        "absolute flex h-full w-[360px]  border items-center justify-center border-r bg-white",
        "data-[show='false']:flex data-[show='true']:hidden",
        "",
        "data-[show='true']:translate-x-[-100%] data-[show='false']:translate-x-0"
      )}
      data-show={show}
    ></div>
  );
};
