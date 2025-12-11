export interface PersonalityProfile {
  executor: number;
  comunicador: number;
  planejador: number;
  analista: number;
  description?: string;
  interview_tip?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  planType: "free" | "pro" | "enterprise";
  isAdmin: boolean;
  cpf: string | null;
  birthDate: string | null;
  hasDisability: boolean | null;
  race: string | null;
  sexualOrientation: string | null;
  gender: string | null;
  state: string | null;
  city: string | null;
  salaryExpectation: string | null;
  hasCnh: boolean | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  portfolio: string | null;
  professionalSummary: string | null;
  careerGoals: string | null;
  personalityProfile: PersonalityProfile | null;
  personalityGeneratedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
