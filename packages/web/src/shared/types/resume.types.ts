export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  completionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

import type { SkillLevelType, LanguageLevelType } from "@/shared/enums";

export interface Skill {
  id: string;
  name: string;
  level?: SkillLevelType | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Language {
  id: string;
  name: string;
  level?: LanguageLevelType | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalityProfile {
  executor: number;
  comunicador: number;
  planejador: number;
  analista: number;
  description?: string;
  interview_tip?: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  full_name: string;
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
  personality_profile?: PersonalityProfile | null;
  personality_generated_at?: Date | null;
}

export interface Resume {
  id: string;
  user_id: string;
  user?: UserWithProfile | null;
  experiences: Experience[];
  skills: Skill[];
  languages: Language[];
  educations: Education[];
  certifications: Certification[];
  completion_score: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface ImportedResumeData {
  full_name: string;
  email: string;
  phone: string;
  cpf?: string | null;
  city?: string | null;
  state?: string | null;
  linkedin?: string | null;
  professional_summary?: string | null;
  experiences: Omit<Experience, "id">[];
  skills: Omit<Skill, "id">[];
  languages: Omit<Language, "id">[];
  educations: Omit<Education, "id">[];
  certifications?: Omit<Certification, "id">[];
}

export type ResumeEntity = Resume;
