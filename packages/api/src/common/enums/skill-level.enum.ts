export enum SkillLevel {
  NENHUM = "nenhum",
  BASICO = "basico",
  INTERMEDIARIO = "intermediario",
  AVANCADO = "avançado",
}

export const SkillLevelMapping: Record<string, SkillLevel> = {
  nenhum: SkillLevel.NENHUM,
  basico: SkillLevel.BASICO,
  básico: SkillLevel.BASICO,
  intermediario: SkillLevel.INTERMEDIARIO,
  intermediário: SkillLevel.INTERMEDIARIO,
  avancado: SkillLevel.AVANCADO,
  avançado: SkillLevel.AVANCADO,
  expert: SkillLevel.AVANCADO,
  advanced: SkillLevel.AVANCADO,
};

export function normalizeSkillLevel(
  level: string | null | undefined
): SkillLevel | null {
  if (!level) return null;
  const normalized = level.toLowerCase().trim();
  return SkillLevelMapping[normalized] || null;
}
