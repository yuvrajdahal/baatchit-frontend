"use client";
import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    window.matchMedia(query).addEventListener("change", (e) => {
      setMatches(e.matches);
    });
    return () => {
      window.matchMedia(query).removeEventListener("change", (e) => {
        setMatches(e.matches);
      });
    };
  }, []);
  return matches;
};
