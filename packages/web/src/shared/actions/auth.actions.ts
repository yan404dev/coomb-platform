"use server";

import { redirect } from "next/navigation";
import { serverApi, authCookie } from "@/shared/lib/server-api";

export async function logoutAction(): Promise<void> {
  await authCookie.delete();
  redirect("/entrar");
}

export async function transferSessionAction(sessionId: string): Promise<void> {
  if (!sessionId) return;

  try {
    await serverApi.post("/api/v1/session/transfer", { sessionId });
  } catch {}
}
