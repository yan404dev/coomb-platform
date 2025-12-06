"use client";

import { useCertificationCardModel } from "./certification-card.model";

interface CertificationCardProps {
  onEdit?: (certificationId: string) => void;
}

export function CertificationCard({ onEdit }: CertificationCardProps) {
  const { certifications, isLoading, deleteCertification } =
    useCertificationCardModel();

  if (isLoading) {
    return <div>Carregando certificações...</div>;
  }

  if (certifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {certifications.map((certification) => (
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
              onClick={() => onEdit?.(certification.id)}
              className="text-[#028A5A] font-semibold text-sm hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => void deleteCertification(certification.id)}
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
