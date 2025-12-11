"use client";

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

type ProficiencyLevel = "none" | "basic" | "intermediate" | "advanced";

interface SkillCardProps {
  name: string;
  level: ProficiencyLevel;
  onLevelChange: (level: ProficiencyLevel) => void;
  onRemove: () => void;
}

const proficiencyOptions = [
  { value: "none" as const, label: "Nenhum" },
  { value: "basic" as const, label: "Básico" },
  { value: "intermediate" as const, label: "Intermediário" },
  { value: "advanced" as const, label: "Avançado" },
];

export function SkillCard({
  name,
  level,
  onLevelChange,
  onRemove,
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

      <button
        onClick={onRemove}
        className="text-[#028A5A] font-semibold text-sm hover:underline"
      >
        Remover habilidade
      </button>
    </div>
  );
}
