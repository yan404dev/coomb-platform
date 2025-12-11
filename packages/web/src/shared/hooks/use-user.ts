"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/shared/entities";
import { apiClient } from "@/shared/lib/api";

function getCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: User | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch {}
}

export function useUser() {
  const [user, setUser] = useState<User | null>(getCachedUser);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<User>("/api/v1/auth/me");
      setUser(data);
      setCachedUser(data);
      setError(null);
    } catch (err) {
      setUser(null);
      setCachedUser(null);
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    error,
    isLoading,
    isValidating: isLoading,
    mutate: fetchUser,
  };
}
