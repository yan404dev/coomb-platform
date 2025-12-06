"""DateRange value object."""

from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass(frozen=True)
class DateRange:
    """
    Value Object que representa um período de tempo.
    
    Usado para experiências profissionais e formações.
    Imutável por design.
    
    Attributes:
        start: Data de início
        end: Data de término (None se atual)
        is_current: Se é a posição/formação atual
    """
    
    start: date
    end: Optional[date] = None
    is_current: bool = False
    
    def __post_init__(self) -> None:
        """Valida as datas após criação."""
        if self.end and self.start > self.end:
            raise ValueError("Data de início não pode ser posterior à data de término")
        
        if self.is_current and self.end:
            raise ValueError("Posição atual não pode ter data de término")
    
    def get_duration_in_months(self) -> int:
        """Calcula a duração em meses."""
        end_date = self.end or date.today()
        
        months = (end_date.year - self.start.year) * 12
        months += end_date.month - self.start.month
        
        return max(1, months)  # Mínimo de 1 mês
    
    def get_duration_in_years(self) -> float:
        """Calcula a duração em anos."""
        return round(self.get_duration_in_months() / 12, 1)
    
    def format_period(self, locale: str = "pt-BR") -> str:
        """Formata o período para exibição."""
        start_str = self.start.strftime("%m/%Y")
        
        if self.is_current:
            end_str = "Atual"
        elif self.end:
            end_str = self.end.strftime("%m/%Y")
        else:
            end_str = "Atual"
        
        return f"{start_str} - {end_str}"
    
    def overlaps_with(self, other: "DateRange") -> bool:
        """Verifica se há sobreposição com outro período."""
        self_end = self.end or date.today()
        other_end = other.end or date.today()
        
        return self.start <= other_end and other.start <= self_end
    
    @classmethod
    def current_since(cls, start: date) -> "DateRange":
        """Factory method para posição atual."""
        return cls(start=start, is_current=True)
    
    @classmethod
    def from_strings(
        cls, 
        start: str, 
        end: Optional[str] = None,
        format: str = "%Y-%m-%d"
    ) -> "DateRange":
        """Cria DateRange a partir de strings."""
        start_date = date.fromisoformat(start) if "-" in start else date.strptime(start, format)
        
        if end and end.lower() not in ["atual", "current", "presente"]:
            end_date = date.fromisoformat(end) if "-" in end else date.strptime(end, format)
            return cls(start=start_date, end=end_date)
        
        return cls(start=start_date, is_current=True)

