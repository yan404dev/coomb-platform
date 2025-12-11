import { z } from "zod";

const skillLevelSchema = z
  .enum(["nenhum", "basico", "intermediario", "avançado"])
  .nullable();
const languageLevelSchema = z
  .enum(["basico", "intermediario", "avançado", "fluente", "nativo"])
  .nullable();

export const experienceSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean().nullable(),
  description: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const educationSchema = z.object({
  id: z.string().uuid(),
  degree: z.string().min(1),
  institution: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const certificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  institution: z.string().min(1),
  completionDate: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const skillSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  level: skillLevelSchema.nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const languageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  level: languageLevelSchema.nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const resumeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  experiences: z.array(experienceSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  educations: z.array(educationSchema),
  certifications: z.array(certificationSchema),
  completionScore: z.number().min(0).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const createExperienceSchema = experienceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createEducationSchema = educationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createCertificationSchema = certificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createSkillSchema = skillSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({ level: true });

export const createLanguageSchema = languageSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({ level: true });

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type CreateCertificationInput = z.infer<
  typeof createCertificationSchema
>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type CreateLanguageInput = z.infer<typeof createLanguageSchema>;
