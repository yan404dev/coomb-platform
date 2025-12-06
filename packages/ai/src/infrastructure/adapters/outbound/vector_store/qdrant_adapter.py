from __future__ import annotations

import logging
from typing import Optional

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from domain.ports.outbound.vector_store_port import (
    VectorStorePort,
    VectorDocument,
    VectorSearchResult,
)
from infrastructure.config import get_settings

logger = logging.getLogger(__name__)


class QdrantAdapter(VectorStorePort):
    def __init__(self, embedding_dimension: int = 1536):
        settings = get_settings()
        self._client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
        )
        self._collection_name = settings.qdrant_collection_name
        self._dimension = embedding_dimension
        self._initialized = False

    async def _ensure_collection(self) -> None:
        if self._initialized:
            return

        if not await self.collection_exists(self._collection_name):
            await self.create_collection(self._collection_name, self._dimension)

        self._initialized = True

    async def add_documents(
        self,
        documents: list[VectorDocument],
        collection_name: str | None = None,
    ) -> list[str]:
        collection = collection_name or self._collection_name
        await self._ensure_collection()

        if not documents:
            return []

        points = []
        for doc in documents:
            if not doc.embedding:
                raise ValueError(f"Document {doc.id} missing embedding")

            points.append(
                PointStruct(
                    id=doc.id,
                    vector=doc.embedding,
                    payload={
                        "content": doc.content,
                        **doc.metadata,
                    },
                )
            )

        try:
            self._client.upsert(
                collection_name=collection,
                points=points,
            )
            logger.info(f"Added {len(documents)} documents to {collection}")
            return [doc.id for doc in documents]
        except Exception as e:
            logger.error(f"Error adding documents: {e}")
            raise

    async def search(
        self,
        query: str,
        collection_name: str | None = None,
        limit: int = 10,
        filter_metadata: Optional[dict] = None,
        query_vector: Optional[list[float]] = None,
    ) -> list[VectorSearchResult]:
        collection = collection_name or self._collection_name

        if not query_vector:
            raise ValueError(
                "query_vector is required. Use EmbeddingService to generate embeddings."
            )

        query_filter = None
        if filter_metadata:
            conditions = []
            for key, value in filter_metadata.items():
                conditions.append(
                    FieldCondition(key=key, match=MatchValue(value=value))
                )
            if conditions:
                query_filter = Filter(must=conditions)

        try:
            results = self._client.search(
                collection_name=collection,
                query_vector=query_vector,
                limit=limit,
                query_filter=query_filter,
            )

            search_results = []
            for result in results:
                doc = VectorDocument(
                    id=str(result.id),
                    content=result.payload.get("content", ""),
                    metadata={
                        k: v
                        for k, v in result.payload.items()
                        if k != "content"
                    },
                    embedding=None,
                )

                search_results.append(
                    VectorSearchResult(
                        document=doc,
                        score=result.score,
                        distance=1.0 - result.score,
                    )
                )

            return search_results
        except Exception as e:
            logger.error(f"Error searching: {e}")
            raise

    async def delete_documents(
        self,
        document_ids: list[str],
        collection_name: str | None = None,
    ) -> int:
        collection = collection_name or self._collection_name

        try:
            self._client.delete(
                collection_name=collection,
                points_selector=document_ids,
            )
            logger.info(f"Deleted {len(document_ids)} documents from {collection}")
            return len(document_ids)
        except Exception as e:
            logger.error(f"Error deleting documents: {e}")
            raise

    async def create_collection(
        self,
        collection_name: str,
        dimension: int = 1536,
    ) -> bool:
        try:
            self._client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=dimension,
                    distance=Distance.COSINE,
                ),
            )
            logger.info(f"Created collection: {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            raise

    async def collection_exists(self, collection_name: str) -> bool:
        try:
            collections = self._client.get_collections()
            return any(
                col.name == collection_name for col in collections.collections
            )
        except Exception as e:
            logger.error(f"Error checking collection: {e}")
            return False

    async def is_healthy(self) -> bool:
        try:
            self._client.get_collections()
            return True
        except Exception:
            return False

