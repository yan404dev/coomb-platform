"use client";

import type { Certification } from "@/shared/types";
import { useCertificationCardViewModel } from "./certification-card.view-model";

interface CertificationCardProps {
  certifications: Certification[];
  onEdit?: (certificationId: string) => void;
}

export function CertificationCard({ certifications, onEdit }: CertificationCardProps) {
  const viewModel = useCertificationCardViewModel(certifications, onEdit);

  if (viewModel.isEmpty) {
    return null;
  }

  return (
    <div className="space-y-6">
      {viewModel.certificationsData.map((certification) => (
        <div key={certification.id} className="space-y-4">
          <div className="border border-border rounded-lg p-6 space-y-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {certification.name}
              </h3>
              <p className="text-sm text-foreground">
                {certification.institution}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">
                Data de conclusão
              </p>
              <p className="text-sm text-foreground">
                {certification.completionDate}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => viewModel.handleEdit(certification.id)}
              className="text-[#028A5A] font-semibold text-sm hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => viewModel.deleteCertification(certification.id)}
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
