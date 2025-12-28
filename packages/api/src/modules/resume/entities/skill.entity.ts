import { Skill as PrismaSkill } from "@prisma/client";

export interface Skill extends PrismaSkill { }

export class SkillEntity implements Skill {
  id!: string;
  resume_id!: string;
  name!: string;
  level!: string | null;
  created_at!: Date;
  updated_at!: Date;
}
