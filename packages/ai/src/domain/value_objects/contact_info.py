"""ContactInfo value object."""

from dataclasses import dataclass
from typing import Optional
import re


@dataclass(frozen=True)
class ContactInfo:
    """
    Value Object que representa informações de contato.
    
    Imutável por design.
    
    Attributes:
        email: Email de contato
        phone: Telefone
        location: Cidade/Estado
        linkedin: URL ou username do LinkedIn
        github: URL ou username do GitHub
        portfolio: URL do portfolio
    """
    
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    
    def __post_init__(self) -> None:
        """Valida email após criação."""
        if not self._is_valid_email(self.email):
            raise ValueError(f"Email inválido: {self.email}")
    
    def _is_valid_email(self, email: str) -> bool:
        """Valida formato de email."""
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return bool(re.match(pattern, email))
    
    def get_linkedin_url(self) -> Optional[str]:
        """Retorna URL completa do LinkedIn."""
        if not self.linkedin:
            return None
        
        if self.linkedin.startswith("http"):
            return self.linkedin
        
        # Remove prefixos comuns
        username = self.linkedin.replace("linkedin.com/in/", "").strip("/")
        return f"https://www.linkedin.com/in/{username}"
    
    def get_github_url(self) -> Optional[str]:
        """Retorna URL completa do GitHub."""
        if not self.github:
            return None
        
        if self.github.startswith("http"):
            return self.github
        
        username = self.github.replace("github.com/", "").strip("/")
        return f"https://github.com/{username}"
    
    def get_formatted_phone(self) -> Optional[str]:
        """Retorna telefone formatado."""
        if not self.phone:
            return None
        
        # Remove caracteres não numéricos
        digits = re.sub(r"\D", "", self.phone)
        
        # Formato brasileiro: (XX) XXXXX-XXXX
        if len(digits) == 11:
            return f"({digits[:2]}) {digits[2:7]}-{digits[7:]}"
        elif len(digits) == 10:
            return f"({digits[:2]}) {digits[2:6]}-{digits[6:]}"
        
        return self.phone

