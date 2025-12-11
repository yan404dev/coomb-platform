import type { Resume } from "@/shared/entities";

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
    resume.completionScore !== undefined && resume.completionScore !== null
      ? Math.max(0, Math.min(100, Math.round(resume.completionScore)))
      : 0;

  return {
    percentage,
    missingCount: 0,
    totalFields: 0,
  };
}
