import { z } from "zod";

export const registerSchema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
