import { z } from "zod";

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome da habilidade é obrigatório"),
  level: z
    .enum(["nenhum", "basico", "intermediario", "avançado"])
    .optional()
    .nullable(),
});

export type SkillRequest = z.infer<typeof skillSchema>;
