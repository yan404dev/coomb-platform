from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from domain.ports.outbound.llm_provider_port import LLMProviderPort
from domain.ports.outbound.pdf_renderer_port import PDFRendererPort
from domain.chains import CompatibilityChain, OptimizationChain, CreativeBuilderChain, PDFChain
from application.pipelines import ResumePipeline
from application.services.chat_context_service import ChatContext
from application.services.language_service import LanguageService
from infrastructure.prompt_loader import PromptLoader

logger = logging.getLogger(__name__)


@dataclass
class ChatOptimizationResult:
    content: str
    pdf_url: Optional[str] = None
    model: str = ""
    tokens_used: int = 0


class ResumeOptimizerChatService:
    def __init__(
        self,
        llm_provider: LLMProviderPort,
        pdf_renderer: Optional[PDFRendererPort] = None,
    ):
        self._llm = llm_provider
        self._pdf = pdf_renderer
        self._prompt_loader = PromptLoader()
        self._pipeline = self._build_pipeline()

    def _build_pipeline(self) -> ResumePipeline:
        language_service = LanguageService(self._llm)
        return ResumePipeline(
            compatibility_chain=CompatibilityChain(self._llm, self._prompt_loader),
            optimization_chain=OptimizationChain(self._llm, self._prompt_loader),
            creative_chain=CreativeBuilderChain(self._llm, self._prompt_loader),
            pdf_chain=PDFChain(self._pdf, language_service),
        )

    async def process_optimization(
        self,
        context: ChatContext,
        messages: list[dict],
    ) -> ChatOptimizationResult:
        resume_content = self._extract_resume_from_messages(messages)
        job_description = context.job_description or ""

        if not resume_content:
            return ChatOptimizationResult(
                content="Não encontrei o conteúdo do seu currículo. Por favor, envie novamente.",
                model=self._llm.get_model_name(),
            )

        result = await self._pipeline.run(resume_content, job_description)

        return ChatOptimizationResult(
            content=result.content,
            pdf_url=result.pdf_url,
            model=self._llm.get_model_name(),
        )

    def _extract_resume_from_messages(self, messages: list[dict]) -> Optional[str]:
        for msg in messages:
            if msg.get("role") != "user":
                continue
            content = msg.get("content", "")
            if "=== CONTEÚDO DO CURRÍCULO ===" in content:
                parts = content.split("=== CONTEÚDO DO CURRÍCULO ===")
                if len(parts) > 1:
                    return parts[1].strip()
        return None
