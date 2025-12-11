import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Resume } from "@/shared/entities";
import { userService } from "@/shared/services/user.service";
import { useUser } from "@/shared/hooks/use-user";
import { ExperiencesFormRequest, experiencesFormSchema } from "./experiences.schema";

export function useExperiencesModel(resume: Resume | null, onContinue?: () => void) {
  const router = useRouter();
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
    const aboutData = resume?.user;
    if (aboutData) {
      form.reset({
        professional_summary: aboutData.professionalSummary ?? "",
        career_goals: aboutData.careerGoals ?? "",
      });
    }
  }, [resume, form]);

  async function onSubmit(formData: ExperiencesFormRequest) {
    if (!resume) return;

    await userService.update(resume.userId, formData);
    await mutateUser();
    router.refresh();
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
    onSubmit,
    resume,
    isModalOpen,
    editingExperienceId,
    handleEdit,
    handleCloseModal,
    handleOpenModal,
  };
}
