import type { GeneratedResume as PrismaGeneratedResume } from "@prisma/client";

type GeneratedResumeContent = {
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
  city?: string | null;
  salary_expectation?: string | null;
  has_cnh?: boolean | null;
  instagram?: string | null;
  facebook?: string | null;
  portfolio?: string | null;
  experiences?: unknown[];
  skills?: unknown[];
  languages?: unknown[];
};

export class GeneratedResumeEntity {
  id: string;
  user_id: string;
  base_resume_id: string;
  session_id: string | null;
  title: string;
  job_description: string | null;
  content: GeneratedResumeContent | null;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(resume: PrismaGeneratedResume) {
    this.id = resume.id;
    this.user_id = resume.user_id;
    this.base_resume_id = resume.resumeId;
    this.session_id = resume.session_id;
    this.title = resume.title;
    this.job_description = resume.job_description;
    this.content = (resume as unknown as { content: GeneratedResumeContent | null }).content ?? null;
    this.is_published = resume.is_published;
    this.created_at = resume.created_at;
    this.updated_at = resume.updated_at;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      base_resume_id: this.base_resume_id,
      job_description: this.job_description,
      ...this.content,
    };
  }
}
