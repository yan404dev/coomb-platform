from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Optional

from pydantic import BaseModel, Field

from domain.ports.outbound.llm_provider_port import LLMProviderPort, LLMMessage
from infrastructure.prompt_loader import PromptLoader

logger = logging.getLogger(__name__)


class CompatibilityResult(BaseModel):
    is_compatible: bool = True
    compatibility_score: int = Field(ge=0, le=100)
    candidate_area: str
    job_area: str
    has_experience: bool = True
    needs_creative_mode: bool = False
    allow_fictional: bool = False
    requires_career_pivot: bool = False
    pivot_strategy: Optional[str] = ""
    transferable_skills: list[str] = Field(default_factory=list)
    informal_activities: list[str] = Field(default_factory=list)
    reason: str


class CompatibilityChain:
    def __init__(self, llm: LLMProviderPort, prompt_loader: PromptLoader):
        self._llm = llm
        self._prompt = prompt_loader.load("compatibility")

    async def run(
        self, resume_content: str, job_description: str
    ) -> CompatibilityResult:
        user_prompt = self._prompt.format_user(
            resume_content=resume_content,
            job_description=job_description,
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
            if content.get("pivot_strategy") is None:
                content["pivot_strategy"] = ""
            return CompatibilityResult(**content)
        except Exception as e:
            logger.warning(f"Failed to parse compatibility: {e}")
            return CompatibilityResult(
                is_compatible=True,
                compatibility_score=50,
                candidate_area="Não identificado",
                job_area="Não identificado",
                reason="Não foi possível verificar compatibilidade",
                transferable_skills=[],
                informal_activities=[],
            )

    def _parse_json(self, content: str) -> dict:
        content = content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)

