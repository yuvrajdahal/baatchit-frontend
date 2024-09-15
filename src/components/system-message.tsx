"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const SystemMessage: React.FC = () => {
  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: "Welcome to Baatchit",
      description: "The first boot of the website may take a while",
    });
  }, []);
  return <></>;
};
export default SystemMessage;