import { z } from "zod";

export const languagesListSchema = z.object({});

export type LanguagesListRequest = z.infer<typeof languagesListSchema>;
