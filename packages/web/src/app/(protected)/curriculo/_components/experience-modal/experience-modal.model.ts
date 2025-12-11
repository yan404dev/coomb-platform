import { useCallback, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { experienceService } from "../../_services/experience.service";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

      startTransition(async () => {
        try {
          if (isEditing && experienceId) {
            await experienceService.update(experienceId, {
              position: data.position,
              company: data.company,
              startDate: data.startDate,
              endDate: data.endDate ?? null,
              current: data.current,
              description: data.description ?? null,
            });
          } else {
            await experienceService.add({
              position: data.position,
              company: data.company,
              startDate: data.startDate,
              endDate: data.endDate ?? null,
              current: data.current,
              description: data.description ?? null,
            });
          }

          toast.success(
            isEditing
              ? "Experiência atualizada com sucesso"
              : "Experiência adicionada com sucesso"
          );

          router.refresh();
          onSuccess?.();
        } catch (error: any) {
          const errorMessage =
            error?.message ||
            (isEditing
              ? "Erro ao atualizar experiência"
              : "Erro ao adicionar experiência");
          toast.error(errorMessage);
        }
      });
    },
    [experienceId, router, onSuccess]
  );

  return {
    form,
    submitExperience,
    isPending,
  };
};
