"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Language } from "@/shared/types";
import { useResume } from "../../_hooks/use-resume";
import { resumeService } from "../../_services/resume.service";

export function useLanguagesListModel() {
  const { data: resume, mutate, isLoading, error } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

  const languages = useMemo(() => resume?.languages ?? [], [resume?.languages]);

  const openCreateModal = useCallback(() => {
    setSelectedLanguage(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLanguage(null);
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

  const removeLanguage = useCallback(
    async (languageId: string) => {
      if (!resume) {
        toast.error("Currículo não encontrado");
        return;
      }

      try {
        await resumeService.deleteLanguage(languageId);
        await mutate();
        toast.success("Idioma removido com sucesso");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Erro ao remover idioma";
        toast.error(errorMessage);
      }
    },
    [resume, mutate]
  );

  const updateLanguageLevel = useCallback(
    async (languageId: string, level: Language["level"]) => {
      if (!resume) {
        toast.error("Currículo não encontrado");
        return;
      }

      try {
        await resumeService.updateLanguage(languageId, {
          level: level ?? undefined,
        });
        await mutate();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Erro ao atualizar nível do idioma";
        toast.error(errorMessage);
      }
    },
    [resume, mutate]
  );

  return {
    languages,
    loading: isLoading,
    error,
    isModalOpen,
    selectedLanguage,
    openCreateModal,
    openEditModal,
    handleModalChange,
    removeLanguage,
    updateLanguageLevel,
  };
}
