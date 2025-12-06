export enum LanguageLevel {
  NENHUM = "nenhum",
  INICIANTE = "iniciante",
  BASICO = "basico",
  INTERMEDIARIO = "intermediario",
  AVANCADO = "avancado",
  FLUENTE = "fluente",
  NATIVO = "nativo",
}

export const LanguageLevelMapping: Record<string, LanguageLevel> = {
  nenhum: LanguageLevel.NENHUM,
  iniciante: LanguageLevel.INICIANTE,
  basico: LanguageLevel.BASICO,
  básico: LanguageLevel.BASICO,
  intermediario: LanguageLevel.INTERMEDIARIO,
  intermediário: LanguageLevel.INTERMEDIARIO,
  avancado: LanguageLevel.AVANCADO,
  avançado: LanguageLevel.AVANCADO,
  fluente: LanguageLevel.FLUENTE,
  nativo: LanguageLevel.NATIVO,
  native: LanguageLevel.NATIVO,
};

export function normalizeLanguageLevel(
  level: string | null | undefined
): LanguageLevel | null {
  if (!level) return null;
  const normalized = level.toLowerCase().trim();
  return LanguageLevelMapping[normalized] || null;
}
