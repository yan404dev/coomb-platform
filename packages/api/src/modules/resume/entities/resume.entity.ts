import { Resume, Prisma, User } from "@prisma/client";

export type ResumeWithRelations = Resume & {
  user?: Pick<
    User,
    | "id"
    | "email"
    | "full_name"
    | "phone"
    | "cpf"
    | "birth_date"
    | "state"
    | "city"
    | "linkedin"
    | "instagram"
    | "facebook"
    | "portfolio"
    | "professional_summary"
    | "career_goals"
    | "personality_profile"
    | "has_disability"
    | "race"
    | "sexual_orientation"
    | "gender"
    | "salary_expectation"
    | "has_cnh"
    | "personality_generated_at"
  > | null;
};

export class ResumeEntity implements Resume {
  id!: string;
  user_id!: string;
  experiences!: Prisma.JsonValue;
  skills!: Prisma.JsonValue;
  languages!: Prisma.JsonValue;
  educations!: Prisma.JsonValue;
  certifications!: Prisma.JsonValue;
  completion_score!: number;
  created_at!: Date;
  updated_at!: Date;
  deleted_at!: Date | null;

  user?: Partial<User> | null;

  constructor(partial?: Partial<ResumeEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
