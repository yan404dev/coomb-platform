export type SkillLevelType =
  | "nenhum"
  | "basico"
  | "intermediario"
  | "avançado"
  | null;

export const SkillLevel = {
  NENHUM: "nenhum" as const,
  BASICO: "basico" as const,
  INTERMEDIARIO: "intermediario" as const,
  AVANCADO: "avançado" as const,
} as const;
