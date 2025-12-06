import { useResume } from "../../_hooks/use-resume";
import { resumeService } from "../../_services/resume.service";
import { toast } from "sonner";

export const useCertificationCardModel = () => {
  const { data: resume, mutate, isLoading, error } = useResume();

  const deleteCertification = async (certificationId: string) => {
    if (!resume) return;

    try {
      await resumeService.deleteCertification(certificationId);
      await mutate();
      toast.success("Certificação removida com sucesso");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Erro ao remover certificação";
      toast.error(errorMessage);
    }
  };

  return {
    certifications: resume?.certifications ?? [],
    isLoading,
    isError: error,
    deleteCertification,
  };
};
