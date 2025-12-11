"use client";

import { useState, useEffect } from "react";
import type { User } from "@/shared/entities";
import { apiClient } from "@/shared/lib/api";

const CACHE_KEY = "user";

export function useUser() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<User>("/api/v1/auth/me");
      setUser(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem(CACHE_KEY);
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    error,
    isLoading,
    isValidating: isLoading,
    mutate: fetchUser,
  };
}
