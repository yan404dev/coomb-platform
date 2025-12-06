"""Job Description entity."""

from dataclasses import dataclass, field
from typing import Optional
from uuid import UUID, uuid4


@dataclass
class Requirement:
    """
    Representa um requisito da vaga.
    
    Attributes:
        description: Descrição do requisito
        is_mandatory: Se é obrigatório
        category: Categoria (skill, education, experience, etc)
    """
    
    description: str
    is_mandatory: bool = True
    category: str = "general"


@dataclass
class JobDescription:
    """
    Entidade que representa uma descrição de vaga.
    
    Attributes:
        title: Título da vaga
        company: Nome da empresa
        full_description: Descrição completa da vaga
        requirements: Lista de requisitos
        location: Localização
        salary_range: Faixa salarial
        employment_type: Tipo de contrato
    """
    
    title: str
    full_description: str
    id: UUID = field(default_factory=uuid4)
    company: Optional[str] = None
    requirements: list[Requirement] = field(default_factory=list)
    location: Optional[str] = None
    salary_range: Optional[str] = None
    employment_type: str = "full_time"  # full_time, part_time, contract, internship
    remote: bool = False
    
    def get_mandatory_requirements(self) -> list[Requirement]:
        """Retorna apenas requisitos obrigatórios."""
        return [r for r in self.requirements if r.is_mandatory]
    
    def get_optional_requirements(self) -> list[Requirement]:
        """Retorna requisitos opcionais/desejáveis."""
        return [r for r in self.requirements if not r.is_mandatory]
    
    def is_remote_friendly(self) -> bool:
        """Verifica se aceita trabalho remoto."""
        remote_keywords = ["remoto", "remote", "home office", "anywhere"]
        description_lower = self.full_description.lower()
        return self.remote or any(kw in description_lower for kw in remote_keywords)

