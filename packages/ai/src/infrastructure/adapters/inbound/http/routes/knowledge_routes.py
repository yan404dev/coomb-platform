import logging
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from infrastructure.adapters.outbound.vector_store.qdrant_adapter import QdrantAdapter
from application.services.embedding_service import EmbeddingService
from application.services.rag_service import RAGService
from infrastructure.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/knowledge", tags=["Knowledge"])

settings = get_settings()
vector_store = QdrantAdapter()
embedding_service = EmbeddingService()
rag_service = RAGService(vector_store, embedding_service)


class AddKnowledgeRequest(BaseModel):
    content: str = Field(..., min_length=10)
    metadata: dict = Field(default_factory=dict)
    collection_name: Optional[str] = None


class AddKnowledgeResponse(BaseModel):
    document_id: str
    message: str


class SearchKnowledgeRequest(BaseModel):
    query: str = Field(..., min_length=3)
    collection_name: Optional[str] = None
    limit: int = Field(default=5, ge=1, le=20)
    min_score: float = Field(default=0.7, ge=0, le=1)


class KnowledgeDocument(BaseModel):
    id: str
    content: str
    metadata: dict
    score: float


class SearchKnowledgeResponse(BaseModel):
    results: list[KnowledgeDocument]
    total: int


@router.post("/add", response_model=AddKnowledgeResponse)
async def add_knowledge(request: AddKnowledgeRequest):
    if not embedding_service.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Embedding service not configured",
        )

    try:
        metadata = request.metadata.copy()
        if "id" not in metadata:
            metadata["id"] = str(uuid4())

        doc_id = await rag_service.add_knowledge(
            content=request.content,
            metadata=metadata,
            collection_name=request.collection_name,
        )

        return AddKnowledgeResponse(
            document_id=doc_id,
            message="Knowledge added successfully",
        )
    except Exception as e:
        logger.error(f"Error adding knowledge: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add knowledge: {str(e)}",
        )


@router.post("/search", response_model=SearchKnowledgeResponse)
async def search_knowledge(request: SearchKnowledgeRequest):
    if not embedding_service.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Embedding service not configured",
        )

    try:
        results = await rag_service.retrieve_context(
            query=request.query,
            collection_name=request.collection_name,
            limit=request.limit,
            min_score=request.min_score,
        )

        knowledge_docs = [
            KnowledgeDocument(
                id=r.document.id,
                content=r.document.content,
                metadata=r.document.metadata,
                score=r.score,
            )
            for r in results
        ]

        return SearchKnowledgeResponse(
            results=knowledge_docs,
            total=len(knowledge_docs),
        )
    except Exception as e:
        logger.error(f"Error searching knowledge: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search knowledge: {str(e)}",
        )


@router.delete("/documents/{document_id}")
async def delete_knowledge(
    document_id: str,
    collection_name: Optional[str] = None,
):
    try:
        deleted_count = await vector_store.delete_documents(
            document_ids=[document_id],
            collection_name=collection_name,
        )

        if deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found",
            )

        return {"message": "Document deleted successfully", "deleted": deleted_count}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting knowledge: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete knowledge: {str(e)}",
        )

