"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Language } from "@/shared/entities";
import { deleteLanguageAction, updateLanguageAction } from "../../_actions/resume.actions";

export function useLanguagesListModel() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

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
      startTransition(async () => {
        try {
          await deleteLanguageAction(languageId);
          toast.success("Idioma removido com sucesso");
          router.refresh();
        } catch (error: any) {
          const errorMessage = error?.message || "Erro ao remover idioma";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  const updateLanguageLevel = useCallback(
    async (languageId: string, level: Language["level"]) => {
      startTransition(async () => {
        try {
          await updateLanguageAction(languageId, {
            level: level ?? undefined,
          });
          router.refresh();
        } catch (error: any) {
          const errorMessage = error?.message || "Erro ao atualizar nível do idioma";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  return {
    isPending,
    isModalOpen,
    selectedLanguage,
    openCreateModal,
    openEditModal,
    handleModalChange,
    removeLanguage,
    updateLanguageLevel,
  };
}
