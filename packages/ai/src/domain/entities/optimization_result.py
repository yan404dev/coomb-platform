"""Optimization Result entity."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from domain.entities.resume import Resume
from domain.value_objects import ATSScore


@dataclass
class OptimizationResult:
    """
    Resultado de uma otimização de currículo.
    
    Attributes:
        original_resume: Currículo original
        optimized_resume: Currículo otimizado
        job_description_id: ID da vaga alvo
        ats_score_before: Score ATS antes
        ats_score_after: Score ATS depois
        improvements: Lista de melhorias realizadas
        pdf_url: URL do PDF gerado
    """
    
    original_resume: Resume
    optimized_resume: Resume
    id: UUID = field(default_factory=uuid4)
    job_description_id: Optional[UUID] = None
    ats_score_before: Optional[ATSScore] = None
    ats_score_after: Optional[ATSScore] = None
    improvements: list[str] = field(default_factory=list)
    pdf_url: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    
    def get_score_improvement(self) -> float:
        """Calcula a melhoria no score ATS."""
        if not self.ats_score_before or not self.ats_score_after:
            return 0.0
        
        return self.ats_score_after.value - self.ats_score_before.value
    
    def get_improvement_percentage(self) -> float:
        """Calcula o percentual de melhoria."""
        if not self.ats_score_before or self.ats_score_before.value == 0:
            return 0.0
        
        improvement = self.get_score_improvement()
        return round((improvement / self.ats_score_before.value) * 100, 1)
    
    def has_significant_improvement(self) -> bool:
        """Verifica se houve melhoria significativa (>10 pontos)."""
        return self.get_score_improvement() >= 10
    
    def get_summary(self) -> str:
        """Retorna resumo da otimização."""
        parts = [f"Otimização realizada com {len(self.improvements)} melhorias."]
        
        if self.ats_score_before and self.ats_score_after:
            parts.append(
                f"Score ATS: {self.ats_score_before.value:.0f} → "
                f"{self.ats_score_after.value:.0f} "
                f"(+{self.get_score_improvement():.0f})"
            )
        
        if self.pdf_url:
            parts.append("PDF disponível para download.")
        
        return " ".join(parts)

