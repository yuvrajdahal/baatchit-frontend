"use client";
import Sidebar from "@/components/home/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-auth";

interface ProfileFormData {
  username: string;
  description: string;
  gender: string;
}
export default function ProfilePage() {
  const { data: userData } = useCurrentUser();
  const user = userData?.user;
  const [formData, setFormData] = useState<ProfileFormData>({
    username: user?.username || "",
    description: user?.description || "",
    gender: "",
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelectChange = (value: string, name: keyof ProfileFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-dark h-[100dvh] w-screen text-light ">
      <div className="h-full w-full flex justify-between">
        <Sidebar user={userData?.user!} />
        <div className="bg-muted/20 flex-1  flex flex-col   overflow-x-hidden  remove-scrollbar transition-all duration-300 ease-in-out px-6 py-6">
          <div>
            <h2 className="text-2xl font-semibold">Edit Profile</h2>
            <p className="text-sm text-muted-foreground ">
              Edit your profile details here.
            </p>
          </div>
          <div className="max-w-[600px] flex flex-col gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Gender</Label>
              <Select
                onValueChange={(value) => handleSelectChange(value, "gender")}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                className="min-h-[100px] "
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  router.push("/profile");
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
