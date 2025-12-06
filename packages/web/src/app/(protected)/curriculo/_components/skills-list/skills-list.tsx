"use client";

import { AddItemButton } from "@/components/add-item-button";
import { SkillCard } from "../skill-card";
import { SkillModal } from "../skill-modal";
import { FormSection } from "@/components/form";
import type { Skill } from "@/entities";
import { useSkillsListModel } from "./skills-list.model";

export function SkillsList() {
  const {
    skills,
    loading,
    error,
    isModalOpen,
    selectedSkill,
    openCreateModal,
    openEditModal,
    handleModalChange,
    removeSkill,
    updateSkillLevel,
  } = useSkillsListModel();

  return (
    <>
      <FormSection id="habilidades" title="Suas habilidades" defaultOpen>
        {error ? (
          <p className="text-sm text-destructive">
            Não foi possível carregar as habilidades no momento.
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Carregando habilidades...
          </p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-8">
              {skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  name={skill.name}
                  level={(skill.level as Skill["level"]) ?? "nenhum"}
                  onLevelChange={(level) =>
                    updateSkillLevel(skill.id, level as Skill["level"])
                  }
                  onRemove={() => removeSkill(skill.id)}
                  onEdit={() => openEditModal(skill)}
                />
              ))}
            </div>

            <AddItemButton
              label="Adicionar habilidade"
              onClick={openCreateModal}
            />
          </div>
        )}
      </FormSection>

      <SkillModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        defaultValues={selectedSkill ?? undefined}
        skillId={selectedSkill?.id}
      />
    </>
  );
}
