import { z } from "zod";

export const languageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome do idioma é obrigatório"),
  level: z.string().min(1, "Nível de proficiência é obrigatório"),
});

export type LanguageRequest = z.infer<typeof languageSchema>;
