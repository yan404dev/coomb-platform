import { serverFetch } from "@/shared/lib/server-api";
import type { ResumeEntity } from "@/shared/types";

export async function getResume(): Promise<ResumeEntity | null> {
  return serverFetch<ResumeEntity>("/api/v1/resume", {
    cache: "no-store",
  });
}
