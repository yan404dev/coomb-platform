import { z } from "zod";

export const messageRoleSchema = z.enum(["user", "assistant", "system"]);

export const messageContentTypeSchema = z.enum([
  "text",
  "pdf_attachment",
  "job_description",
  "resume_analysis",
  "optimization_result",
]);

export const citationSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  relevance_score: z.number().optional(),
});

export const messageMetadataSchema = z.object({
  attachment_url: z.string().url().optional(),
  file_name: z.string().optional(),
  file_size: z.number().optional(),
  file_type: z.string().optional(),
  processing_time_ms: z.number().optional(),
  error_details: z.string().optional(),
});

export const messageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  role: messageRoleSchema,
  messageType: messageContentTypeSchema,
  content: z.string(),
  pdfUrl: z.string().url().nullable(),
  citations: z.array(citationSchema).nullable(),
  metadata: messageMetadataSchema.nullable(),
  tokensUsed: z.number().nullable(),
  model: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1),
  role: messageRoleSchema.optional(),
  messageType: messageContentTypeSchema.optional(),
  pdf_url: z.string().url().optional(),
  metadata: messageMetadataSchema.optional(),
});

export const searchMessagesSchema = z.object({
  query: z.string().min(1),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type SearchMessagesInput = z.infer<typeof searchMessagesSchema>;
export type MessageApiResponse = z.infer<typeof messageSchema>;
