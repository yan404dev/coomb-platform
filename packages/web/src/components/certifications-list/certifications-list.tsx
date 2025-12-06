"use client";

import { AddItemButton } from "@/components/add-item-button";
import { CertificationCard } from "@/components/certification-card";
import { CertificationModal } from "@/components/certification-modal";
import { FormSection } from "@/components/form";
import { useResume } from "@/hooks/use-resume";
import { useCertificationsListModel } from "./certifications-list.model";

export function CertificationsList() {
  const {
    isModalOpen,
    editingCertificationId,
    handleEdit,
    handleAdd,
    handleCloseModal,
  } = useCertificationsListModel();
  const { data: resume } = useResume();

  return (
    <>
      <FormSection
        id="certificacoes"
        title="Seus cursos profissionalizantes e certificações"
      >
        <div className="space-y-6">
          <CertificationCard onEdit={handleEdit} />
          <AddItemButton label="Adicionar certificação" onClick={handleAdd} />
        </div>
      </FormSection>

      <CertificationModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        certificationId={editingCertificationId}
        defaultValues={
          editingCertificationId && resume?.certifications
            ? resume.certifications.find(
                (cert) => cert.id === editingCertificationId
              )
            : undefined
        }
      />
    </>
  );
}
