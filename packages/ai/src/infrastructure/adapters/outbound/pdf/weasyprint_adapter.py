
from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import CSS, HTML

from domain.ports.outbound.pdf_renderer_port import (
    PDFRendererPort,
    PDFRenderRequest,
    PDFRenderResult,
    TemplateInfo,
)

logger = logging.getLogger(__name__)

DEFAULT_TEMPLATES_DIR = Path(__file__).parent.parent.parent.parent.parent / "templates"


@dataclass
class TemplateConfig:
    id: str
    name: str
    description: str
    template_file: str = "template.html"
    styles_file: str = "styles.css"


AVAILABLE_TEMPLATES: dict[str, TemplateConfig] = {
    "default": TemplateConfig(
        id="default",
        name="Padrão",
        description="Layout profissional otimizado para ATS",
    ),
}


class WeasyPrintAdapter(PDFRendererPort):
    def __init__(
        self,
        templates_dir: Path | None = None,
        storage_dir: Path | None = None,
    ) -> None:
        self._templates_dir = templates_dir or DEFAULT_TEMPLATES_DIR
        self._storage_dir = storage_dir or Path("storage")
        self._storage_dir.mkdir(parents=True, exist_ok=True)

        self._jinja_env = Environment(
            loader=FileSystemLoader(str(self._templates_dir)),
            autoescape=select_autoescape(["html", "xml"]),
        )

    async def render_pdf(self, request: PDFRenderRequest) -> PDFRenderResult:
        template_id = request.template_id or "default"
        template_config = AVAILABLE_TEMPLATES.get(template_id)

        if not template_config:
            template_id = "default"
            template_config = AVAILABLE_TEMPLATES["default"]

        html_content = self._render_html(request.resume, template_id, template_config)
        filename = self._build_filename(request.resume)
        filepath = self._storage_dir / filename

        css_path = self._templates_dir / template_id / template_config.styles_file
        css = CSS(filename=str(css_path)) if css_path.exists() else None

        html_doc = HTML(
            string=html_content,
            base_url=str(self._templates_dir / template_id),
        )

        if css:
            html_doc.write_pdf(str(filepath), stylesheets=[css])
        else:
            html_doc.write_pdf(str(filepath))

        logger.info(f"PDF generated: {filepath}")

        return PDFRenderResult(
            filename=filename,
            filepath=str(filepath),
            template_used=template_id,
        )

    def get_available_templates(self) -> list[TemplateInfo]:
        return [
            TemplateInfo(id=c.id, name=c.name, description=c.description)
            for c in AVAILABLE_TEMPLATES.values()
        ]

    def _render_html(self, resume: Any, template_id: str, config: TemplateConfig) -> str:
        template = self._jinja_env.get_template(f"{template_id}/{config.template_file}")
        context = self._prepare_template_context(resume)
        return template.render(**context)

    def _prepare_template_context(self, resume: Any) -> dict[str, Any]:
        if isinstance(resume, dict):
            return {"resume": self._dict_to_template_context(resume)}
        return {"resume": resume}

    def _dict_to_template_context(self, data: dict) -> Any:
        class DotDict:
            def __init__(self, d: dict):
                for k, v in d.items():
                    if isinstance(v, dict):
                        setattr(self, k, DotDict(v))
                    elif isinstance(v, list):
                        if k == "skills" and v and isinstance(v[0], dict):
                            if any(key in v[0] for key in ["languages", "frameworks", "tools"]):
                                skills_dict = {}
                                for item in v:
                                    if isinstance(item, dict):
                                        for cat, values in item.items():
                                            if cat not in skills_dict:
                                                skills_dict[cat] = []
                                            if isinstance(values, list):
                                                skills_dict[cat].extend(values)
                                setattr(self, k, DotDict(skills_dict))
                            else:
                                setattr(self, k, [DotDict(i) if isinstance(i, dict) else i for i in v])
                        else:
                            setattr(self, k, [DotDict(i) if isinstance(i, dict) else i for i in v])
                    else:
                        setattr(self, k, v)

            def __getattr__(self, name: str) -> Any:
                return None

        return DotDict(data)

    def _build_filename(self, resume: Any) -> str:
        candidate_name = None
        if isinstance(resume, dict):
            candidate_name = resume.get("candidate_name") or resume.get("name")
        elif hasattr(resume, "candidate_name"):
            candidate_name = resume.candidate_name

        if candidate_name:
            safe_name = "_".join(candidate_name.lower().split())
            return f"resume_{safe_name}.pdf"
        return "resume.pdf"
