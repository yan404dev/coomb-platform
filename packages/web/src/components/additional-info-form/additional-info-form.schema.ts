import { z } from "zod";

export const additionalInfoFormSchema = z.object({
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  salary_expectation: z.string().optional().or(z.literal("")),
  has_cnh: z.boolean().optional(),
  linkedin: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  portfolio: z.string().optional().or(z.literal("")),
});

export type AdditionalInfoFormRequest = z.infer<typeof additionalInfoFormSchema>;
