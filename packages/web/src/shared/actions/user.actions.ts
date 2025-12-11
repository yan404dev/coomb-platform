"use server";

import { serverApi } from "@/shared/lib/server-api";
import type { User } from "@/shared/entities";

export async function getUserAction(): Promise<User | null> {
  try {
    const user = await serverApi.get<User>("/api/v1/auth/me");
    return user;
  } catch {
    return null;
  }
}
