import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Resume, Skill } from "@/shared/types";
import { skillService } from "../../_services/skill.service";

export function useSkillsListViewModel(resume: Resume | null) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const skills = useMemo(() => resume?.skills ?? [], [resume?.skills]);
  const isEmpty = useMemo(() => skills.length === 0, [skills]);

  const openCreateModal = useCallback(() => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  }, []);

  const handleModalChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeModal();
      } else {
        setIsModalOpen(true);
      }
    },
    [closeModal]
  );

  const removeSkill = useCallback(
    (skillId: string) => {
      startTransition(async () => {
        try {
          await skillService.delete(skillId);
          toast.success("Habilidade removida com sucesso");
          router.refresh();
        } catch (error: any) {
          const errorMessage = error?.message || "Erro ao remover habilidade";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  const updateSkillLevel = useCallback(
    (skillId: string, level: Skill["level"]) => {
      startTransition(async () => {
        try {
          await skillService.updateLevel(skillId, level);
          router.refresh();
        } catch (error: any) {
          const errorMessage =
            error?.message || "Erro ao atualizar nível da habilidade";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  return {
    skills,
    isEmpty,
    isPending,
    isModalOpen,
    selectedSkill,
    openCreateModal,
    openEditModal,
    handleModalChange,
    removeSkill,
    updateSkillLevel,
  };
}
