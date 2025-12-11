"use client";

import { useState, useEffect } from "react";
import type { User } from "@/shared/entities";
import { apiClient } from "@/shared/lib/api";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<User>("/api/v1/auth/me");
      setUser(data);
      setError(null);
    } catch (err) {
      setUser(null);
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
