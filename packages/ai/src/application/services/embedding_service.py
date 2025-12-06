from __future__ import annotations

import logging
from typing import Optional

from openai import AsyncOpenAI

from infrastructure.config import get_settings

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self):
        settings = get_settings()
        self._client = (
            AsyncOpenAI(api_key=settings.openai_api_key)
            if settings.openai_api_key
            else None
        )
        self._model = "text-embedding-3-small"
        self._dimension = 1536

    async def embed_text(self, text: str) -> list[float]:
        if not self._client:
            raise RuntimeError("OpenAI API key not configured")

        try:
            response = await self._client.embeddings.create(
                model=self._model,
                input=text,
                dimensions=self._dimension,
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise

    async def embed_batch(
        self, texts: list[str], batch_size: int = 100
    ) -> list[list[float]]:
        if not self._client:
            raise RuntimeError("OpenAI API key not configured")

        embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            try:
                response = await self._client.embeddings.create(
                    model=self._model,
                    input=batch,
                    dimensions=self._dimension,
                )
                embeddings.extend([item.embedding for item in response.data])
            except Exception as e:
                logger.error(f"Error generating batch embeddings: {e}")
                raise

        return embeddings

    def is_configured(self) -> bool:
        return self._client is not None

    @property
    def dimension(self) -> int:
        return self._dimension

