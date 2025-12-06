"""OpenAI adapter usando LangChain."""

from __future__ import annotations

import logging
from typing import AsyncIterator

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from pydantic import BaseModel

from domain.ports.outbound.llm_provider_port import (
    LLMProviderPort,
    LLMMessage,
    LLMCompletionResult,
    LLMStreamChunk,
)
from infrastructure.config import get_settings

logger = logging.getLogger(__name__)


class OpenAIAdapter(LLMProviderPort):
    """OpenAI LLM adapter com LangChain para structured output."""

    def __init__(self, model: str | None = None, temperature: float = 0.7):
        settings = get_settings()
        self._api_key = settings.openai_api_key
        self._model = model or settings.openai_model or "gpt-4o"
        self._default_temperature = temperature

        self._llm = (
            ChatOpenAI(api_key=self._api_key, model=self._model, temperature=temperature)
            if self._api_key
            else None
        )

    async def complete(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int = 4096,
    ) -> LLMCompletionResult:
        if not self._llm:
            raise RuntimeError("OpenAI API key not configured")

        lc_messages = self._convert_messages(messages)
        llm = self._llm.bind(
            temperature=temperature or self._default_temperature,
            max_tokens=max_tokens,
        )

        response = await llm.ainvoke(lc_messages)

        tokens_used = 0
        if hasattr(response, "usage_metadata") and response.usage_metadata:
            tokens_used = response.usage_metadata.get("total_tokens", 0)

        return LLMCompletionResult(
            content=response.content,
            tokens_used=tokens_used,
            model=self._model,
        )

    async def complete_with_schema(
        self,
        messages: list[LLMMessage],
        output_schema: type[BaseModel],
        temperature: float = 0.3,
    ) -> BaseModel:
        if not self._llm:
            raise RuntimeError("OpenAI API key not configured")

        structured_llm = self._llm.with_structured_output(output_schema)
        lc_messages = self._convert_messages(messages)
        return await structured_llm.ainvoke(lc_messages)

    async def complete_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int = 4096,
    ) -> AsyncIterator[LLMStreamChunk]:
        if not self._llm:
            raise RuntimeError("OpenAI API key not configured")

        lc_messages = self._convert_messages(messages)
        llm = self._llm.bind(
            temperature=temperature or self._default_temperature,
            max_tokens=max_tokens,
        )

        async for chunk in llm.astream(lc_messages):
            if chunk.content:
                yield LLMStreamChunk(content=chunk.content, is_complete=False)

        yield LLMStreamChunk(content="", is_complete=True)

    def is_configured(self) -> bool:
        return bool(self._api_key)

    def _convert_messages(self, messages: list[LLMMessage]) -> list:
        result = []
        for msg in messages:
            if msg.role == "system":
                result.append(SystemMessage(content=msg.content))
            elif msg.role == "user":
                result.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                result.append(AIMessage(content=msg.content))
        return result
