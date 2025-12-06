import { User } from "@prisma/client";

export class UserEntity {
  id!: string;
  email!: string;
  full_name!: string;
  avatar_url?: string;
  plan_type!: string;
  is_admin!: boolean;
  phone?: string | null;
  cpf?: string | null;
  birth_date?: string | null;
  has_disability?: boolean | null;
  race?: string | null;
  sexual_orientation?: string | null;
  gender?: string | null;
  state?: string | null;
  city?: string | null;
  salary_expectation?: string | null;
  has_cnh?: boolean | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  professional_summary?: string | null;
  career_goals?: string | null;
  personality_profile?: any;
  personality_generated_at?: Date | null;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    delete (this as any).password;
  }
}
