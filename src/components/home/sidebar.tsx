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

const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
interface SidebarItemProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  active?: boolean;
  notification?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}
const MenuSideBarItem: React.FC<SidebarItemProps> = ({
  Icon,
  text,
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
            `relative group flex items-center cursor-pointer w-full tranition bg-white duration-300 ease-in-out hover:bg-muted py-3 px-5 gap-4`,
            active ? "font-bold" : ""
          )}
        >
          <Icon className="w-6 h-6 group-hover:scale-110" />
          <span className="text-lg">{text}</span>
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
  active,
  notification,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group flex items-center cursor-pointer  tranition duration-300 ease-in-out hover:bg-muted py-3 px-5 space-x-4 ${
        active ? "font-bold" : ""
      }`}
    >
      <Icon className="w-6 h-6 group-hover:scale-110" />
      <span className="text-lg">{text}</span>
      {notification && (
        <span className="absolute top-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex justify-center items-center">
          {notification}
        </span>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { fetchPosts, setTogglePostModal, togglePostModal } = usePostStore();
  const router = useRouter();
  const pathName = usePathname();
  return (
    <>
      <div className="h-screen pb-5  bg-white w-64 flex flex-col items-start border-r">
        <h1
          className={twMerge(
            "text-4xl font-bold mb-6 py-5 px-5",
            grandHotel.className
          )}
        >
          Baatchit
        </h1>
        <div className="flex flex-col  w-full">
          <SidebarItem
            Icon={Home}
            text="Home"
            active={pathName === "/"}
            onClick={() => {
              fetchPosts();
              router.push("/");
            }}
          />
          <SidebarItem Icon={Search} text="Search" />
          <SidebarItem
            Icon={Compass}
            text="Explore"
            active={pathName === "/explore"}
            onClick={() => {
              router.push("/explore");
            }}
          />
          <SidebarItem Icon={MessageSquare} text="Messages" notification="3" />
          <SidebarItem Icon={Heart} text="Notifications" />
          <SidebarItem
            Icon={PlusSquare}
            text="Create"
            onClick={() => setTogglePostModal(true)}
          />
          <SidebarItem
            Icon={User}
            active={pathName === "/profile"}
            text="Profile"
            onClick={() => {
              router.push("/profile");
            }}
          />
        </div>
        <div className="w-full mt-auto">
          <MenuSideBarItem Icon={Menu} text="More">
            <MenubarItem
              className={twMerge(
                `relative flex items-center cursor-pointer tranition duration-300 ease-in-out  py-2 px-5 space-x-4 `
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
      <CreatePostModal
        open={togglePostModal}
        onChange={() => setTogglePostModal(!togglePostModal)}
        setOpenPostModal={setTogglePostModal}
      />
    </>
  );
};

export default Sidebar;
