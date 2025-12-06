import useSWR from "swr";
import type { ResumeEntity } from "@/entities";
import { resumeService } from "@/services";

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
