"""Candidate Profile entity - Aggregate for candidate data."""

from dataclasses import dataclass, field
from typing import Optional
from uuid import UUID, uuid4

from domain.entities.resume import Resume
from domain.value_objects import ContactInfo


@dataclass
class CandidateProfile:
    """
    Aggregate root que representa o perfil completo de um candidato.
    
    Combina dados do usuário com seu currículo principal.
    
    Attributes:
        user_id: ID do usuário no sistema
        full_name: Nome completo
        contact_info: Informações de contato
        resume: Currículo principal
        career_goals: Objetivos de carreira
        preferred_industries: Setores de interesse
    """
    
    user_id: str
    full_name: str
    contact_info: ContactInfo
    id: UUID = field(default_factory=uuid4)
    resume: Optional[Resume] = None
    career_goals: Optional[str] = None
    preferred_industries: list[str] = field(default_factory=list)
    preferred_locations: list[str] = field(default_factory=list)
    salary_expectation: Optional[str] = None
    
    def has_complete_resume(self) -> bool:
        """Verifica se possui currículo completo."""
        if not self.resume:
            return False
        
        return (
            len(self.resume.experiences) > 0 and
            len(self.resume.skills) > 0
        )
    
    def get_years_of_experience(self) -> float:
        """Retorna anos de experiência do currículo."""
        if not self.resume:
            return 0.0
        return self.resume.get_total_years_of_experience()
    
    def get_primary_skills(self, limit: int = 5) -> list[str]:
        """Retorna as principais skills."""
        if not self.resume:
            return []
        return self.resume.get_all_skill_names()[:limit]

