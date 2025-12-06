"use client";

import { AddItemButton } from "@/components/add-item-button";
import { EducationCard } from "../education-card";
import { EducationModal } from "../education-modal";
import { FormSection } from "@/components/form";
import { useResume } from "../../_hooks/use-resume";
import { useEducationsListModel } from "./educations-list.model";

export function EducationsList() {
  const {
    isModalOpen,
    editingEducationId,
    handleEdit,
    handleAdd,
    handleCloseModal,
  } = useEducationsListModel();
  const { data: resume } = useResume();

  return (
    <>
      <FormSection id="formacoes" title="Suas formações">
        <div className="space-y-6">
          <EducationCard onEdit={handleEdit} />
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
