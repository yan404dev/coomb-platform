export type LanguageLevelType =
  | "nenhum"
  | "iniciante"
  | "basico"
  | "intermediario"
  | "avancado"
  | "fluente"
  | "nativo"
  | null;

export const LanguageLevel = {
  NENHUM: "nenhum" as const,
  INICIANTE: "iniciante" as const,
  BASICO: "basico" as const,
  INTERMEDIARIO: "intermediario" as const,
  AVANCADO: "avancado" as const,
  FLUENTE: "fluente" as const,
  NATIVO: "nativo" as const,
} as const;

