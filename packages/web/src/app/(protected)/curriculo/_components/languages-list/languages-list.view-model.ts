import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Resume, Language } from "@/shared/entities";
import { languageService } from "../../_services/language.service";

export function useLanguagesListViewModel(resume: Resume | null) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const languages = useMemo(() => resume?.languages ?? [], [resume?.languages]);
  const isEmpty = useMemo(() => languages.length === 0, [languages]);

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
    (languageId: string) => {
      startTransition(async () => {
        try {
          await languageService.delete(languageId);
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
    (languageId: string, level: Language["level"]) => {
      startTransition(async () => {
        try {
          await languageService.updateLevel(languageId, level);
          router.refresh();
        } catch (error: any) {
          const errorMessage =
            error?.message || "Erro ao atualizar nível do idioma";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  return {
    languages,
    isEmpty,
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
