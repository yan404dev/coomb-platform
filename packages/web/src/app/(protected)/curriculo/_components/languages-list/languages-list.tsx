"use client";

import { AddItemButton } from "@/shared/components/add-item-button";
import { LanguageCard } from "../language-card";
import { LanguageModal } from "../language-modal";
import { FormSection } from "@/shared/components/form";
import type { Resume, Language } from "@/shared/entities";
import { useLanguagesListViewModel } from "./languages-list.view-model";

interface LanguagesListProps {
  resume: Resume | null;
}

export function LanguagesList({ resume }: LanguagesListProps) {
  const viewModel = useLanguagesListViewModel(resume);

  return (
    <>
      <FormSection id="idiomas" title="Seus idiomas" defaultOpen>
        <div className="space-y-6">
          <div className="space-y-8">
            {viewModel.languages.map((language) => (
              <LanguageCard
                key={language.id}
                name={language.name}
                level={(language.level as Language["level"]) ?? "nenhum"}
                onLevelChange={(level) =>
                  viewModel.updateLanguageLevel(language.id, level as Language["level"])
                }
                onRemove={() => viewModel.removeLanguage(language.id)}
                onEdit={() => viewModel.openEditModal(language)}
              />
            ))}
          </div>

          <AddItemButton
            label="Adicionar idioma"
            onClick={viewModel.openCreateModal}
          />
        </div>
      </FormSection>

      <LanguageModal
        open={viewModel.isModalOpen}
        onOpenChange={viewModel.handleModalChange}
        defaultValues={viewModel.selectedLanguage as any}
        languageId={viewModel.selectedLanguage?.id}
      />
    </>
  );
}
