import { z } from "zod";

export const certificationSchema = z
  .object({
    name: z.string().min(1, "Nome do curso/certificação é obrigatório"),
    institution: z.string().min(1, "Nome da instituição é obrigatório"),
    completionDate: z.string().min(1, "Data de conclusão é obrigatória"),
  })
  .strict();

export type CertificationRequest = z.infer<typeof certificationSchema>;
