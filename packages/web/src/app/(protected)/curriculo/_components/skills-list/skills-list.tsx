"use client";

import { AddItemButton } from "@/components/add-item-button";
import { SkillCard } from "../skill-card";
import { SkillModal } from "../skill-modal";
import { FormSection } from "@/components/form";
import type { Resume, Skill } from "@/shared/types";
import { useSkillsListViewModel } from "./skills-list.view-model";

interface SkillsListProps {
  resume: Resume | null;
}

export function SkillsList({ resume }: SkillsListProps) {
  const viewModel = useSkillsListViewModel(resume);

  return (
    <>
      <FormSection id="habilidades" title="Suas habilidades" defaultOpen>
        <div className="space-y-6">
          <div className="space-y-8">
            {viewModel.skills.map((skill) => (
              <SkillCard
                key={skill.id}
                name={skill.name}
                level={(skill.level as Skill["level"]) ?? "nenhum"}
                onLevelChange={(level) =>
                  viewModel.updateSkillLevel(skill.id, level as Skill["level"])
                }
                onRemove={() => viewModel.removeSkill(skill.id)}
                onEdit={() => viewModel.openEditModal(skill)}
              />
            ))}
          </div>

          <AddItemButton
            label="Adicionar habilidade"
            onClick={viewModel.openCreateModal}
          />
        </div>
      </FormSection>

      <SkillModal
        open={viewModel.isModalOpen}
        onOpenChange={viewModel.handleModalChange}
        defaultValues={viewModel.selectedSkill ?? undefined}
        skillId={viewModel.selectedSkill?.id}
      />
    </>
  );
}
