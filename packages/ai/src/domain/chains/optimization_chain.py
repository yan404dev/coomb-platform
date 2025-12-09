from __future__ import annotations

import json
import logging
from typing import Optional

from pydantic import BaseModel, Field

from domain.ports.outbound.llm_provider_port import LLMProviderPort, LLMMessage
from infrastructure.prompt_loader import PromptLoader

logger = logging.getLogger(__name__)


class OptimizedExperience(BaseModel):
    company: str
    position: str
    description: str
    achievements: list[str] = Field(default_factory=list)
    start_date: str = ""
    end_date: Optional[str] = None
    current: bool = False
    work_mode: Optional[str] = None
    country: Optional[str] = None


class OptimizedResume(BaseModel):
    candidate_name: str
    email: str = ""
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    professional_summary: str
    experiences: list[OptimizedExperience] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    languages: list[dict] = Field(default_factory=list)
    education: list[dict] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)


class OptimizationResult(BaseModel):
    optimized_resume: OptimizedResume
    improvements: list[str] = Field(default_factory=list)
    keywords_matched: list[str] = Field(default_factory=list)
    ats_score: int = 0


class OptimizationChain:
    def __init__(self, llm: LLMProviderPort, prompt_loader: PromptLoader):
        self._llm = llm
        self._prompt = prompt_loader.load("optimization")

    async def run(
        self,
        resume_content: str,
        job_description: str,
        pivot_strategy: Optional[str] = None,
        transferable_skills: Optional[list[str]] = None,
    ) -> OptimizationResult:
        pivot_instructions = ""
        if pivot_strategy:
            skills_text = ", ".join(transferable_skills or [])
            logger.info(f"Applying career pivot with strategy: {pivot_strategy[:100]}...")
            pivot_instructions = f"""
## ⚠️ TRANSIÇÃO DE CARREIRA DETECTADA ⚠️

Este é um caso de TRANSIÇÃO DE CARREIRA. O candidato vem de uma área COMPLETAMENTE DIFERENTE.

Estratégia: {pivot_strategy}

Habilidades transferíveis a destacar: {skills_text}

═══════════════════════════════════════════════════════════════
AÇÕES OBRIGATÓRIAS - SIGA À RISCA:
═══════════════════════════════════════════════════════════════

1. PROFESSIONAL SUMMARY (RESUMO PROFISSIONAL):
   ❌ NÃO mantenha NADA da área antiga no resumo!
   ✅ REESCREVA COMPLETAMENTE focando 100% na NOVA área
   ✅ Use keywords da NOVA área, não da antiga
   ✅ Destaque habilidades transferíveis (liderança, comunicação, gestão)

2. TÍTULOS DE CARGO:
   ✅ REFORMULE todos os títulos para a nova área
   ✅ Ex: "Desenvolvedor" → "Coordenador/Gestor"
   ✅ Ex: "Tech Lead" → "Líder de Equipe"

3. DESCRIÇÕES E ACHIEVEMENTS:
   ✅ REESCREVA com perspectiva da nova área
   ✅ Foque em soft skills e gestão
   ✅ Transforme tarefas técnicas em habilidades de gestão

4. SKILLS:
   ✅ REMOVA skills técnicas da área antiga
   ✅ ADICIONE skills relevantes para a nova área
   ✅ Priorize soft skills e gestão

═══════════════════════════════════════════════════════════════
CRÍTICO: O professional_summary DEVE ser TOTALMENTE NOVO!
═══════════════════════════════════════════════════════════════
"""

        user_prompt = self._prompt.format_user(
            resume_content=resume_content,
            job_description=job_description,
            pivot_instructions=pivot_instructions,
        )

        result = await self._llm.complete(
            messages=[
                LLMMessage(role="system", content=self._prompt.system),
                LLMMessage(role="user", content=user_prompt),
            ],
            temperature=self._prompt.temperature,
            max_tokens=self._prompt.max_tokens,
        )

        try:
            content = self._parse_json(result.content)
            return OptimizationResult(**content)
        except Exception as e:
            logger.error(f"Failed to parse optimization: {e}")
            raise ValueError("Falha ao processar resposta da IA")

    def _parse_json(self, content: str) -> dict:
        content = content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)

