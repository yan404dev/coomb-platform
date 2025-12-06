"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Skill } from "@/shared/types";
import { useResume } from "../../_hooks/use-resume";
import { resumeService } from "../../_services/resume.service";

export function useSkillsListModel() {
  const { data: resume, mutate, isLoading, error } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const skills = useMemo(() => resume?.skills ?? [], [resume?.skills]);

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
      if (!resume) {
        toast.error("Currículo não encontrado");
        return;
      }

      try {
        await resumeService.deleteSkill(skillId);
        await mutate();
        toast.success("Habilidade removida com sucesso");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Erro ao remover habilidade";
        toast.error(errorMessage);
      }
    },
    [resume, mutate]
  );

  const updateSkillLevel = useCallback(
    async (skillId: string, level: Skill["level"]) => {
      if (!resume) {
        toast.error("Currículo não encontrado");
        return;
      }

      try {
        await resumeService.updateSkill(skillId, { level: level ?? undefined });
        await mutate();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          "Erro ao atualizar nível da habilidade";
        toast.error(errorMessage);
      }
    },
    [resume, mutate]
  );

  return {
    skills,
    loading: isLoading,
    error,
    isModalOpen,
    selectedSkill,
    openCreateModal,
    openEditModal,
    handleModalChange,
    removeSkill,
    updateSkillLevel,
  };
}
