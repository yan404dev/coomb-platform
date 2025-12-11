"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/shared/entities";
import { getUserAction } from "@/shared/actions/user.actions";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cachedUser = typeof window !== "undefined"
        ? window.localStorage.getItem("user")
        : null;

      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }

      const userData = await getUserAction();

      if (userData) {
        setUser(userData);
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem("user", JSON.stringify(userData));
          } catch {
            // Ignore storage errors
          }
        }
      } else {
        setUser(null);
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem("user");
          } catch {
            // Ignore storage errors
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      setUser(null);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("user");
        } catch {
          // Ignore storage errors
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const mutate = useCallback(() => {
    return fetchUser();
  }, [fetchUser]);

  return {
    user,
    error,
    isLoading,
    isValidating: isLoading,
    mutate,
  };
}
