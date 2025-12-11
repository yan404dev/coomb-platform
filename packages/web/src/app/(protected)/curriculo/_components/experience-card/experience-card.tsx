"use client";

import type { Experience } from "@/shared/entities";
import { useExperienceCardViewModel } from "./experience-card.view-model";

interface ExperienceCardProps {
  experiences: Experience[];
  onEdit?: (experienceId: string) => void;
}

export function ExperienceCard({ experiences, onEdit }: ExperienceCardProps) {
  const viewModel = useExperienceCardViewModel(experiences, onEdit);

  if (viewModel.isEmpty) {
    return null;
  }

  return (
    <div className="space-y-6">
      {viewModel.experiencesData.map((experience) => (
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
              <p className="text-sm text-foreground">{experience.period}</p>
            </div>

            {experience.description && (
              <p className="text-sm text-foreground leading-relaxed">
                {experience.description}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => viewModel.handleEdit(experience.id)}
              className="text-[#028A5A] font-semibold text-sm hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => viewModel.deleteExperience(experience.id)}
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
