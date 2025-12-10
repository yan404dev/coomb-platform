import { useCallback, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Education } from "@/shared/types";
import { deleteEducationAction } from "../../_actions/resume.actions";
import { formatPeriod } from "@/shared/lib/format";

interface EducationViewModel {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export function useEducationCardViewModel(
  educations: Education[],
  onEdit?: (educationId: string) => void
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const educationsData = useMemo<EducationViewModel[]>(
    () =>
      educations.map((edu) => ({
        id: edu.id,
        degree: edu.degree,
        institution: edu.institution,
        period: formatPeriod(edu.startDate, edu.endDate, edu.current ?? false),
      })),
    [educations]
  );

  const isEmpty = useMemo(
    () => educations.length === 0,
    [educations.length]
  );

  const deleteEducation = useCallback(
    (educationId: string) => {
      startTransition(async () => {
        try {
          await deleteEducationAction(educationId);
          toast.success("Formação removida com sucesso");
          router.refresh();
        } catch (error: any) {
          const errorMessage = error?.message || "Erro ao remover formação";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  const handleEdit = useCallback(
    (educationId: string) => {
      onEdit?.(educationId);
    },
    [onEdit]
  );

  return {
    educationsData,
    isEmpty,
    isPending,
    deleteEducation,
    handleEdit,
  };
}
