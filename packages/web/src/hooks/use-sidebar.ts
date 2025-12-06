"use client";

import { useCallback, useState } from "react";
import { useMediaQuery } from "./use-media-query";

export interface UseSidebarReturn {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  isMobile: boolean;
}

export function useSidebar(): UseSidebarReturn {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    toggle,
    close,
    open,
    isMobile,
  };
}
