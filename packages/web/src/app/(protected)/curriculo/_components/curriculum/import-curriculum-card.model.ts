"use client";

import type { ChangeEvent } from "react";
import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userService } from "@/shared/services/user.service";
import { aiService } from "@/app/dashboard/_services/ai.service";
import { updateResumeAction } from "../../_actions/resume.actions";
import { useUser } from "@/shared/hooks/use-user";
import type {
  Experience,
  Skill,
  Language,
  Education,
  Certification,
} from "@/shared/types";

const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

const ACCEPTED_EXTENSIONS = new Set(["pdf", "docx", "doc"]);

const sanitizeString = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const ensureArray = <T>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const normalizeExperiences = (
  experiences: (Experience | Omit<Experience, "id">)[] | null | undefined
): Omit<Experience, "id">[] =>
  ensureArray(experiences).map((experience) => ({
    company: experience.company ?? "",
    position: experience.position ?? "",
    startDate: experience.startDate || "2020-01",
    endDate: experience.endDate ?? null,
    current: experience.current ?? false,
    description: experience.description ?? "",
  }));

const normalizeSkills = (
  skills: (Skill | Omit<Skill, "id">)[] | null | undefined
): Omit<Skill, "id">[] =>
  ensureArray(skills).map((skill) => ({
    name: skill.name ?? "",
    level: skill.level || null,
  }));

const normalizeLanguages = (
  languages: (Language | Omit<Language, "id">)[] | null | undefined
): Omit<Language, "id">[] =>
  ensureArray(languages).map((language) => ({
    name:
      (language as Language & { language?: string }).name ??
      (language as any)?.language ??
      "",
    level:
      (
        language as Language & {
          level?: Language["level"];
          proficiency?: Language["level"];
        }
      ).level ??
      (language as any)?.proficiency ??
      null,
  }));

const normalizeEducations = (
  educations: (Education | Omit<Education, "id">)[] | null | undefined
): Omit<Education, "id">[] =>
  ensureArray(educations).map((education) => ({
    degree: education.degree ?? "",
    institution: education.institution ?? "",
    startDate: education.startDate || "2020-01",
    endDate: education.endDate ?? null,
    current: education.current ?? false,
  }));

const normalizeCertifications = (
  certifications:
    | (Certification | Omit<Certification, "id">)[]
    | null
    | undefined
): Omit<Certification, "id">[] =>
  ensureArray(certifications).map((certification) => ({
    name: certification.name ?? "",
    institution: certification.institution ?? "",
    completionDate: certification.completionDate || "2020-01",
  }));

const validateFile = (file: File) => {
  if (ACCEPTED_MIME_TYPES.has(file.type)) {
    return true;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension && ACCEPTED_EXTENSIONS.has(extension)) {
    return true;
  }

  return false;
};

export function useImportCurriculumCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user, mutate: mutateUser } = useUser();

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!validateFile(file)) {
        toast.error("Formato inválido. Use PDF ou DOCX.");
        resetInput();
        return;
      }

      if (!user) {
        toast.error(
          "Você precisa estar autenticado para importar o currículo."
        );
        resetInput();
        return;
      }

      try {
        setIsImporting(true);
        toast.info("Importando currículo com IA...");

        const data = await aiService.importResume(file);

        await userService.update(user.id, {
          full_name: data.full_name,
          phone: sanitizeString(data.phone),
          cpf: sanitizeString(data.cpf),
          city: sanitizeString(data.city),
          state: sanitizeString(data.state),
          linkedin: sanitizeString(data.linkedin),
          professional_summary: sanitizeString(data.professional_summary),
        });

        startTransition(async () => {
          await updateResumeAction({
            experiences: normalizeExperiences(data.experiences),
            skills: normalizeSkills(data.skills),
            languages: normalizeLanguages(data.languages),
            educations: normalizeEducations(data.educations),
            certifications: normalizeCertifications(data.certifications),
          });

          await mutateUser();
          router.refresh();

          toast.success("Currículo importado com sucesso!");
          setIsImporting(false);
          resetInput();
        });
      } catch (error) {
        toast.error("Erro ao importar currículo. Tente novamente.");
        setIsImporting(false);
        resetInput();
      }
    },
    [user, mutateUser, router]
  );

  return {
    fileInputRef,
    isImporting: isImporting || isPending,
    onFileChange,
  };
}
