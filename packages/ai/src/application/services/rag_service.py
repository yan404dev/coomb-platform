from __future__ import annotations

import logging
from typing import Optional

from domain.ports.outbound.vector_store_port import VectorDocument, VectorSearchResult
from domain.ports.outbound.vector_store_port import VectorStorePort
from application.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)


class RAGService:
    def __init__(
        self,
        vector_store: VectorStorePort,
        embedding_service: EmbeddingService,
    ):
        self._vector_store = vector_store
        self._embedding_service = embedding_service

    async def retrieve_context(
        self,
        query: str,
        collection_name: str | None = None,
        limit: int = 5,
        min_score: float = 0.7,
        filter_metadata: Optional[dict] = None,
    ) -> list[VectorSearchResult]:
        try:
            query_embedding = await self._embedding_service.embed_text(query)

            results = await self._vector_store.search(
                query=query,
                collection_name=collection_name,
                limit=limit,
                filter_metadata=filter_metadata,
                query_vector=query_embedding,
            )

            filtered_results = [
                r for r in results if r.score >= min_score
            ]

            logger.info(
                f"Retrieved {len(filtered_results)} relevant documents for query"
            )
            return filtered_results
        except Exception as e:
            logger.error(f"Error retrieving context: {e}")
            return []

    async def enrich_prompt(
        self,
        user_query: str,
        collection_name: str | None = None,
        limit: int = 5,
    ) -> str:
        context_results = await self.retrieve_context(
            query=user_query,
            collection_name=collection_name,
            limit=limit,
        )

        if not context_results:
            return user_query

        context_text = "\n\n".join(
            [
                f"[Contexto {i+1}]\n{r.document.content}"
                for i, r in enumerate(context_results)
            ]
        )

        enriched_prompt = f"""Com base no seguinte contexto de mercado e conhecimento:

{context_text}

---

Agora responda à seguinte pergunta do usuário:

{user_query}

Use o contexto acima para fornecer respostas mais precisas e atualizadas."""

        return enriched_prompt

    async def add_knowledge(
        self,
        content: str,
        metadata: dict,
        collection_name: str | None = None,
    ) -> str:
        try:
            embedding = await self._embedding_service.embed_text(content)

            doc = VectorDocument(
                id=metadata.get("id", f"doc_{hash(content)}"),
                content=content,
                metadata=metadata,
                embedding=embedding,
            )

            doc_ids = await self._vector_store.add_documents(
                documents=[doc],
                collection_name=collection_name,
            )

            return doc_ids[0] if doc_ids else ""
        except Exception as e:
            logger.error(f"Error adding knowledge: {e}")
            raise

