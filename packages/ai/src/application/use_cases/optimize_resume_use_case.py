"""Use Case: Otimizar currículo para vaga."""

from __future__ import annotations

import json
import logging
from typing import Optional

from pydantic import BaseModel, Field

from application.dto.optimization_dto import (
    OptimizeResumeRequest,
    OptimizeResumeResponse,
    OptimizedExperience,
    OptimizedResume,
)
from domain.ports.outbound.llm_provider_port import LLMProviderPort, LLMMessage
from domain.ports.outbound.pdf_renderer_port import PDFRendererPort, PDFRenderRequest
from application.services.rag_service import RAGService

logger = logging.getLogger(__name__)


class OptimizedExperienceSchema(BaseModel):
    position: str = Field(description="Cargo otimizado")
    description: str = Field(description="Descrição otimizada com keywords")
    achievements: list[str] = Field(description="Conquistas quantificáveis")
    keywords_used: list[str] = Field(description="Keywords da vaga utilizadas")


class OptimizationResultSchema(BaseModel):
    professional_summary: str = Field(description="Resumo profissional otimizado")
    optimized_experiences: list[OptimizedExperienceSchema]
    prioritized_skills: list[str] = Field(description="Skills priorizadas")
    keywords_matched: list[str] = Field(description="Keywords encontradas")
    ats_score: int = Field(description="Score ATS estimado (0-100)")
    improvements_made: list[str] = Field(description="Melhorias realizadas")


class OptimizeResumeUseCase:
    """Otimiza currículo para vaga específica usando IA."""

    def __init__(
        self,
        llm_provider: LLMProviderPort,
        pdf_renderer: Optional[PDFRendererPort] = None,
        rag_service: Optional[RAGService] = None,
    ):
        self._llm = llm_provider
        self._pdf = pdf_renderer
        self._rag = rag_service

    async def execute(self, request: OptimizeResumeRequest) -> OptimizeResumeResponse:
        logger.info(f"Optimizing resume for: {request.resume.candidate_name}")

        ats_before = self._calculate_ats_score(request.resume, request.job_description)
        optimization = await self._optimize_with_llm(request)
        optimized_resume = self._build_optimized_resume(request.resume, optimization)

        pdf_url = None
        if request.generate_pdf and self._pdf:
            pdf_url = await self._generate_pdf(optimized_resume, request.template_id)

        return OptimizeResumeResponse(
            optimized_resume=optimized_resume,
            ats_score_before=ats_before,
            ats_score_after=optimization.ats_score,
            improvements=optimization.improvements_made,
            pdf_url=pdf_url,
        )

    def _calculate_ats_score(self, resume, job_description: str) -> int:
        job_keywords = set(job_description.lower().split())
        resume_text = " ".join([
            resume.professional_summary or "",
            " ".join(exp.description for exp in resume.experiences),
            " ".join(s.name for s in resume.skills),
        ]).lower()

        resume_words = set(resume_text.split())
        matches = job_keywords & resume_words

        return min(100, int(len(matches) / max(len(job_keywords), 1) * 100))

    async def _optimize_with_llm(self, request: OptimizeResumeRequest) -> OptimizationResultSchema:
        system_prompt = """Você é um especialista em otimização de currículos para ATS.

Regras:
1. Use keywords da vaga nas descrições
2. Adicione métricas (ex: "aumentou 30%", "equipe de 5")
3. Adapte títulos de cargo quando apropriado
4. Priorize skills relevantes
5. Crie resumo focado nos requisitos
6. Não invente experiências

Output: JSON com a otimização."""

        job_description = request.job_description

        if self._rag:
            try:
                market_context = await self._rag.retrieve_context(
                    query=job_description,
                    limit=3,
                    min_score=0.7,
                )
                if market_context:
                    context_text = "\n\n".join(
                        [
                            f"[Conhecimento de Mercado {i+1}]\n{r.document.content}"
                            for i, r in enumerate(market_context)
                        ]
                    )
                    job_description = f"""{job_description}

=== CONHECIMENTO DE MERCADO ===
{context_text}"""
            except Exception as e:
                logger.warning(f"RAG enrichment failed for optimization: {e}")

        user_prompt = f"""## Vaga
{job_description}

## Currículo
Nome: {request.resume.candidate_name}
Resumo: {request.resume.professional_summary or "N/A"}

### Experiências
{self._format_experiences(request.resume.experiences)}

### Skills
{", ".join(s.name for s in request.resume.skills)}"""

        if hasattr(self._llm, "complete_with_schema"):
            return await self._llm.complete_with_schema(
                messages=[
                    LLMMessage(role="system", content=system_prompt),
                    LLMMessage(role="user", content=user_prompt),
                ],
                output_schema=OptimizationResultSchema,
                temperature=0.3,
            )
        else:
            response = await self._llm.complete(
                messages=[
                    LLMMessage(role="system", content=system_prompt),
                    LLMMessage(role="user", content=user_prompt),
                ],
                temperature=0.3,
            )
            return OptimizationResultSchema(**json.loads(response.content))

    def _format_experiences(self, experiences) -> str:
        result = []
        for exp in experiences:
            period = f"{exp.start_date} - {'Atual' if exp.current else exp.end_date or 'N/A'}"
            result.append(f"- {exp.position} @ {exp.company} ({period})\n  {exp.description}")
        return "\n".join(result)

    def _build_optimized_resume(self, original, optimization: OptimizationResultSchema) -> OptimizedResume:
        optimized_experiences = []
        for i, opt_exp in enumerate(optimization.optimized_experiences):
            orig = original.experiences[i] if i < len(original.experiences) else None

            optimized_experiences.append(
                OptimizedExperience(
                    company=orig.company if orig else "Empresa",
                    position=opt_exp.position,
                    original_position=orig.position if orig else None,
                    description=opt_exp.description,
                    achievements=opt_exp.achievements,
                    keywords_added=opt_exp.keywords_used,
                    start_date=orig.start_date if orig else "",
                    end_date=orig.end_date if orig else None,
                    current=orig.current if orig else False,
                )
            )

        return OptimizedResume(
            candidate_name=original.candidate_name,
            email=original.email,
            phone=original.phone,
            linkedin=original.linkedin,
            professional_summary=optimization.professional_summary,
            experiences=optimized_experiences,
            skills=optimization.prioritized_skills,
            keywords_matched=optimization.keywords_matched,
        )

    async def _generate_pdf(self, resume: OptimizedResume, template_id: str) -> str:
        pdf_data = {
            "candidate_name": resume.candidate_name,
            "contact_info": {
                "email": resume.email,
                "phone": resume.phone,
                "linkedin": resume.linkedin,
            },
            "professional_summary": resume.professional_summary,
            "experiences": [
                {
                    "company": exp.company,
                    "position": exp.position,
                    "description": exp.description,
                    "date_range": {
                        "start_formatted": exp.start_date,
                        "end_formatted": exp.end_date,
                        "is_current": exp.current,
                    },
                    "achievements": exp.achievements,
                }
                for exp in resume.experiences
            ],
            "skills": [{"name": s} for s in resume.skills],
        }

        result = await self._pdf.render_pdf(
            PDFRenderRequest(resume=pdf_data, template_id=template_id)
        )
        return f"/api/v1/pdf/files/{result.filename}"
