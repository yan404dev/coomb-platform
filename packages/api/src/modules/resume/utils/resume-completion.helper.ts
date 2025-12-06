import { Prisma, Resume } from "@prisma/client";
import { CompletionScoreService } from "../services/completion-score.service";
import { RESUME_INCLUDE } from "../constants/resume.constants";

type ResumeWithUser = Resume & {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    cpf: string | null;
    birth_date: string | null;
    has_disability: boolean | null;
    race: string | null;
    sexual_orientation: string | null;
    gender: string | null;
    state: string | null;
    city: string | null;
    salary_expectation: string | null;
    has_cnh: boolean | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    portfolio: string | null;
    professional_summary: string | null;
    career_goals: string | null;
    personality_profile: Prisma.JsonValue | null;
    personality_generated_at: Date | null;
  } | null;
};

export async function recalculateCompletionScore(
  tx: Prisma.TransactionClient,
  resume: ResumeWithUser,
  completionScoreService: CompletionScoreService
): Promise<Resume> {
  if (!resume.user) {
    throw new Error("Resume must have a user");
  }
  
  const completionScore = completionScoreService.calculate(resume, resume.user);

  if (resume.completion_score !== completionScore) {
    const updated = await tx.resume.update({
      where: { id: resume.id },
      data: { completion_score: completionScore },
      include: RESUME_INCLUDE,
    });
    return updated as Resume;
  }

  return resume as Resume;
}

