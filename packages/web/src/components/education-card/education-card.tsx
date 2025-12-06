"use client";

import { useEducationCardModel } from "./education-card.model";
import { formatPeriod } from "@/lib/format";

interface EducationCardProps {
  onEdit?: (educationId: string) => void;
}

export function EducationCard({ onEdit }: EducationCardProps) {
  const { educations, isLoading, deleteEducation } = useEducationCardModel();

  if (isLoading) {
    return <div>Carregando formações...</div>;
  }

  if (educations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {educations.map((education) => (
        <div key={education.id} className="space-y-4">
          <div className="border border-border rounded-lg p-6 space-y-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {education.degree}
              </h3>
              <p className="text-sm text-foreground">{education.institution}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">Período</p>
              <p className="text-sm text-foreground">
                {formatPeriod(
                  education.startDate,
                  education.endDate,
                  education.current ?? false
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onEdit?.(education.id)}
              className="text-[#028A5A] font-semibold text-sm hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => void deleteEducation(education.id)}
              className="text-[#028A5A] font-semibold text-sm hover:underline"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
