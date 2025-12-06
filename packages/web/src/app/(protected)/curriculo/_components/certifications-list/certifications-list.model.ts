import { useState } from "react";

export function useCertificationsListModel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificationId, setEditingCertificationId] = useState<string | undefined>(
    undefined
  );

  const handleEdit = (certificationId: string) => {
    setEditingCertificationId(certificationId);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCertificationId(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCertificationId(undefined);
  };

  return {
    isModalOpen,
    editingCertificationId,
    handleEdit,
    handleAdd,
    handleCloseModal,
  };
}

