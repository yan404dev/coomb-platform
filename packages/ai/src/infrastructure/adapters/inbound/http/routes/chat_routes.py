import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from domain.ports.outbound.llm_provider_port import LLMMessage
from infrastructure.adapters.outbound.llm.openai_adapter import OpenAIAdapter
from infrastructure.adapters.outbound.vector_store.qdrant_adapter import QdrantAdapter
from infrastructure.adapters.outbound.pdf.weasyprint_adapter import WeasyPrintAdapter
from application.services.embedding_service import EmbeddingService
from application.services.rag_service import RAGService
from application.services.chat_context_service import ChatContextService
from application.services.resume_optimizer_chat_service import ResumeOptimizerChatService
from infrastructure.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])

settings = get_settings()
llm_adapter = OpenAIAdapter()
pdf_adapter = WeasyPrintAdapter()
chat_context_service = ChatContextService()
optimizer_service = ResumeOptimizerChatService(llm_adapter, pdf_adapter)

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
    pdf_url: Optional[str] = None


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
        messages_dict = [{"role": m.role, "content": m.content} for m in request.messages]
        context = chat_context_service.analyze_context(messages_dict)

        if context.is_optimization_request:
            logger.info("Detected optimization request - generating optimized resume")
            result = await optimizer_service.process_optimization(context, messages_dict)
            return ChatCompletionResponse(
                content=result.content,
                model=result.model,
                tokens_used=result.tokens_used,
                pdf_url=result.pdf_url,
            )

        llm_messages = chat_context_service.build_messages_with_context(
            messages_dict, context
        )

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
            messages_dict = [{"role": m.role, "content": m.content} for m in request.messages]
            context = chat_context_service.analyze_context(messages_dict)
            llm_messages = chat_context_service.build_messages_with_context(
                messages_dict, context
            )

            if context.is_optimization_request:
                logger.info("Detected optimization request - using optimizer prompt")

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

