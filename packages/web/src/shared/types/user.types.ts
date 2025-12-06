import type { PersonalityProfile } from "./resume.types";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  plan_type: "free" | "pro" | "enterprise";
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
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
  personality_profile?: PersonalityProfile | null;
  personality_generated_at?: string | null;
  default_template_id?: string | null;
  settings?: Record<string, unknown> | null;
}
