"use client";

import { AddItemButton } from "@/components/add-item-button";
import { LanguageCard } from "../language-card";
import { LanguageModal } from "../language-modal";
import { FormSection } from "@/components/form";
import type { Language } from "@/entities";
import { useLanguagesListModel } from "./languages-list.model";

export function LanguagesList() {
  const {
    languages,
    loading,
    error,
    isModalOpen,
    selectedLanguage,
    openCreateModal,
    openEditModal,
    handleModalChange,
    removeLanguage,
    updateLanguageLevel,
  } = useLanguagesListModel();

  return (
    <>
      <FormSection id="idiomas" title="Seus idiomas" defaultOpen>
        {error ? (
          <p className="text-sm text-destructive">
            Não foi possível carregar os idiomas no momento.
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando idiomas...</p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-8">
              {languages.map((language) => (
                <LanguageCard
                  key={language.id}
                  name={language.name}
                  level={(language.level as Language["level"]) ?? "nenhum"}
                  onLevelChange={(level) =>
                    updateLanguageLevel(language.id, level as Language["level"])
                  }
                  onRemove={() => removeLanguage(language.id)}
                  onEdit={() => openEditModal(language)}
                />
              ))}
            </div>

            <AddItemButton label="Adicionar idioma" onClick={openCreateModal} />
          </div>
        )}
      </FormSection>

      <LanguageModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        defaultValues={selectedLanguage as any}
        languageId={selectedLanguage?.id}
      />
    </>
  );
}
