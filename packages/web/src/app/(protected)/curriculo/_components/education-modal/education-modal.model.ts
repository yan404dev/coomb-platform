import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "../../_hooks/use-resume";
import { resumeService } from "../../_services/resume.service";
import { toast } from "sonner";
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
  const { mutate } = useResume();

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

      try {
        if (isEditing && educationId) {
          await resumeService.updateEducation(educationId, {
            degree: data.degree,
            institution: data.institution,
            startDate: data.startDate,
            endDate: data.endDate,
            current: data.current,
          });
        } else {
          await resumeService.addEducation({
            degree: data.degree,
            institution: data.institution,
            startDate: data.startDate,
            endDate: data.endDate,
            current: data.current,
          });
        }

        await mutate();

        toast.success(
          isEditing
            ? "Formação atualizada com sucesso"
            : "Formação adicionada com sucesso"
        );

        onSuccess?.();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          (isEditing
            ? "Erro ao atualizar formação"
            : "Erro ao adicionar formação");
        toast.error(errorMessage);
      }
    },
    [educationId, mutate, onSuccess]
  );

  return {
    form,
    submitEducation,
  };
};
