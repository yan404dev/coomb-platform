import { useResume } from "@/hooks/use-resume";
import { resumeService } from "@/services";
import { toast } from "sonner";

export const useEducationCardModel = () => {
  const { data: resume, mutate, isLoading, error } = useResume();

  const deleteEducation = async (educationId: string) => {
    if (!resume) return;

    try {
      await resumeService.deleteEducation(educationId);
      await mutate();
      toast.success("Formação removida com sucesso");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Erro ao remover formação";
      toast.error(errorMessage);
    }
  };

  return {
    educations: resume?.educations ?? [],
    isLoading,
    isError: error,
    deleteEducation,
  };
};
