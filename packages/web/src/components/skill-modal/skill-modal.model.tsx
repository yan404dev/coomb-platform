import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useResume } from "@/hooks/use-resume";
import { type SkillRequest, skillSchema } from "./skill-modal.schema";
import { resumeService } from "@/services";

interface UseSkillModalModelOptions {
  defaultValues?: Partial<SkillRequest> | null;
  skillId?: string;
  onSuccess?: () => void;
}

const EMPTY_SKILL: SkillRequest = {
  id: undefined,
  name: "",
  level: "nenhum",
};

export function useSkillModalModel(options: UseSkillModalModelOptions = {}) {
  const { defaultValues, skillId, onSuccess } = options;
  const { mutate } = useResume();

  const form = useForm<SkillRequest>({
    resolver: zodResolver(skillSchema) as any,
    defaultValues: EMPTY_SKILL,
  });

  useEffect(() => {
    form.reset({
      ...EMPTY_SKILL,
      ...defaultValues,
      level: defaultValues?.level ?? "nenhum",
    });
  }, [defaultValues, form]);

  async function submitSkill(data: SkillRequest) {
    const isEditing = !!skillId;

    try {
      if (isEditing && skillId) {
        await resumeService.updateSkill(skillId, {
          name: data.name,
          level: data.level ?? undefined,
        });
        toast.success("Habilidade atualizada com sucesso");
      } else {
        await resumeService.addSkill({
          name: data.name,
          level: data.level ?? undefined,
        });
        toast.success("Habilidade adicionada com sucesso");
      }

      await mutate();
      form.reset(EMPTY_SKILL);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Erro ao salvar habilidade";
      toast.error(errorMessage);
    }
  }

  return {
    form,
    submitSkill,
  };
}
