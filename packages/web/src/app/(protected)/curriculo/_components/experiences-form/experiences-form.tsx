"use client";
import { AddItemButton } from "@/components/add-item-button";
import { ImportCurriculumCard } from "../curriculum/import-curriculum-card";
import { ExperienceCard } from "../experience-card";
import { ExperienceModal } from "../experience-modal";
import { EducationsList } from "../educations-list";
import { CertificationsList } from "../certifications-list";
import { FormSaveFooter, FormSection } from "@/components/form";
import { InfoBox } from "@/components/info-box";
import { Form } from "@/components/ui/form";
import { TextareaField } from "@/components/ui/textarea-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useExperiencesModel } from "./experiences.model";

interface ExperiencesFormProps {
  onContinue?: () => void;
}

export function ExperiencesForm({ onContinue }: ExperiencesFormProps) {
  const {
    form,
    loading,
    onSubmit,
    data,
    isModalOpen,
    editingExperienceId,
    handleEdit,
    handleCloseModal,
    handleOpenModal,
  } = useExperiencesModel(onContinue);

  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <ImportCurriculumCard />

        <FormSection
          id="resumo-profissional"
          title="Resumo profissional"
          defaultOpen
        >
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-16 w-full" />
        </FormSection>

        <FormSection id="experiencias" title="Quais são suas experiências" defaultOpen>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-40" />
        </FormSection>

        <FormSaveFooter rightContent={<Skeleton className="h-10 w-40" />} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 pb-24">
          <ImportCurriculumCard />

          <FormSection
            id="resumo-profissional"
            title="Resumo profissional"
            defaultOpen
          >
            <TextareaField
              control={form.control}
              registerName="professional_summary"
              placeholder="Descreva sua experiência profissional, habilidades e competências..."
              rows={6}
            />

            <TextareaField
              control={form.control}
              registerName="career_goals"
              label="O que você almeja alcançar"
              placeholder="Ex: Busco uma posição como Desenvolvedor Full Stack onde possa aplicar minhas habilidades..."
              rows={6}
            />

            <InfoBox
              title="Por que este campo é importante?"
              description="Usaremos este campo para dar contexto à nossa inteligência artificial sobre seus objetivos profissionais. Isso permitirá personalizar seu currículo, destacando as experiências e habilidades mais relevantes para as posições que você almeja alcançar."
            />
          </FormSection>

          <FormSection
            id="experiencias"
            title="Quais são suas experiências"
            defaultOpen
          >
            <ExperienceCard onEdit={handleEdit} />

            <AddItemButton
              label="Adicionar experiência"
              onClick={handleOpenModal}
            />
          </FormSection>

          <EducationsList />

          <CertificationsList />
        </div>

        <FormSaveFooter
          buttonLabel={
            form.formState.isSubmitting ? "Salvando..." : "Salvar e continuar"
          }
          buttonProps={{
            type: "submit",
            disabled: form.formState.isSubmitting,
          }}
        />

        <ExperienceModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          experienceId={editingExperienceId}
          defaultValues={
            editingExperienceId && data?.experiences
              ? data.experiences.find((exp) => exp.id === editingExperienceId)
              : undefined
          }
        />
      </form>
    </Form>
  );
}
