from __future__ import annotations

import json
import logging
from typing import Optional

from pydantic import BaseModel, Field

from domain.ports.outbound.llm_provider_port import LLMProviderPort, LLMMessage
from infrastructure.prompt_loader import PromptLoader

logger = logging.getLogger(__name__)


class CreativeExperience(BaseModel):
    company: str
    position: str
    description: str
    achievements: list[str] = Field(default_factory=list)
    start_date: str = ""
    end_date: Optional[str] = None
    current: bool = False
    is_informal: bool = False
    work_mode: Optional[str] = None
    country: Optional[str] = None


class CreativeResume(BaseModel):
    candidate_name: str
    email: str = ""
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    professional_summary: str
    experiences: list[CreativeExperience] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    education: list[dict] = Field(default_factory=list)
    courses: list[str] = Field(default_factory=list)
    languages: list[dict] = Field(default_factory=list)


class CreativeResult(BaseModel):
    optimized_resume: CreativeResume
    improvements: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    tips_for_interview: list[str] = Field(default_factory=list)
    ats_score: int = 0


class CreativeBuilderChain:
    def __init__(self, llm: LLMProviderPort, prompt_loader: PromptLoader):
        self._llm = llm
        self._prompt = prompt_loader.load("creative_builder")

    async def run(
        self,
        candidate_info: str,
        job_description: str,
        allow_fictional: bool = False,
    ) -> CreativeResult:
        special_instructions = ""
        if allow_fictional:
            special_instructions = """
## MODO CRIATIVO ATIVADO
O usuário autorizou a criação de experiências fictícias se necessário.
- Crie experiências PLAUSÍVEIS
- Adicione AVISOS sobre os riscos
- Inclua DICAS de como defender na entrevista
"""

        user_prompt = self._prompt.format_user(
            resume_content=candidate_info,
            job_description=job_description,
            special_instructions=special_instructions,
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
            return CreativeResult(**content)
        except Exception as e:
            logger.error(f"Failed to parse creative result: {e}")
            raise ValueError("Falha ao processar resposta da IA")

    def _parse_json(self, content: str) -> dict:
        content = content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)

