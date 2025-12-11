import type { SkillLevelType, LanguageLevelType } from "@/shared/enums";
import type { User } from "./user.entity";

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string | null;
  current: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  completionDate: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevelType | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Language {
  id: string;
  name: string;
  level: LanguageLevelType | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Resume {
  id: string;
  userId: string;
  user: User | null;
  experiences: Experience[];
  skills: Skill[];
  languages: Language[];
  educations: Education[];
  certifications: Certification[];
  completionScore: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
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
  experiences: Omit<Experience, "id" | "createdAt" | "updatedAt">[];
  skills: Omit<Skill, "id" | "createdAt" | "updatedAt">[];
  languages: Omit<Language, "id" | "createdAt" | "updatedAt">[];
  educations: Omit<Education, "id" | "createdAt" | "updatedAt">[];
  certifications?: Omit<Certification, "id" | "createdAt" | "updatedAt">[];
}
