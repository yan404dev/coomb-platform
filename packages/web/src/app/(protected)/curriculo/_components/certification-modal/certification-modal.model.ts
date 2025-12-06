import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "@/hooks/use-resume";
import { resumeService } from "@/services";
import { toast } from "sonner";
import {
  certificationSchema,
  type CertificationRequest,
} from "./certification-modal.schema";

interface UseCertificationModalModelProps {
  defaultValues?: CertificationRequest | null;
  certificationId?: string;
  onSuccess?: () => void;
  open: boolean;
}

export const useCertificationModalModel = ({
  defaultValues,
  certificationId,
  onSuccess,
  open,
}: UseCertificationModalModelProps) => {
  const { mutate } = useResume();

  const form = useForm<CertificationRequest>({
    resolver: zodResolver(certificationSchema),
    defaultValues: defaultValues ?? {
      name: "",
      institution: "",
      completionDate: "",
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
    } else if (!open) {
      form.reset({
        name: "",
        institution: "",
        completionDate: "",
      });
    }
  }, [open, defaultValues, form]);

  const submitCertification = useCallback(
    async (data: CertificationRequest) => {
      const isEditing = !!certificationId;

      try {
        if (isEditing && certificationId) {
          await resumeService.updateCertification(certificationId, {
            name: data.name,
            institution: data.institution,
            completionDate: data.completionDate,
          });
        } else {
          await resumeService.addCertification({
            name: data.name,
            institution: data.institution,
            completionDate: data.completionDate,
          });
        }

        await mutate();

        toast.success(
          isEditing
            ? "Certificação atualizada com sucesso"
            : "Certificação adicionada com sucesso"
        );

        onSuccess?.();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          (isEditing
            ? "Erro ao atualizar certificação"
            : "Erro ao adicionar certificação");
        toast.error(errorMessage);
      }
    },
    [certificationId, mutate, onSuccess]
  );

  return {
    form,
    submitCertification,
  };
};
