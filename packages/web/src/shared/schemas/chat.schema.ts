import { z } from "zod";

export const createChatSchema = z.object({
  title: z.string().optional(),
  resumeId: z.string().uuid().optional(),
});

export const updateChatTitleSchema = z.object({
  title: z.string().min(1),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type UpdateChatTitleInput = z.infer<typeof updateChatTitleSchema>;
