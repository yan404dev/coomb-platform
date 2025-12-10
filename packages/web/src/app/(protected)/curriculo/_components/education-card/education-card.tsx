"use client";

import type { Education } from "@/shared/types";
import { useEducationCardViewModel } from "./education-card.view-model";

interface EducationCardProps {
  educations: Education[];
  onEdit?: (educationId: string) => void;
}

export function EducationCard({ educations, onEdit }: EducationCardProps) {
  const viewModel = useEducationCardViewModel(educations, onEdit);

  if (viewModel.isEmpty) {
    return null;
  }

  return (
    <div className="space-y-6">
      {viewModel.educationsData.map((education) => (
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
              <p className="text-sm text-foreground">{education.period}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => viewModel.handleEdit(education.id)}
              className="text-[#028A5A] font-semibold text-sm hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => viewModel.deleteEducation(education.id)}
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
