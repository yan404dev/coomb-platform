from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional, Union

from domain.chains import (
    CompatibilityChain, 
    OptimizationChain, 
    CreativeBuilderChain,
    PDFChain,
)
from domain.chains.compatibility_chain import CompatibilityResult
from domain.chains.optimization_chain import OptimizationResult, OptimizedResume
from domain.chains.creative_builder_chain import CreativeResult

logger = logging.getLogger(__name__)


@dataclass
class PipelineResult:
    success: bool
    content: str
    pdf_url: Optional[str] = None
    compatibility: Optional[CompatibilityResult] = None
    optimization: Optional[Union[OptimizationResult, CreativeResult]] = None
    mode: str = "standard"


class ResumePipeline:
    def __init__(
        self,
        compatibility_chain: CompatibilityChain,
        optimization_chain: OptimizationChain,
        creative_chain: CreativeBuilderChain,
        pdf_chain: PDFChain,
    ):
        self._compatibility = compatibility_chain
        self._optimization = optimization_chain
        self._creative = creative_chain
        self._pdf = pdf_chain

    async def run(
        self, resume_content: str, job_description: str
    ) -> PipelineResult:
        compatibility = await self._compatibility.run(resume_content, job_description)

        # Log detalhado da análise de compatibilidade
        logger.info("=" * 60)
        logger.info("ANÁLISE DE COMPATIBILIDADE")
        logger.info("=" * 60)
        logger.info(f"Área do Candidato: {compatibility.candidate_area}")
        logger.info(f"Área da Vaga: {compatibility.job_area}")
        logger.info(f"Score de Compatibilidade: {compatibility.compatibility_score}")
        logger.info(f"Requer Transição de Carreira: {compatibility.requires_career_pivot}")
        if compatibility.requires_career_pivot:
            logger.info(f"Estratégia de Pivot: {compatibility.pivot_strategy}")
            logger.info(f"Habilidades Transferíveis: {compatibility.transferable_skills}")
        logger.info(f"Modo Criativo: {compatibility.needs_creative_mode}")
        logger.info(f"Razão: {compatibility.reason}")
        logger.info("=" * 60)

        try:
            if compatibility.needs_creative_mode:
                return await self._run_creative_mode(
                    resume_content, job_description, compatibility
                )
            else:
                return await self._run_standard_mode(
                    resume_content, job_description, compatibility
                )
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            return PipelineResult(
                success=False,
                content="Ocorreu um erro ao otimizar o currículo. Por favor, tente novamente.",
                compatibility=compatibility,
            )

    async def _run_standard_mode(
        self,
        resume_content: str,
        job_description: str,
        compatibility: CompatibilityResult,
    ) -> PipelineResult:
        pivot_strategy = None
        transferable_skills = None

        if compatibility.requires_career_pivot:
            logger.info(f"Career pivot detected: {compatibility.candidate_area} → {compatibility.job_area}")
            logger.info(f"Pivot strategy: {compatibility.pivot_strategy}")
            logger.info(f"Transferable skills: {compatibility.transferable_skills}")
            pivot_strategy = compatibility.pivot_strategy or ""
            transferable_skills = compatibility.transferable_skills
        else:
            logger.info(f"No career pivot needed. Candidate area: {compatibility.candidate_area}, Job area: {compatibility.job_area}, Score: {compatibility.compatibility_score}")

        optimization = await self._optimization.run(
            resume_content,
            job_description,
            pivot_strategy=pivot_strategy,
            transferable_skills=transferable_skills,
        )
        pdf_url = await self._pdf.run(optimization.optimized_resume, job_description)

        mode = "pivot" if compatibility.requires_career_pivot else "standard"

        return PipelineResult(
            success=True,
            content=self._format_success(optimization, pdf_url, compatibility),
            pdf_url=pdf_url,
            compatibility=compatibility,
            optimization=optimization,
            mode=mode,
        )

    async def _run_creative_mode(
        self,
        candidate_info: str,
        job_description: str,
        compatibility: CompatibilityResult,
    ) -> PipelineResult:
        logger.info("Creative mode activated - building resume from scratch")

        creative_result = await self._creative.run(
            candidate_info,
            job_description,
            allow_fictional=compatibility.allow_fictional,
        )

        resume_for_pdf = self._convert_creative_to_optimized(creative_result)
        pdf_url = await self._pdf.run(resume_for_pdf, job_description)

        return PipelineResult(
            success=True,
            content=self._format_creative_success(creative_result, pdf_url, compatibility),
            pdf_url=pdf_url,
            compatibility=compatibility,
            optimization=creative_result,
            mode="creative",
        )

    def _convert_creative_to_optimized(self, creative: CreativeResult) -> OptimizedResume:
        from domain.chains.optimization_chain import OptimizedResume, OptimizedExperience
        
        return OptimizedResume(
            candidate_name=creative.optimized_resume.candidate_name,
            email=creative.optimized_resume.email,
            phone=creative.optimized_resume.phone,
            linkedin=creative.optimized_resume.linkedin,
            professional_summary=creative.optimized_resume.professional_summary,
            experiences=[
                OptimizedExperience(
                    company=exp.company,
                    position=exp.position,
                    description=exp.description,
                    achievements=exp.achievements,
                    start_date=exp.start_date,
                    end_date=exp.end_date,
                    current=exp.current,
                    work_mode=exp.work_mode,
                    country=exp.country,
                )
                for exp in creative.optimized_resume.experiences
            ],
            skills=creative.optimized_resume.skills,
            languages=creative.optimized_resume.languages,
            education=creative.optimized_resume.education,
            certifications=creative.optimized_resume.courses,
        )

    def _format_success(
        self, opt: OptimizationResult, pdf_url: Optional[str], compat: CompatibilityResult
    ) -> str:
        resume = opt.optimized_resume
        improvements = "\n".join(f"{i+1}. {imp}" for i, imp in enumerate(opt.improvements))
        keywords = ", ".join(opt.keywords_matched)

        header = "## Currículo Otimizado para a Vaga"
        pivot_info = ""

        if compat.requires_career_pivot:
            header = "## Currículo Adaptado para Transição de Carreira"
            skills_text = ", ".join(compat.transferable_skills) if compat.transferable_skills else "Diversas"
            pivot_info = f"""
### Transição de Carreira Aplicada
- **De:** {compat.candidate_area}
- **Para:** {compat.job_area}
- **Habilidades Destacadas:** {skills_text}

"""

        text = f"""{header}

**Score ATS estimado: {opt.ats_score}/100**
{pivot_info}
### Melhorias Realizadas
{improvements}

### Keywords da Vaga Incorporadas
{keywords}

### Resumo Profissional Otimizado
{resume.professional_summary}
"""

        if pdf_url:
            text += f"""
---

**[Baixar Currículo Otimizado (PDF)]({pdf_url})**
"""

        return text

    def _format_creative_success(
        self, result: CreativeResult, pdf_url: Optional[str], compat: CompatibilityResult
    ) -> str:
        resume = result.optimized_resume
        improvements = "\n".join(f"{i+1}. {imp}" for i, imp in enumerate(result.improvements))

        text = f"""## Currículo Construído do Zero

**Score ATS estimado: {result.ats_score}/100**

### Modo Criativo Ativado
Detectamos que você tem pouca ou nenhuma experiência formal. 
Transformamos suas atividades em experiências profissionais!

### O que foi transformado
{improvements}

### Resumo Profissional
{resume.professional_summary}
"""

        if result.warnings:
            warnings = "\n".join(f"- {w}" for w in result.warnings)
            text += f"""
### Avisos Importantes
{warnings}
"""

        if result.tips_for_interview:
            tips = "\n".join(f"{i+1}. {t}" for i, t in enumerate(result.tips_for_interview))
            text += f"""
### Dicas para a Entrevista
{tips}
"""

        if pdf_url:
            text += f"""
---

**[Baixar Currículo (PDF)]({pdf_url})**
"""

        return text

