import { Language as PrismaLanguage } from "@prisma/client";

export interface Language extends PrismaLanguage { }

export class LanguageEntity implements Language {
  id!: string;
  resume_id!: string;
  name!: string;
  proficiency!: string;
  created_at!: Date;
  updated_at!: Date;
}
