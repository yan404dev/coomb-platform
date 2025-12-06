import { z } from "zod";

export const experiencesFormSchema = z.object({
  professional_summary: z.string().optional(),
  career_goals: z.string().optional(),
});

export type ExperiencesFormRequest = z.infer<typeof experiencesFormSchema>;
