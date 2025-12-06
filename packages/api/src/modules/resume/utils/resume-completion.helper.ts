import { Prisma } from "@prisma/client";
import { CompletionScoreService } from "../services/completion-score.service";
import { RESUME_INCLUDE } from "../constants/resume.constants";

interface ResumeWithUser {
  id: string;
  completion_score: number;
  user: any;
  [key: string]: any;
}

export async function recalculateCompletionScore(
  tx: Prisma.TransactionClient,
  resume: ResumeWithUser,
  completionScoreService: CompletionScoreService
): Promise<ResumeWithUser> {
  const completionScore = completionScoreService.calculate(resume, resume.user);

  if (resume.completion_score !== completionScore) {
    return tx.resume.update({
      where: { id: resume.id },
      data: { completion_score: completionScore },
      include: RESUME_INCLUDE,
    }) as Promise<ResumeWithUser>;
  }

  return resume;
}

