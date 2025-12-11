import { serverFetch } from "@/shared/lib/server-api";
import type { Resume } from "@/shared/entities";

export async function getResume(): Promise<Resume | null> {
  return serverFetch<Resume>("/api/v1/resume", {
    cache: "no-store",
  });
}
