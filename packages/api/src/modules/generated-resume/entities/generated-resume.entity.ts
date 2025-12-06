import type { GeneratedResume as PrismaGeneratedResume } from "@prisma/client";

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

type GeneratedResumeInput = PrismaGeneratedResume | Record<string, any>;

export class GeneratedResumeEntity {
  id!: string;
  user_id!: string;
  base_resume_id!: string;
  session_id?: string | null;
  title!: string;
  job_description?: string | null;

  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  cpf?: string | null;
  birth_date?: string | null;
  has_disability?: boolean | null;
  sex?: string | null;
  race?: string | null;
  sexual_orientation?: string | null;
  gender?: string | null;
  professional_summary?: string | null;
  career_goals?: string | null;

  experiences!: unknown[];
  skills!: unknown[];
  languages!: unknown[];

  city?: string | null;
  salary_expectation?: string | null;
  has_cnh?: boolean | null;

  instagram?: string | null;
  facebook?: string | null;
  portfolio?: string | null;

  is_published!: boolean;
  created_at!: Date;
  updated_at!: Date;

  toPlainObject(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      base_resume_id: this.base_resume_id,
      full_name: this.full_name,
      email: this.email,
      phone: this.phone,
      linkedin: this.linkedin,
      cpf: this.cpf,
      birth_date: this.birth_date,
      has_disability: this.has_disability,
      sex: this.sex,
      race: this.race,
      sexual_orientation: this.sexual_orientation,
      gender: this.gender,
      professional_summary: this.professional_summary,
      career_goals: this.career_goals,
      city: this.city,
      salary_expectation: this.salary_expectation,
      has_cnh: this.has_cnh,
      instagram: this.instagram,
      facebook: this.facebook,
      portfolio: this.portfolio,
      experiences: this.experiences,
      skills: this.skills,
      languages: this.languages,
      job_description: this.job_description,
    };
  }

  constructor(resume: GeneratedResumeInput) {
    const raw = resume as Record<string, unknown>;
    const content = (raw.content as Record<string, unknown>) ?? {};
    const pick = (key: string) => (raw[key] ?? content[key] ?? null) as any;

    this.id = (raw.id as string) ?? "";
    this.user_id = (raw.user_id as string) ?? (raw.userId as string) ?? "";
    this.base_resume_id =
      (raw.base_resume_id as string) ?? (raw.baseResumeId as string) ?? "";
    this.session_id =
      (raw.session_id as string) ?? (raw.sessionId as string) ?? null;
    this.title = (raw.title as string) ?? "";
    this.job_description = pick("job_description");

    this.full_name = pick("full_name");
    this.email = pick("email");
    this.phone = pick("phone");
    this.linkedin = pick("linkedin");
    this.cpf = pick("cpf");
    this.birth_date = pick("birth_date");
    this.has_disability = pick("has_disability");
    this.sex = pick("sex");
    this.race = pick("race");
    this.sexual_orientation = pick("sexual_orientation");
    this.gender = pick("gender");
    this.professional_summary = pick("professional_summary");
    this.career_goals = pick("career_goals");

    this.experiences = toArray(raw.experiences ?? content.experiences ?? []);
    this.skills = toArray(raw.skills ?? content.skills ?? []);
    this.languages = toArray(raw.languages ?? content.languages ?? []);

    this.city = pick("city");
    this.salary_expectation = pick("salary_expectation");
    this.has_cnh = pick("has_cnh");

    this.instagram = pick("instagram");
    this.facebook = pick("facebook");
    this.portfolio = pick("portfolio");

    this.is_published = Boolean(raw.is_published ?? raw.isPublished ?? false);
    this.created_at =
      (raw.created_at as Date) ?? (raw.createdAt as Date) ?? new Date();
    this.updated_at =
      (raw.updated_at as Date) ?? (raw.updatedAt as Date) ?? new Date();
  }
}
