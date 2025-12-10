import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type SkillRequest, skillSchema } from "./skill-modal.schema";
import { skillService } from "../../_services/skill.service";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

    startTransition(async () => {
      try {
        if (isEditing && skillId) {
          await skillService.update(skillId, {
            name: data.name,
            level: data.level ?? undefined,
          });
          toast.success("Habilidade atualizada com sucesso");
        } else {
          await skillService.add({
            name: data.name,
            level: data.level ?? undefined,
          });
          toast.success("Habilidade adicionada com sucesso");
        }

        form.reset(EMPTY_SKILL);
        router.refresh();
        onSuccess?.();
      } catch (error: any) {
        const errorMessage = error?.message || "Erro ao salvar habilidade";
        toast.error(errorMessage);
      }
    });
  }

  return {
    form,
    submitSkill,
    isPending,
  };
}
