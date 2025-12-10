import { useCallback, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Certification } from "@/shared/types";
import { deleteCertificationAction } from "../../_actions/resume.actions";

interface CertificationViewModel {
  id: string;
  name: string;
  institution: string;
  completionDate: string;
}

export function useCertificationCardViewModel(
  certifications: Certification[],
  onEdit?: (certificationId: string) => void
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const certificationsData = useMemo<CertificationViewModel[]>(
    () =>
      certifications.map((cert) => ({
        id: cert.id,
        name: cert.name,
        institution: cert.institution,
        completionDate: cert.completionDate,
      })),
    [certifications]
  );

  const isEmpty = useMemo(
    () => certifications.length === 0,
    [certifications.length]
  );

  const deleteCertification = useCallback(
    (certificationId: string) => {
      startTransition(async () => {
        try {
          await deleteCertificationAction(certificationId);
          toast.success("Certificação removida com sucesso");
          router.refresh();
        } catch (error: any) {
          const errorMessage = error?.message || "Erro ao remover certificação";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  const handleEdit = useCallback(
    (certificationId: string) => {
      onEdit?.(certificationId);
    },
    [onEdit]
  );

  return {
    certificationsData,
    isEmpty,
    isPending,
    deleteCertification,
    handleEdit,
  };
}
