import { useCallback, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { certificationService } from "../../_services/certification.service";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

      startTransition(async () => {
        try {
          if (isEditing && certificationId) {
            await certificationService.update(certificationId, {
              name: data.name,
              institution: data.institution,
              completionDate: data.completionDate,
            });
          } else {
            await certificationService.add({
              name: data.name,
              institution: data.institution,
              completionDate: data.completionDate,
            });
          }

          toast.success(
            isEditing
              ? "Certificação atualizada com sucesso"
              : "Certificação adicionada com sucesso"
          );

          router.refresh();
          onSuccess?.();
        } catch (error: any) {
          const errorMessage =
            error?.message ||
            (isEditing
              ? "Erro ao atualizar certificação"
              : "Erro ao adicionar certificação");
          toast.error(errorMessage);
        }
      });
    },
    [certificationId, router, onSuccess]
  );

  return {
    form,
    submitCertification,
    isPending,
  };
};
