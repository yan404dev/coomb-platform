import { useResume } from "@/hooks/use-resume";
import { resumeService } from "@/services";
import { toast } from "sonner";

export const useExperienceCardModel = () => {
  const { data: resume, mutate, isLoading, error } = useResume();

  const deleteExperience = async (experienceId: string) => {
    if (!resume) return;

    try {
      await resumeService.deleteExperience(experienceId);
      await mutate();
      toast.success("Experiência removida com sucesso");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Erro ao remover experiência";
      toast.error(errorMessage);
    }
  };

  return {
    experiences: resume?.experiences ?? [],
    isLoading,
    isError: error,
    deleteExperience,
  };
};
