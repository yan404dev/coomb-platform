import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userService } from "@/services";
import { useResume } from "@/hooks/use-resume";
import { useUser } from "@/hooks/use-user";
import { ExperiencesFormRequest, experiencesFormSchema } from "./experiences.schema";

export function useExperiencesModel(onContinue?: () => void) {
  const { data, isLoading, error, mutate } = useResume();
  const { mutate: mutateUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | undefined>(undefined);

  const form = useForm<ExperiencesFormRequest>({
    resolver: zodResolver(experiencesFormSchema),
    defaultValues: {
      professional_summary: "",
      career_goals: "",
    },
  });

  useEffect(() => {
    const aboutData = data?.user;
    if (aboutData) {
      form.reset({
        professional_summary: aboutData.professional_summary ?? "",
        career_goals: aboutData.career_goals ?? "",
      });
    }
  }, [data, form]);

  async function onSubmit(formData: ExperiencesFormRequest) {
    if (!data) return;

    await userService.update(data.user_id, formData);
    await Promise.all([mutate(), mutateUser()]);
    toast.success("Resumo profissional atualizado com sucesso");

    if (onContinue) {
      onContinue();
    }
  }

  const handleEdit = (experienceId: string) => {
    setEditingExperienceId(experienceId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperienceId(undefined);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return {
    form,
    loading: isLoading && !data,
    error,
    onSubmit,
    data,
    isModalOpen,
    editingExperienceId,
    handleEdit,
    handleCloseModal,
    handleOpenModal,
  };
}
