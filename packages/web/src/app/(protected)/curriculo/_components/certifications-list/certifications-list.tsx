"use client";

import type { Resume } from "@/shared/entities";
import { AddItemButton } from "@/shared/components/add-item-button";
import { CertificationCard } from "../certification-card";
import { CertificationModal } from "../certification-modal";
import { FormSection } from "@/shared/components/form";
import { useCertificationsListModel } from "./certifications-list.model";

interface CertificationsListProps {
  resume: Resume | null;
}

export function CertificationsList({ resume }: CertificationsListProps) {
  const {
    isModalOpen,
    editingCertificationId,
    handleEdit,
    handleAdd,
    handleCloseModal,
  } = useCertificationsListModel();

  return (
    <>
      <FormSection
        id="certificacoes"
        title="Seus cursos profissionalizantes e certificações"
      >
        <div className="space-y-6">
          <CertificationCard certifications={resume?.certifications ?? []} onEdit={handleEdit} />
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
