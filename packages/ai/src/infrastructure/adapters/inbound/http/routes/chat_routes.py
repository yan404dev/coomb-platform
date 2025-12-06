import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from domain.ports.outbound.llm_provider_port import LLMMessage
from infrastructure.adapters.outbound.llm.openai_adapter import OpenAIAdapter
from infrastructure.adapters.outbound.vector_store.qdrant_adapter import QdrantAdapter
from application.services.embedding_service import EmbeddingService
from application.services.rag_service import RAGService
from infrastructure.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])

settings = get_settings()
llm_adapter = OpenAIAdapter()

vector_store = QdrantAdapter()
embedding_service = EmbeddingService()
rag_service = RAGService(vector_store, embedding_service)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_items=1)
    user_id: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=2000, ge=1, le=4000)


class ChatCompletionResponse(BaseModel):
    content: str
    model: str
    tokens_used: int


class ChatStreamChunk(BaseModel):
    content: str
    is_complete: bool


@router.post("/completion", response_model=ChatCompletionResponse)
async def chat_completion(request: ChatCompletionRequest):
    if not llm_adapter.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service not configured",
        )

    try:
        llm_messages = [
            LLMMessage(role=msg.role, content=msg.content) for msg in request.messages
        ]

        last_user_message = None
        for msg in reversed(request.messages):
            if msg.role == "user":
                last_user_message = msg.content
                break

        if last_user_message and rag_service._embedding_service.is_configured():
            try:
                enriched_query = await rag_service.enrich_prompt(
                    user_query=last_user_message,
                    limit=3,
                )
                if enriched_query != last_user_message:
                    llm_messages[-1] = LLMMessage(
                        role="user", content=enriched_query
                    )
            except Exception as e:
                logger.warning(f"RAG enrichment failed, using original query: {e}")

        result = await llm_adapter.complete(
            llm_messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        return ChatCompletionResponse(
            content=result.content,
            model=result.model,
            tokens_used=result.tokens_used,
        )
    except Exception as e:
        logger.error(f"Chat completion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat completion failed: {str(e)}",
        )


@router.post("/completion/stream")
async def chat_completion_stream(request: ChatCompletionRequest):
    if not llm_adapter.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service not configured",
        )

    from fastapi.responses import StreamingResponse

    async def generate_stream():
        try:
            llm_messages = [
                LLMMessage(role=msg.role, content=msg.content)
                for msg in request.messages
            ]

            async for chunk in llm_adapter.complete_stream(
                llm_messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
            ):
                yield f"data: {chunk.content}\n\n"
                if chunk.is_complete:
                    yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Stream failed: {e}")
            yield f"data: Erro ao processar: {str(e)}\n\n"

    return StreamingResponse(generate_stream(), media_type="text/event-stream")

