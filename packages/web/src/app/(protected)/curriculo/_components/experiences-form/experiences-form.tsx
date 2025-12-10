"use client";
import type { Resume } from "@/shared/types";
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
import { useExperiencesModel } from "./experiences.model";

interface ExperiencesFormProps {
  resume: Resume | null;
  onContinue?: () => void;
}

export function ExperiencesForm({ resume, onContinue }: ExperiencesFormProps) {
  const {
    form,
    onSubmit,
    isModalOpen,
    editingExperienceId,
    handleEdit,
    handleCloseModal,
    handleOpenModal,
  } = useExperiencesModel(resume, onContinue);

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
            <ExperienceCard experiences={resume?.experiences ?? []} onEdit={handleEdit} />

            <AddItemButton
              label="Adicionar experiência"
              onClick={handleOpenModal}
            />
          </FormSection>

          <EducationsList resume={resume} />

          <CertificationsList resume={resume} />
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
            editingExperienceId && resume?.experiences
              ? resume.experiences.find((exp) => exp.id === editingExperienceId)
              : undefined
          }
        />
      </form>
    </Form>
  );
}
