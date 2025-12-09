from __future__ import annotations

import logging
from typing import Optional

from domain.ports.outbound.pdf_renderer_port import PDFRendererPort, PDFRenderRequest
from domain.chains.optimization_chain import OptimizedResume
from application.services.language_service import LanguageService, Language

logger = logging.getLogger(__name__)


class PDFChain:
    def __init__(
        self,
        pdf_renderer: Optional[PDFRendererPort] = None,
        language_service: Optional[LanguageService] = None,
    ):
        self._pdf = pdf_renderer
        self._language_service = language_service

    async def run(
        self, resume: OptimizedResume, job_description: Optional[str] = None, target_language: Optional[Language] = None
    ) -> Optional[str]:
        if not self._pdf:
            return None

        try:
            language = target_language
            if not language and job_description and self._language_service:
                language = self._language_service.detect_language(job_description)
            else:
                language = language or "pt"

            pdf_data = self._build_pdf_data(resume)

            if language == "en" and self._language_service:
                pdf_data = await self._language_service.translate_resume_content(pdf_data, language)

            result = await self._pdf.render_pdf(
                PDFRenderRequest(resume=pdf_data, template_id="default", language=language)
            )
            return f"/storage/{result.filename}"
        except Exception as e:
            logger.error(f"PDF generation failed: {e}")
            return None

    def _build_pdf_data(self, resume: OptimizedResume) -> dict:
        return {
            "candidate_name": resume.candidate_name,
            "contact_info": {
                "email": resume.email,
                "phone": resume.phone,
                "linkedin": resume.linkedin,
                "github": resume.github,
            },
            "professional_summary": resume.professional_summary,
            "experiences": [
                {
                    "company": exp.company,
                    "position": exp.position,
                    "description": exp.description,
                    "achievements": exp.achievements,
                    "date_range": {
                        "start_formatted": exp.start_date,
                        "end_formatted": exp.end_date or "Presente",
                        "is_current": exp.current,
                    },
                    "work_mode": exp.work_mode,
                    "country": exp.country,
                }
                for exp in resume.experiences
            ],
            "skills": [{"name": s} for s in resume.skills],
            "languages": resume.languages,
            "education": resume.education,
            "certifications": resume.certifications,
        }

