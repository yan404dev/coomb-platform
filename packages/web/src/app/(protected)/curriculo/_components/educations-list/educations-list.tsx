"use client";

import type { Resume } from "@/shared/entities";
import { AddItemButton } from "@/shared/components/add-item-button";
import { EducationCard } from "../education-card";
import { EducationModal } from "../education-modal";
import { FormSection } from "@/shared/components/form";
import { useEducationsListModel } from "./educations-list.model";

interface EducationsListProps {
  resume: Resume | null;
}

export function EducationsList({ resume }: EducationsListProps) {
  const {
    isModalOpen,
    editingEducationId,
    handleEdit,
    handleAdd,
    handleCloseModal,
  } = useEducationsListModel();

  return (
    <>
      <FormSection id="formacoes" title="Suas formações">
        <div className="space-y-6">
          <EducationCard educations={resume?.educations ?? []} onEdit={handleEdit} />
          <AddItemButton label="Adicionar formação" onClick={handleAdd} />
        </div>
      </FormSection>

      <EducationModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        educationId={editingEducationId}
        defaultValues={
          editingEducationId && resume?.educations
            ? resume.educations.find((edu) => edu.id === editingEducationId)
            : undefined
        }
      />
    </>
  );
}
