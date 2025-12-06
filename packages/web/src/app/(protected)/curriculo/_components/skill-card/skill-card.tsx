"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ProficiencyLevel =
  | "nenhum"
  | "basico"
  | "intermediario"
  | "avançado";

interface SkillCardProps {
  name: string;
  level: ProficiencyLevel;
  onLevelChange: (level: ProficiencyLevel) => void;
  onRemove: () => void;
  onEdit?: () => void;
}

const proficiencyOptions = [
  { value: "nenhum" as const, label: "Nenhum" },
  { value: "basico" as const, label: "Básico" },
  { value: "intermediario" as const, label: "Intermediário" },
  { value: "avançado" as const, label: "Avançado" },
];

export function SkillCard({
  name,
  level,
  onLevelChange,
  onRemove,
  onEdit,
}: SkillCardProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground">{name}</label>

      <div className="border border-border rounded-lg p-4">
        <RadioGroup
          value={level}
          onValueChange={onLevelChange}
          className="grid grid-cols-4 gap-4"
        >
          {proficiencyOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${name}-${option.value}`}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onRemove}
          className="text-[#028A5A] font-semibold text-sm hover:underline"
        >
          Remover habilidade
        </button>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="text-[#028A5A] font-semibold text-sm hover:underline"
          >
            Editar
          </button>
        ) : null}
      </div>
    </div>
  );
}
