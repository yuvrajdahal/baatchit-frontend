"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

import React, { useState, useEffect, SetStateAction, Dispatch } from "react";

interface CreatePostModalProps {
  modal?: boolean;
  open?: boolean;
  onChange?: () => void;
  setOpenSettingsModal: (open: boolean) => void;
}

const SettingsModal: React.FC<CreatePostModalProps> = ({
  modal = true,
  open = false,
  onChange,
  setOpenSettingsModal,
}) => {
  const router = useRouter();
  return (
    <Dialog modal={modal} open={open} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-md py-1 px-1" showCancelIcon="hide">
        <div className="flex flex-col divide-y divide-gray-300 justify-center items-center">
          <div
            className="hover:bg-muted/70 cursor-pointer py-3 text-normal flex justify-center items-center w-full"
            onClick={() => {
              router.push("/login?logout=true");
              setOpenSettingsModal(false)
            }}
          >
            Logout
          </div>
          <div
            className="hover:bg-muted/70 cursor-pointer py-3 text-normal flex justify-center items-center w-full"
            onClick={() => setOpenSettingsModal(false)}
          >
            Cancel
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SettingsModal;
