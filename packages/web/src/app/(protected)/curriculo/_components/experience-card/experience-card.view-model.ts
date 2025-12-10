import { useCallback, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Experience } from "@/shared/types";
import { deleteExperienceAction } from "../../_actions/resume.actions";
import { formatPeriod, truncateText } from "@/shared/lib/format";

interface ExperienceViewModel {
  id: string;
  position: string;
  company: string;
  period: string;
  description: string | null;
}

export function useExperienceCardViewModel(
  experiences: Experience[],
  onEdit?: (experienceId: string) => void
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const experiencesData = useMemo<ExperienceViewModel[]>(
    () =>
      experiences.map((exp) => ({
        id: exp.id,
        position: exp.position,
        company: exp.company,
        period: formatPeriod(exp.startDate, exp.endDate, exp.current ?? false),
        description: exp.description ? truncateText(exp.description) : null,
      })),
    [experiences]
  );

  const isEmpty = useMemo(
    () => experiences.length === 0,
    [experiences.length]
  );

  const deleteExperience = useCallback(
    (experienceId: string) => {
      startTransition(async () => {
        try {
          await deleteExperienceAction(experienceId);
          toast.success("Experiência removida com sucesso");
          router.refresh();
        } catch (error: any) {
          const errorMessage = error?.message || "Erro ao remover experiência";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  const handleEdit = useCallback(
    (experienceId: string) => {
      onEdit?.(experienceId);
    },
    [onEdit]
  );

  return {
    experiencesData,
    isEmpty,
    isPending,
    deleteExperience,
    handleEdit,
  };
}
