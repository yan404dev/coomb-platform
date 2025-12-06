"""LLM Provider Port - Interface for Language Model providers."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import AsyncIterator, Optional


@dataclass(frozen=True)
class LLMMessage:
    """
    Mensagem para o LLM.
    
    Attributes:
        role: Papel da mensagem (system, user, assistant)
        content: Conteúdo da mensagem
    """
    
    role: str  # "system" | "user" | "assistant"
    content: str
    
    @classmethod
    def system(cls, content: str) -> "LLMMessage":
        """Factory para mensagem de sistema."""
        return cls(role="system", content=content)
    
    @classmethod
    def user(cls, content: str) -> "LLMMessage":
        """Factory para mensagem de usuário."""
        return cls(role="user", content=content)
    
    @classmethod
    def assistant(cls, content: str) -> "LLMMessage":
        """Factory para mensagem de assistente."""
        return cls(role="assistant", content=content)


@dataclass(frozen=True)
class LLMCompletionResult:
    """
    Resultado de uma completion do LLM.
    
    Attributes:
        content: Conteúdo gerado
        tokens_used: Total de tokens utilizados
        model: Modelo utilizado
        finish_reason: Razão do término
    """
    
    content: str
    tokens_used: int = 0
    model: str = ""
    finish_reason: str = "stop"


@dataclass
class LLMStreamChunk:
    """
    Chunk de streaming do LLM.
    
    Attributes:
        content: Conteúdo do chunk
        is_complete: Se é o último chunk
        tokens_used: Tokens (apenas no último chunk)
    """
    
    content: str
    is_complete: bool = False
    tokens_used: int = 0


class LLMProviderPort(ABC):
    """
    Interface para provedores de LLM.
    
    Esta é uma porta de saída (outbound port) que define como
    a aplicação se comunica com provedores de modelos de linguagem.
    
    Implementações:
        - OpenAIAdapter
        - PerplexityAdapter
        - AnthropicAdapter
        - OllamaAdapter
    
    Exemplo:
        ```python
        class OpenAIAdapter(LLMProviderPort):
            async def complete(self, messages, **kwargs):
                # Implementação específica OpenAI
                pass
        ```
    """
    
    @abstractmethod
    async def complete(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 4096,
        model: Optional[str] = None,
    ) -> LLMCompletionResult:
        """
        Gera uma resposta completa do LLM.
        
        Args:
            messages: Lista de mensagens do contexto
            temperature: Temperatura para geração (0-2)
            max_tokens: Máximo de tokens na resposta
            model: Modelo específico (opcional, usa default)
            
        Returns:
            LLMCompletionResult com o conteúdo gerado
            
        Raises:
            LLMProviderError: Se houver erro na comunicação
        """
        pass
    
    @abstractmethod
    async def complete_stream(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 4096,
        model: Optional[str] = None,
    ) -> AsyncIterator[LLMStreamChunk]:
        """
        Gera resposta em streaming (chunk por chunk).
        
        Args:
            messages: Lista de mensagens do contexto
            temperature: Temperatura para geração
            max_tokens: Máximo de tokens na resposta
            model: Modelo específico (opcional)
            
        Yields:
            LLMStreamChunk com cada parte da resposta
            
        Raises:
            LLMProviderError: Se houver erro na comunicação
        """
        pass
    
    @abstractmethod
    def is_configured(self) -> bool:
        """
        Verifica se o provider está configurado corretamente.
        
        Returns:
            True se as credenciais estão configuradas
        """
        pass
    
    @abstractmethod
    def get_model_name(self) -> str:
        """
        Retorna o nome do modelo em uso.
        
        Returns:
            Nome do modelo (ex: "gpt-4o", "claude-3-sonnet")
        """
        pass

