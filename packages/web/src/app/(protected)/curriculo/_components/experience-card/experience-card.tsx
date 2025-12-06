"use client";

import { useExperienceCardModel } from "./experience-card.model";
import { formatPeriod, truncateText } from "@/shared/lib/format";

interface ExperienceCardProps {
  onEdit?: (experienceId: string) => void;
}

export function ExperienceCard({ onEdit }: ExperienceCardProps) {
  const { experiences, isLoading, deleteExperience } = useExperienceCardModel();

  if (isLoading) {
    return <div>Carregando experiências...</div>;
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {experiences.map((experience) => (
        <div key={experience.id} className="space-y-4">
          <div className="border border-border rounded-lg p-6 space-y-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {experience.position}
              </h3>
              <p className="text-sm text-foreground">{experience.company}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">Período</p>
              <p className="text-sm text-foreground">
                {formatPeriod(
                  experience.startDate,
                  experience.endDate,
                  experience.current ?? false
                )}
              </p>
            </div>

            {experience.description && (
              <p className="text-sm text-foreground leading-relaxed">
                {truncateText(experience.description)}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onEdit?.(experience.id)}
              className="text-[#028A5A] font-semibold text-sm hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => void deleteExperience(experience.id)}
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
