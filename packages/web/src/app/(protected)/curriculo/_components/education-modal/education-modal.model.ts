import { useCallback, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addEducationAction,
  updateEducationAction,
} from "../../_actions/resume.actions";
import {
  educationSchema,
  type EducationRequest,
} from "./education-modal.schema";

interface UseEducationModalModelProps {
  defaultValues?: EducationRequest | null;
  educationId?: string;
  onSuccess?: () => void;
  open: boolean;
}

export const useEducationModalModel = ({
  defaultValues,
  educationId,
  onSuccess,
  open,
}: UseEducationModalModelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EducationRequest>({
    resolver: zodResolver(educationSchema),
    defaultValues: defaultValues ?? {
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      current: false,
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
    } else if (!open) {
      form.reset({
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    }
  }, [open, defaultValues, form]);

  const submitEducation = useCallback(
    async (data: EducationRequest) => {
      const isEditing = !!educationId;

      startTransition(async () => {
        try {
          if (isEditing && educationId) {
            await updateEducationAction(educationId, {
              degree: data.degree,
              institution: data.institution,
              startDate: data.startDate,
              endDate: data.endDate,
              current: data.current,
            });
          } else {
            await addEducationAction({
              degree: data.degree,
              institution: data.institution,
              startDate: data.startDate,
              endDate: data.endDate,
              current: data.current,
            });
          }

          toast.success(
            isEditing
              ? "Formação atualizada com sucesso"
              : "Formação adicionada com sucesso"
          );

          router.refresh();
          onSuccess?.();
        } catch (error: any) {
          const errorMessage =
            error?.message ||
            (isEditing
              ? "Erro ao atualizar formação"
              : "Erro ao adicionar formação");
          toast.error(errorMessage);
        }
      });
    },
    [educationId, router, onSuccess]
  );

  return {
    form,
    submitEducation,
    isPending,
  };
};
