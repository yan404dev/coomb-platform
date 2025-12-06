"""PDF Renderer Port - Interface for PDF generation."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional


# =============================================================================
# Data Classes
# =============================================================================


@dataclass(frozen=True)
class PDFRenderOptions:
    """
    Opções para renderização de PDF.

    Attributes:
        template_id: ID do template a usar
        page_size: Tamanho da página (A4, Letter, etc)
        margins: Margens em mm
        include_photo: Se deve incluir foto
        color_scheme: Esquema de cores
    """

    template_id: str = "modern"
    page_size: str = "A4"
    margins: dict[str, int] = field(
        default_factory=lambda: {"top": 20, "bottom": 20, "left": 20, "right": 20}
    )
    include_photo: bool = False
    color_scheme: str = "professional"


@dataclass
class PDFRenderRequest:
    """
    Request for PDF rendering.

    Attributes:
        resume: Resume data (dict or entity)
        template_id: Template to use (default: "modern")
        options: Additional render options
    """

    resume: Any  # Can be dict or Resume entity
    template_id: str = "modern"
    options: Optional[PDFRenderOptions] = None


@dataclass
class PDFRenderResult:
    """
    Result of PDF rendering.

    Attributes:
        filename: Generated filename
        filepath: Full path to generated file
        template_used: Template ID that was used
        download_url: URL for downloading (if applicable)
    """

    filename: str
    filepath: str
    template_used: str
    download_url: Optional[str] = None


@dataclass
class TemplateInfo:
    """Information about an available template."""

    id: str
    name: str
    description: str
    preview_url: Optional[str] = None


# =============================================================================
# Port Interface
# =============================================================================


class PDFRendererPort(ABC):
    """
    Interface para renderização de PDFs.

    Esta é uma porta de saída (outbound port) que define como
    a aplicação gera documentos PDF.

    Implementações:
        - WeasyPrintAdapter (recomendado)
        - PlaywrightAdapter
        - ReportLabAdapter (legado)

    Exemplo:
        ```python
        class WeasyPrintAdapter(PDFRendererPort):
            async def render_pdf(self, request):
                html = self._render_template(request.resume, request.template_id)
                HTML(string=html).write_pdf(filepath)
                return PDFRenderResult(filename=..., filepath=...)
        ```
    """

    @abstractmethod
    async def render_pdf(self, request: PDFRenderRequest) -> PDFRenderResult:
        """
        Renderiza um currículo como PDF.

        Args:
            request: PDFRenderRequest com dados do currículo e opções

        Returns:
            PDFRenderResult com caminho do arquivo gerado

        Raises:
            PDFRenderError: Se houver erro na renderização
        """
        pass

    @abstractmethod
    def get_available_templates(self) -> list[TemplateInfo]:
        """
        Retorna lista de templates disponíveis.

        Returns:
            Lista de TemplateInfo com detalhes de cada template
        """
        pass

    # Legacy methods for backward compatibility

    async def render_to_file(
        self,
        content: dict,
        options: PDFRenderOptions,
        output_path: Path,
    ) -> Path:
        """
        [LEGACY] Renderiza PDF e salva em arquivo.

        Use render_pdf() instead.
        """
        request = PDFRenderRequest(resume=content, template_id=options.template_id)
        result = await self.render_pdf(request)
        return Path(result.filepath)

    async def render_to_bytes(
        self,
        content: dict,
        options: PDFRenderOptions,
    ) -> bytes:
        """
        [LEGACY] Renderiza PDF e retorna como bytes.

        Use render_pdf() and read the file instead.
        """
        request = PDFRenderRequest(resume=content, template_id=options.template_id)
        result = await self.render_pdf(request)
        with open(result.filepath, "rb") as f:
            return f.read()

    def template_exists(self, template_id: str) -> bool:
        """Verifica se um template existe."""
        return any(t.id == template_id for t in self.get_available_templates())

