import useSWR from "swr";
import type { ResumeEntity } from "@/shared/types";
import { resumeService } from "../_services/resume.service";

export function useResume() {
  const { data, error, isLoading, mutate } = useSWR<ResumeEntity | undefined>(
    "/api/v1/resume",
    async () => {
      try {
        return await resumeService.get();
      } catch (error: any) {
        if (error?.response?.status === 401) {
          return undefined;
        }
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
