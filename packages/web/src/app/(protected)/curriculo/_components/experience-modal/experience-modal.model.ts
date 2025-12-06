import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "../../_hooks/use-resume";
import { resumeService } from "../../_services/resume.service";
import { toast } from "sonner";
import {
  experienceSchema,
  type ExperienceRequest,
} from "./experience-modal.schema";

interface UseExperienceModalModelProps {
  defaultValues?: ExperienceRequest | null;
  experienceId?: string;
  onSuccess?: () => void;
  open: boolean;
}

export const useExperienceModalModel = ({
  defaultValues,
  experienceId,
  onSuccess,
  open,
}: UseExperienceModalModelProps) => {
  const { mutate } = useResume();

  const form = useForm<ExperienceRequest>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues ?? {
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
    } else if (!open) {
      form.reset({
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    }
  }, [open, defaultValues, form]);

  const submitExperience = useCallback(
    async (data: ExperienceRequest) => {
      const isEditing = !!experienceId;

      try {
        if (isEditing && experienceId) {
          await resumeService.updateExperience(experienceId, {
            position: data.position,
            company: data.company,
            startDate: data.startDate,
            endDate: data.endDate,
            current: data.current,
            description: data.description ?? undefined,
          });
        } else {
          await resumeService.addExperience({
            position: data.position,
            company: data.company,
            startDate: data.startDate,
            endDate: data.endDate,
            current: data.current,
            description: data.description ?? undefined,
          });
        }

        await mutate();

        toast.success(
          isEditing
            ? "Experiência atualizada com sucesso"
            : "Experiência adicionada com sucesso"
        );

        onSuccess?.();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          (isEditing
            ? "Erro ao atualizar experiência"
            : "Erro ao adicionar experiência");
        toast.error(errorMessage);
      }
    },
    [experienceId, mutate, onSuccess]
  );

  return {
    form,
    submitExperience,
  };
};
