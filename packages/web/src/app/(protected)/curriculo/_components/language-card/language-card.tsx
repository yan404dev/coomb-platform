"use client";

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

type LanguageLevel =
  | "nenhum"
  | "iniciante"
  | "basico"
  | "intermediario"
  | "avancado"
  | "fluente"
  | "nativo";

interface LanguageCardProps {
  name: string;
  level: LanguageLevel;
  onLevelChange: (level: LanguageLevel) => void;
  onRemove: () => void;
  onEdit?: () => void;
}

const languageLevelOptions = [
  {
    value: "nenhum" as const,
    label: "Nenhum",
    description: "Não tenho conhecimento desse idioma.",
  },
  {
    value: "iniciante" as const,
    label: "Iniciante",
    description: "Estou iniciando agora os estudos do idioma.",
  },
  {
    value: "basico" as const,
    label: "Básico",
    description: "Eu consigo compreender palavras simples e cotidianas.",
  },
  {
    value: "intermediario" as const,
    label: "Intermediário",
    description:
      "Compreendo textos inteiros. Mas com dificuldades em discussões.",
  },
  {
    value: "avancado" as const,
    label: "Avançado",
    description:
      "Tenho grande conhecimento do idioma. Consigo conversar sobre qualquer assunto.",
  },
  {
    value: "fluente" as const,
    label: "Fluente",
    description:
      "Tenho alto conhecimento gramatical. Compreendo assuntos complexos.",
  },
  {
    value: "nativo" as const,
    label: "Domínio Pleno",
    description: "Me comunico no idioma como uma pessoa nativa.",
  },
];

export function LanguageCard({
  name,
  level,
  onLevelChange,
  onRemove,
  onEdit,
}: LanguageCardProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground pb-4">
        {name}
      </label>

      <RadioGroup
        value={level}
        onValueChange={onLevelChange}
        className="flex flex-wrap"
      >
        {languageLevelOptions.map((option) => (
          <div
            key={option.value}
            className="border border-border rounded-lg p-4 flex items-start space-x-3 flex-1 min-w-[280px]"
          >
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="mt-0.5"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="flex-1 cursor-pointer space-y-1"
            >
              <div className="text-sm font-semibold leading-none">
                {option.label}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {option.description}
              </div>
            </label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onRemove}
          className="text-[#028A5A] font-semibold text-sm hover:underline"
        >
          Remover idioma
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
