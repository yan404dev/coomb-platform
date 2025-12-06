"""ATS Score value objects."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class ATSBreakdown:
    """
    Breakdown detalhado do score ATS.
    
    Attributes:
        keyword_match: Pontuação de match de keywords (0-100)
        format_score: Pontuação de formatação (0-100)
        experience_relevance: Relevância da experiência (0-100)
        skills_match: Match de skills (0-100)
        education_match: Match de formação (0-100)
    """
    
    keyword_match: float = 0.0
    format_score: float = 0.0
    experience_relevance: float = 0.0
    skills_match: float = 0.0
    education_match: float = 0.0
    
    def get_weakest_area(self) -> str:
        """Retorna a área com menor pontuação."""
        scores = {
            "Keywords": self.keyword_match,
            "Formatação": self.format_score,
            "Experiência": self.experience_relevance,
            "Skills": self.skills_match,
            "Formação": self.education_match,
        }
        return min(scores, key=scores.get)
    
    def get_improvement_suggestions(self) -> list[str]:
        """Retorna sugestões de melhoria baseadas nos scores."""
        suggestions = []
        
        if self.keyword_match < 70:
            suggestions.append("Adicione mais palavras-chave relevantes da vaga")
        
        if self.format_score < 70:
            suggestions.append("Melhore a formatação para ser mais ATS-friendly")
        
        if self.experience_relevance < 70:
            suggestions.append("Destaque experiências mais relevantes para a vaga")
        
        if self.skills_match < 70:
            suggestions.append("Adicione skills técnicas mencionadas na vaga")
        
        if self.education_match < 70:
            suggestions.append("Destaque formação relevante para a posição")
        
        return suggestions


@dataclass(frozen=True)
class ATSScore:
    """
    Value Object que representa o score de compatibilidade ATS.
    
    Imutável por design.
    
    Attributes:
        value: Score total (0-100)
        breakdown: Detalhamento por categoria
        matched_keywords: Keywords encontradas no currículo
        missing_keywords: Keywords não encontradas
    """
    
    value: float
    breakdown: ATSBreakdown = field(default_factory=ATSBreakdown)
    matched_keywords: list[str] = field(default_factory=list)
    missing_keywords: list[str] = field(default_factory=list)
    
    def __post_init__(self) -> None:
        """Valida score após criação."""
        if not 0 <= self.value <= 100:
            raise ValueError(f"Score deve estar entre 0 e 100, recebido: {self.value}")
    
    def is_excellent(self) -> bool:
        """Verifica se o score é excelente (>=85)."""
        return self.value >= 85
    
    def is_good(self) -> bool:
        """Verifica se o score é bom (>=70)."""
        return self.value >= 70
    
    def is_needs_improvement(self) -> bool:
        """Verifica se precisa de melhorias (<70)."""
        return self.value < 70
    
    def get_match_percentage(self) -> float:
        """Retorna o percentual de keywords matched."""
        total = len(self.matched_keywords) + len(self.missing_keywords)
        if total == 0:
            return 0.0
        return round(len(self.matched_keywords) / total * 100, 1)
    
    def get_grade(self) -> str:
        """Retorna nota/grade do score."""
        if self.value >= 90:
            return "A"
        elif self.value >= 80:
            return "B"
        elif self.value >= 70:
            return "C"
        elif self.value >= 60:
            return "D"
        return "F"
    
    @classmethod
    def calculate(
        cls,
        breakdown: ATSBreakdown,
        matched_keywords: list[str],
        missing_keywords: list[str],
    ) -> "ATSScore":
        """Factory method que calcula o score a partir do breakdown."""
        # Pesos para cada categoria
        weights = {
            "keyword_match": 0.30,
            "format_score": 0.15,
            "experience_relevance": 0.25,
            "skills_match": 0.20,
            "education_match": 0.10,
        }
        
        total = (
            breakdown.keyword_match * weights["keyword_match"] +
            breakdown.format_score * weights["format_score"] +
            breakdown.experience_relevance * weights["experience_relevance"] +
            breakdown.skills_match * weights["skills_match"] +
            breakdown.education_match * weights["education_match"]
        )
        
        return cls(
            value=round(total, 1),
            breakdown=breakdown,
            matched_keywords=matched_keywords,
            missing_keywords=missing_keywords,
        )

