from __future__ import annotations

import logging
import re
from typing import Literal

from domain.ports.outbound.llm_provider_port import LLMProviderPort, LLMMessage

logger = logging.getLogger(__name__)

Language = Literal["pt", "en"]


class LanguageService:
    def __init__(self, llm: LLMProviderPort):
        self._llm = llm

    def detect_language(self, text: str) -> Language:
        pt_indicators = [
            r"\b(vaga|empresa|desenvolvedor|analista|gerente|coordenador|assistente)\b",
            r"\b(experiência|experiências|habilidades|competências)\b",
            r"\b(brasil|brasileiro|português)\b",
            r"\b(anos|mês|meses)\b",
            r"\b(graduação|ensino|superior)\b",
        ]

        en_indicators = [
            r"\b(job|position|developer|analyst|manager|coordinator|assistant)\b",
            r"\b(experience|experiences|skills|competencies)\b",
            r"\b(usa|united states|english|years|months)\b",
            r"\b(degree|education|bachelor|master)\b",
        ]

        text_lower = text.lower()
        pt_score = sum(1 for pattern in pt_indicators if re.search(pattern, text_lower, re.IGNORECASE))
        en_score = sum(1 for pattern in en_indicators if re.search(pattern, text_lower, re.IGNORECASE))

        if pt_score > en_score:
            return "pt"
        elif en_score > pt_score:
            return "en"
        else:
            return "pt"

    async def translate_resume_content(
        self, resume_data: dict, target_language: Language
    ) -> dict:
        if target_language == "pt":
            return resume_data

        logger.info(f"Translating resume content to {target_language}")

        translated = resume_data.copy()

        if "professional_summary" in translated:
            translated["professional_summary"] = await self._translate_text(
                translated["professional_summary"], target_language
            )

        if "experiences" in translated:
            for exp in translated["experiences"]:
                if "position" in exp:
                    exp["position"] = await self._translate_text(exp["position"], target_language)
                if "description" in exp:
                    exp["description"] = await self._translate_text(exp["description"], target_language)
                if "achievements" in exp:
                    exp["achievements"] = [
                        await self._translate_text(ach, target_language) for ach in exp["achievements"]
                    ]

        if "education" in translated:
            for edu in translated["education"]:
                if isinstance(edu, dict):
                    if "degree" in edu:
                        edu["degree"] = await self._translate_text(edu["degree"], target_language)
                    if "field" in edu:
                        edu["field"] = await self._translate_text(edu["field"], target_language)

        return translated

    async def _translate_text(self, text: str, target_language: Language) -> str:
        if not text or not text.strip():
            return text

        prompt = f"""Translate the following text to {target_language.upper()}.
Maintain professional tone and technical terms when appropriate.
Return ONLY the translated text, nothing else.

Text to translate:
{text}"""

        try:
            result = await self._llm.complete(
                messages=[LLMMessage(role="user", content=prompt)],
                temperature=0.2,
                max_tokens=1000,
            )
            return result.content.strip()
        except Exception as e:
            logger.warning(f"Translation failed: {e}, returning original")
            return text

