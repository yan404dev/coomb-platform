"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Skill } from "@/shared/entities";
import { deleteSkillAction, updateSkillAction } from "../../_actions/resume.actions";

export function useSkillsListModel() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

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
    async (skillId: string) => {
      startTransition(async () => {
        try {
          await deleteSkillAction(skillId);
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
    async (skillId: string, level: Skill["level"]) => {
      startTransition(async () => {
        try {
          await updateSkillAction(skillId, { level: level ?? undefined });
          router.refresh();
        } catch (error: any) {
          const errorMessage = error?.message || "Erro ao atualizar nível da habilidade";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  return {
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
