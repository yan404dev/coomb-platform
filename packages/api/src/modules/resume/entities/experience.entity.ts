import { Experience as PrismaExperience } from "@prisma/client";

export interface Experience extends PrismaExperience { }

export class ExperienceEntity implements Experience {
  id!: string;
  resume_id!: string;
  company!: string;
  position!: string;
  description!: string | null;
  start_date!: string;
  end_date!: string | null;
  current!: boolean;
  work_mode!: string | null;
  country!: string | null;
  created_at!: Date;
  updated_at!: Date;
}
