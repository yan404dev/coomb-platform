"use client";

import { useState, useEffect } from "react";
import type { User } from "@/shared/entities";
import { apiClient } from "@/shared/lib/api";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.get<User>("/api/v1/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, isLoading, mutate: fetchUser };
}
