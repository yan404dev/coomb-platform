import type { Resume } from "@/entities";

export function getResumeCompletionStats(resume?: Resume | null) {
  if (!resume) {
    return {
      percentage: 0,
      missingCount: 0,
      totalFields: 0,
    };
  }

  // Use completion score from backend
  const percentage =
    resume.completion_score !== undefined && resume.completion_score !== null
      ? Math.max(0, Math.min(100, Math.round(resume.completion_score)))
      : 0;

  return {
    percentage,
    missingCount: 0,
    totalFields: 0,
  };
}
