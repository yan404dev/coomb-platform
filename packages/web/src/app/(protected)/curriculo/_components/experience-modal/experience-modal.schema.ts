import { z } from "zod";

const EXPERIENCE_DESCRIPTION_MAX_LENGTH = 2000;

export const experienceSchema = z
  .object({
    id: z.string().optional(),
    company: z.string().min(1, "Nome da empresa é obrigatório"),
    position: z.string().min(1, "Cargo é obrigatório"),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().nullable().optional(),
    current: z.boolean(),
    description: z
      .string()
      .max(
        EXPERIENCE_DESCRIPTION_MAX_LENGTH,
        `Descrição deve ter no máximo ${EXPERIENCE_DESCRIPTION_MAX_LENGTH} caracteres`
      )
      .nullable()
      .optional(),
  })
  .strict();

export type ExperienceRequest = z.infer<typeof experienceSchema>;
