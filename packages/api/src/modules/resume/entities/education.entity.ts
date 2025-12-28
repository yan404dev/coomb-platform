import { Education as PrismaEducation } from "@prisma/client";

export interface Education extends PrismaEducation { }

export class EducationEntity implements Education {
  id!: string;
  resume_id!: string;
  institution!: string;
  degree!: string;
  field!: string | null;
  start_date!: string;
  end_date!: string | null;
  current!: boolean;
  country!: string | null;
  created_at!: Date;
  updated_at!: Date;
}
