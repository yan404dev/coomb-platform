import { z } from "zod";

export const aboutFormSchema = z.object({
  full_name: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .optional()
    .or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 caracteres")
    .optional()
    .or(z.literal("")),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido")
    .optional()
    .or(z.literal("")),
  birth_date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato dd/mm/aaaa")
    .optional()
    .or(z.literal("")),
  has_disability: z.boolean().optional(),
  race: z.string().optional(),
  sexual_orientation: z.string().optional(),
  gender: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  salary_expectation: z.string().optional(),
  has_cnh: z.boolean().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z
    .string()
    .url("URL do LinkedIn inválida")
    .optional()
    .or(z.literal("")),
  portfolio: z.string().optional(),
  professional_summary: z.string().optional(),
  career_goals: z.string().optional(),
});

export type AboutFormRequest = z.infer<typeof aboutFormSchema>;
