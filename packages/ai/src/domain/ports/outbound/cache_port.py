"""Cache Port - Interface for caching."""

from abc import ABC, abstractmethod
from typing import Any, Optional


class CachePort(ABC):
    """
    Interface para cache.
    
    Implementações:
        - RedisAdapter
        - MemoryAdapter (para testes)
    
    Exemplo:
        ```python
        class RedisAdapter(CachePort):
            async def get(self, key):
                value = await self.client.get(key)
                return json.loads(value) if value else None
        ```
    """
    
    @abstractmethod
    async def get(self, key: str) -> Optional[Any]:
        """
        Obtém valor do cache.
        
        Args:
            key: Chave do cache
            
        Returns:
            Valor armazenado ou None se não existir
        """
        pass
    
    @abstractmethod
    async def set(
        self,
        key: str,
        value: Any,
        ttl_seconds: int = 3600,
    ) -> bool:
        """
        Armazena valor no cache.
        
        Args:
            key: Chave do cache
            value: Valor a armazenar
            ttl_seconds: Tempo de vida em segundos
            
        Returns:
            True se armazenado com sucesso
        """
        pass
    
    @abstractmethod
    async def delete(self, key: str) -> bool:
        """
        Remove valor do cache.
        
        Args:
            key: Chave do cache
            
        Returns:
            True se removido
        """
        pass
    
    @abstractmethod
    async def exists(self, key: str) -> bool:
        """
        Verifica se chave existe no cache.
        
        Args:
            key: Chave do cache
            
        Returns:
            True se existe
        """
        pass
    
    @abstractmethod
    async def clear_pattern(self, pattern: str) -> int:
        """
        Remove todas as chaves que correspondem ao padrão.
        
        Args:
            pattern: Padrão de chaves (ex: "user:*")
            
        Returns:
            Número de chaves removidas
        """
        pass
    
    @abstractmethod
    async def is_healthy(self) -> bool:
        """
        Verifica se o cache está disponível.
        
        Returns:
            True se operacional
        """
        pass

