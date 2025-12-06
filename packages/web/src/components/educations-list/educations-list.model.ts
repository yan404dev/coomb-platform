import { useState } from "react";

export function useEducationsListModel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | undefined>(
    undefined
  );

  const handleEdit = (educationId: string) => {
    setEditingEducationId(educationId);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEducationId(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEducationId(undefined);
  };

  return {
    isModalOpen,
    editingEducationId,
    handleEdit,
    handleAdd,
    handleCloseModal,
  };
}

