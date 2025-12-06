"""Resume Parser Port - Interface for document parsing."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Optional


# =============================================================================
# Exceptions
# =============================================================================


class ParserError(Exception):
    """Raised when document parsing fails."""

    pass


# =============================================================================
# Data Classes
# =============================================================================


@dataclass
class ExtractedText:
    """
    Raw text extracted from a document.

    Used for simple text extraction before AI parsing.
    """

    content: str
    char_count: int
    source_type: str  # "pdf", "docx", etc.
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class ParsedResume:
    """
    Resultado do parsing de um currículo.

    Attributes:
        raw_text: Texto extraído do documento
        candidate_name: Nome do candidato (se detectado)
        email: Email (se detectado)
        phone: Telefone (se detectado)
        experiences_text: Texto da seção de experiências
        education_text: Texto da seção de formação
        skills_text: Texto da seção de skills
        confidence_score: Score de confiança do parsing (0-1)
    """

    raw_text: str
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    experiences_text: Optional[str] = None
    education_text: Optional[str] = None
    skills_text: Optional[str] = None
    languages_text: Optional[str] = None
    confidence_score: float = 0.0
    metadata: dict = field(default_factory=dict)


# =============================================================================
# Ports (Interfaces)
# =============================================================================


class DocumentParserPort(ABC):
    """
    Interface for simple document text extraction.

    Implementations:
        - PDFParserAdapter (pdfplumber)
        - DOCXParserAdapter (python-docx)
    """

    @abstractmethod
    async def extract_text(self, file_content: bytes) -> ExtractedText:
        """
        Extract raw text from a document.

        Args:
            file_content: Raw bytes of the document

        Returns:
            ExtractedText with content and metadata

        Raises:
            ParserError: If extraction fails
        """
        pass

    @abstractmethod
    def supports_format(self, filename: str) -> bool:
        """Check if this parser supports the given file format."""
        pass


class ResumeParserPort(ABC):
    """
    Interface para parsing de currículos.
    
    Implementações:
        - PDFParserAdapter (pdfplumber/pypdf)
        - DocxParserAdapter (python-docx)
        - LinkedInParserAdapter
    
    Exemplo:
        ```python
        class PDFParserAdapter(ResumeParserPort):
            async def parse(self, content, filename):
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    text = "".join(page.extract_text() for page in pdf.pages)
                return self._extract_sections(text)
        ```
    """
    
    @abstractmethod
    async def parse(
        self,
        content: bytes,
        filename: str,
    ) -> ParsedResume:
        """
        Faz parsing de um currículo.
        
        Args:
            content: Conteúdo do arquivo em bytes
            filename: Nome do arquivo (para detectar formato)
            
        Returns:
            ParsedResume com informações extraídas
            
        Raises:
            ParserError: Se o formato não for suportado
        """
        pass
    
    @abstractmethod
    def supports_format(self, filename: str) -> bool:
        """
        Verifica se o formato é suportado.
        
        Args:
            filename: Nome do arquivo
            
        Returns:
            True se o formato é suportado
        """
        pass
    
    @abstractmethod
    def get_supported_formats(self) -> list[str]:
        """
        Retorna lista de formatos suportados.
        
        Returns:
            Lista de extensões (ex: [".pdf", ".docx"])
        """
        pass

