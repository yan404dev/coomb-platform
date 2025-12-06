"""Skill value object."""

from dataclasses import dataclass
from enum import Enum


class SkillLevel(str, Enum):
    """Níveis de proficiência em uma skill."""
    
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"
    
    @classmethod
    def from_string(cls, value: str) -> "SkillLevel":
        """Converte string para SkillLevel."""
        mapping = {
            "iniciante": cls.BEGINNER,
            "básico": cls.BEGINNER,
            "intermediário": cls.INTERMEDIATE,
            "avançado": cls.ADVANCED,
            "expert": cls.EXPERT,
            "especialista": cls.EXPERT,
        }
        return mapping.get(value.lower(), cls.INTERMEDIATE)


class SkillCategory(str, Enum):
    """Categorias de skills."""
    
    TECHNICAL = "technical"
    SOFT = "soft"
    TOOL = "tool"
    LANGUAGE = "language"
    FRAMEWORK = "framework"
    DATABASE = "database"
    CLOUD = "cloud"
    OTHER = "other"


@dataclass(frozen=True)
class Skill:
    """
    Value Object que representa uma competência/habilidade.
    
    Imutável por design - skills não mudam depois de criadas.
    
    Attributes:
        name: Nome da skill
        level: Nível de proficiência
        category: Categoria da skill
        years_of_experience: Anos de experiência com a skill
    """
    
    name: str
    level: SkillLevel = SkillLevel.INTERMEDIATE
    category: SkillCategory = SkillCategory.OTHER
    years_of_experience: float = 0.0
    
    def is_technical(self) -> bool:
        """Verifica se é uma skill técnica."""
        return self.category in [
            SkillCategory.TECHNICAL,
            SkillCategory.FRAMEWORK,
            SkillCategory.DATABASE,
            SkillCategory.CLOUD,
        ]
    
    def is_soft_skill(self) -> bool:
        """Verifica se é uma soft skill."""
        return self.category == SkillCategory.SOFT
    
    def matches(self, keyword: str) -> bool:
        """Verifica se a skill corresponde a uma keyword."""
        return keyword.lower() in self.name.lower()
    
    def __str__(self) -> str:
        return f"{self.name} ({self.level.value})"

