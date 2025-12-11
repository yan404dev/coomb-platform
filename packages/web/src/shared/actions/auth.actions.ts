"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/entrar");
}

export async function transferSessionAction(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || !sessionId) return;

  try {
    await fetch(`${API_URL}/api/v1/session/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId }),
    });
  } catch {
    console.error("Failed to transfer session");
  }
}
