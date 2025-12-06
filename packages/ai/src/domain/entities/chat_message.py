"""Chat Message and Conversation entities."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4


class MessageRole(str, Enum):
    """Papel da mensagem na conversa."""
    
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageType(str, Enum):
    """Tipo de conteúdo da mensagem."""
    
    TEXT = "text"
    PDF_ATTACHMENT = "pdf_attachment"
    JOB_DESCRIPTION = "job_description"
    RESUME_ANALYSIS = "resume_analysis"
    OPTIMIZATION_RESULT = "optimization_result"


@dataclass
class ChatMessage:
    """
    Representa uma mensagem no chat.
    
    Attributes:
        role: Papel (user, assistant, system)
        content: Conteúdo textual
        message_type: Tipo de mensagem
        metadata: Dados adicionais (PDF URL, etc)
    """
    
    role: MessageRole
    content: str
    id: UUID = field(default_factory=uuid4)
    message_type: MessageType = MessageType.TEXT
    metadata: dict = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    
    @classmethod
    def user_message(cls, content: str, **metadata) -> "ChatMessage":
        """Factory para mensagem de usuário."""
        return cls(
            role=MessageRole.USER,
            content=content,
            message_type=MessageType.TEXT,
            metadata=metadata,
        )
    
    @classmethod
    def assistant_message(cls, content: str, **metadata) -> "ChatMessage":
        """Factory para mensagem do assistente."""
        return cls(
            role=MessageRole.ASSISTANT,
            content=content,
            message_type=MessageType.TEXT,
            metadata=metadata,
        )
    
    @classmethod
    def system_message(cls, content: str) -> "ChatMessage":
        """Factory para mensagem de sistema."""
        return cls(
            role=MessageRole.SYSTEM,
            content=content,
            message_type=MessageType.TEXT,
        )
    
    def has_attachment(self) -> bool:
        """Verifica se tem anexo."""
        return self.message_type == MessageType.PDF_ATTACHMENT
    
    def get_attachment_url(self) -> Optional[str]:
        """Retorna URL do anexo, se houver."""
        return self.metadata.get("attachment_url")


@dataclass
class Conversation:
    """
    Representa uma conversa completa.
    
    Attributes:
        user_id: ID do usuário
        messages: Lista de mensagens
        context: Contexto adicional (currículo, vaga, etc)
    """
    
    user_id: str
    id: UUID = field(default_factory=uuid4)
    messages: list[ChatMessage] = field(default_factory=list)
    context: dict = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def add_message(self, message: ChatMessage) -> None:
        """Adiciona mensagem à conversa."""
        self.messages.append(message)
        self.updated_at = datetime.now()
    
    def get_last_n_messages(self, n: int = 20) -> list[ChatMessage]:
        """Retorna as últimas N mensagens."""
        return self.messages[-n:]
    
    def get_messages_for_llm(self, max_messages: int = 20) -> list[dict]:
        """Formata mensagens para envio ao LLM."""
        messages = self.get_last_n_messages(max_messages)
        return [
            {"role": msg.role.value, "content": msg.content}
            for msg in messages
        ]
    
    def has_resume_context(self) -> bool:
        """Verifica se há currículo no contexto."""
        return "resume" in self.context
    
    def has_job_description(self) -> bool:
        """Verifica se há descrição de vaga no contexto."""
        return "job_description" in self.context
    
    def get_message_count(self) -> int:
        """Retorna total de mensagens."""
        return len(self.messages)

