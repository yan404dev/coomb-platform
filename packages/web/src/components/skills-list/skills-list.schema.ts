import { z } from "zod";

export const skillsListSchema = z.object({});

export type SkillsListRequest = z.infer<typeof skillsListSchema>;
