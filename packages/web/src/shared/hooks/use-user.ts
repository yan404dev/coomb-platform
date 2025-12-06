"use client";

import { useEffect } from "react";
import useSWR from "swr";
import type { User } from "@/shared/types";
import { authService } from "@/shared/services";

export function useUser() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<User>(
    "/api/v1/auth/me",
    () => authService.me()
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!data) {
      try {
        window.localStorage.removeItem("user");
      } catch {
        // Ignore errors (e.g., in private browsing mode)
      }
      return;
    }

    try {
      window.localStorage.setItem("user", JSON.stringify(data));
    } catch {
      // Ignore errors (e.g., storage quota exceeded)
    }
  }, [data]);

  return {
    user: data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
