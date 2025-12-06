"""Language value object."""

from dataclasses import dataclass
from enum import Enum


class LanguageProficiency(str, Enum):
    """Níveis de proficiência em idiomas."""
    
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    FLUENT = "fluent"
    NATIVE = "native"
    
    @classmethod
    def from_string(cls, value: str) -> "LanguageProficiency":
        """Converte string para LanguageProficiency."""
        mapping = {
            "básico": cls.BASIC,
            "basic": cls.BASIC,
            "iniciante": cls.BASIC,
            "intermediário": cls.INTERMEDIATE,
            "intermediate": cls.INTERMEDIATE,
            "avançado": cls.ADVANCED,
            "advanced": cls.ADVANCED,
            "fluente": cls.FLUENT,
            "fluent": cls.FLUENT,
            "nativo": cls.NATIVE,
            "native": cls.NATIVE,
        }
        return mapping.get(value.lower(), cls.INTERMEDIATE)
    
    def to_portuguese(self) -> str:
        """Retorna o nível em português."""
        mapping = {
            self.BASIC: "Básico",
            self.INTERMEDIATE: "Intermediário",
            self.ADVANCED: "Avançado",
            self.FLUENT: "Fluente",
            self.NATIVE: "Nativo",
        }
        return mapping.get(self, "Intermediário")


@dataclass(frozen=True)
class Language:
    """
    Value Object que representa proficiência em um idioma.
    
    Imutável por design.
    
    Attributes:
        name: Nome do idioma
        proficiency: Nível de proficiência
    """
    
    name: str
    proficiency: LanguageProficiency = LanguageProficiency.INTERMEDIATE
    
    def is_fluent_or_native(self) -> bool:
        """Verifica se é fluente ou nativo."""
        return self.proficiency in [
            LanguageProficiency.FLUENT,
            LanguageProficiency.NATIVE,
        ]
    
    def __str__(self) -> str:
        return f"{self.name} ({self.proficiency.to_portuguese()})"

