import { z } from "zod";

export const educationSchema = z
  .object({
    degree: z.string().min(1, "Nome do curso/formação é obrigatório"),
    institution: z.string().min(1, "Nome da instituição é obrigatório"),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().nullable().optional(),
    current: z.boolean(),
  })
  .strict();

export type EducationRequest = z.infer<typeof educationSchema>;
