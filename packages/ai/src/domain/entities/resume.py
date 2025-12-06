"""Resume entity and related domain objects."""

from dataclasses import dataclass, field
from typing import Optional
from uuid import UUID, uuid4

from domain.value_objects import Skill, Language, ContactInfo, DateRange


@dataclass(frozen=False)
class Experience:
    """
    Representa uma experiência profissional no currículo.
    
    Attributes:
        company: Nome da empresa
        position: Cargo/título
        description: Descrição das atividades
        date_range: Período de trabalho
        achievements: Lista de conquistas quantificáveis
        skills_used: Skills utilizadas nesta experiência
    """
    
    company: str
    position: str
    description: str
    date_range: DateRange
    id: UUID = field(default_factory=uuid4)
    achievements: list[str] = field(default_factory=list)
    skills_used: list[Skill] = field(default_factory=list)
    
    def has_quantifiable_achievements(self) -> bool:
        """Verifica se a experiência possui conquistas quantificáveis."""
        quantifiers = [
            "%", "R$", "$", "K", "M", "mil", "milhão", "milhões",
            "aumento", "redução", "crescimento", "economia",
            "+", "x", "vezes"
        ]
        return any(
            any(q in achievement.lower() for q in quantifiers)
            for achievement in self.achievements
        )
    
    def get_duration_in_months(self) -> int:
        """Retorna a duração da experiência em meses."""
        return self.date_range.get_duration_in_months()
    
    def is_current(self) -> bool:
        """Verifica se é o emprego atual."""
        return self.date_range.is_current


@dataclass(frozen=False)
class Education:
    """
    Representa uma formação educacional.
    
    Attributes:
        institution: Nome da instituição
        degree: Grau obtido (Graduação, Pós, MBA, etc)
        field_of_study: Área de estudo
        date_range: Período do curso
    """
    
    institution: str
    degree: str
    id: UUID = field(default_factory=uuid4)
    field_of_study: Optional[str] = None
    date_range: Optional[DateRange] = None
    
    def get_full_degree_name(self) -> str:
        """Retorna o nome completo do grau com área de estudo."""
        if self.field_of_study:
            return f"{self.degree} em {self.field_of_study}"
        return self.degree


@dataclass(frozen=False)
class Resume:
    """
    Aggregate Root que representa um currículo completo.
    
    Esta é a entidade principal do domínio de currículos,
    contendo todas as informações profissionais do candidato.
    
    Attributes:
        candidate_name: Nome completo do candidato
        contact_info: Informações de contato
        professional_summary: Resumo profissional
        experiences: Lista de experiências profissionais
        educations: Lista de formações
        skills: Lista de competências
        languages: Lista de idiomas
        certifications: Lista de certificações
    """
    
    candidate_name: str
    contact_info: ContactInfo
    id: UUID = field(default_factory=uuid4)
    professional_summary: Optional[str] = None
    experiences: list[Experience] = field(default_factory=list)
    educations: list[Education] = field(default_factory=list)
    skills: list[Skill] = field(default_factory=list)
    languages: list[Language] = field(default_factory=list)
    certifications: list[str] = field(default_factory=list)
    
    def get_total_years_of_experience(self) -> float:
        """Calcula o total de anos de experiência profissional."""
        total_months = sum(
            exp.get_duration_in_months()
            for exp in self.experiences
        )
        return round(total_months / 12, 1)
    
    def get_skills_by_category(self, category: str) -> list[Skill]:
        """Retorna skills filtradas por categoria."""
        return [
            skill for skill in self.skills 
            if skill.category.lower() == category.lower()
        ]
    
    def has_skill(self, skill_name: str) -> bool:
        """Verifica se o currículo possui determinada skill."""
        skill_name_lower = skill_name.lower()
        return any(
            skill_name_lower in skill.name.lower()
            for skill in self.skills
        )
    
    def get_current_position(self) -> Optional[Experience]:
        """Retorna a experiência atual, se houver."""
        current_experiences = [
            exp for exp in self.experiences
            if exp.is_current()
        ]
        return current_experiences[0] if current_experiences else None
    
    def get_latest_education(self) -> Optional[Education]:
        """Retorna a formação mais recente."""
        if not self.educations:
            return None
        return self.educations[0]  # Assume ordenação por data
    
    def get_all_skill_names(self) -> list[str]:
        """Retorna lista de nomes de todas as skills."""
        return [skill.name for skill in self.skills]
    
    def count_quantifiable_experiences(self) -> int:
        """Conta experiências que possuem conquistas quantificáveis."""
        return sum(
            1 for exp in self.experiences 
            if exp.has_quantifiable_achievements()
        )

