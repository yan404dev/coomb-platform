"""Resume optimization routes."""

from __future__ import annotations

import json
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from application.dto.optimization_dto import (
    OptimizeResumeRequest,
    OptimizeResumeResponse,
    ExperienceInput,
    SkillInput,
    ResumeInput,
)
from application.use_cases.optimize_resume_use_case import OptimizeResumeUseCase
from domain.ports.outbound.llm_provider_port import LLMMessage
from infrastructure.adapters.outbound.llm import OpenAIAdapter
from infrastructure.adapters.outbound.pdf import WeasyPrintAdapter
from infrastructure.adapters.outbound.vector_store.qdrant_adapter import QdrantAdapter
from application.services.embedding_service import EmbeddingService
from application.services.rag_service import RAGService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/resumes", tags=["Resume Optimization"])

llm_adapter = OpenAIAdapter()
pdf_adapter = WeasyPrintAdapter()
vector_store = QdrantAdapter()
embedding_service = EmbeddingService()
rag_service = RAGService(vector_store, embedding_service)
optimize_use_case = OptimizeResumeUseCase(llm_adapter, pdf_adapter, rag_service)


class ExperienceSchema(BaseModel):
    company: str
    position: str
    description: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False


class SkillSchema(BaseModel):
    name: str
    level: Optional[str] = None


class ResumeInputSchema(BaseModel):
    candidate_name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    professional_summary: Optional[str] = None
    experiences: list[ExperienceSchema] = Field(default_factory=list)
    skills: list[SkillSchema] = Field(default_factory=list)


class OptimizationRequestSchema(BaseModel):
    resume: ResumeInputSchema
    job_description: str = Field(..., min_length=50)
    template_id: str = "default"
    generate_pdf: bool = True


@router.post("/optimize", response_model=OptimizeResumeResponse)
async def optimize_resume(request: OptimizationRequestSchema):
    """Otimiza um currículo para uma vaga específica."""
    try:
        logger.info(f"Optimization requested for: {request.resume.candidate_name}")

        if not llm_adapter.is_configured():
            raise HTTPException(
                status_code=503,
                detail="AI service not configured. Set OPENAI_API_KEY.",
            )

        internal_request = OptimizeResumeRequest(
            resume=ResumeInput(
                candidate_name=request.resume.candidate_name,
                email=request.resume.email,
                phone=request.resume.phone,
                linkedin=request.resume.linkedin,
                professional_summary=request.resume.professional_summary,
                experiences=[
                    ExperienceInput(
                        company=exp.company,
                        position=exp.position,
                        description=exp.description,
                        start_date=exp.start_date,
                        end_date=exp.end_date,
                        current=exp.current,
                    )
                    for exp in request.resume.experiences
                ],
                skills=[
                    SkillInput(name=s.name, level=s.level)
                    for s in request.resume.skills
                ],
            ),
            job_description=request.job_description,
            template_id=request.template_id,
            generate_pdf=request.generate_pdf,
        )

        result = await optimize_use_case.execute(internal_request)

        logger.info(f"Optimization complete. ATS: {result.ats_score_before} -> {result.ats_score_after}")
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Optimization failed: {e}")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {e}")


@router.post("/analyze")
async def analyze_resume(request: ResumeInputSchema):
    """Analisa um currículo sem otimização."""
    try:
        if not llm_adapter.is_configured():
            raise HTTPException(status_code=503, detail="AI service not configured")

        response = await llm_adapter.complete(
            messages=[
                LLMMessage(
                    role="system",
                    content="""Analise o currículo e retorne JSON com:
- strengths: pontos fortes
- weaknesses: pontos a melhorar
- missing_sections: seções que faltam
- estimated_ats_score: score 0-100
- recommendations: recomendações""",
                ),
                LLMMessage(
                    role="user",
                    content=f"""Nome: {request.candidate_name}
Resumo: {request.professional_summary or "Não informado"}

Experiências:
{chr(10).join(f"- {exp.position} @ {exp.company}" for exp in request.experiences)}

Skills: {", ".join(s.name for s in request.skills)}""",
                ),
            ],
            temperature=0.3,
        )

        try:
            analysis = json.loads(response.content)
        except json.JSONDecodeError:
            analysis = {"raw_analysis": response.content}

        return {"analysis": analysis}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")
