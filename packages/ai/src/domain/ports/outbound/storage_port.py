"""Storage Port - Interface for file storage."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Optional


@dataclass
class StoredFile:
    """
    Arquivo armazenado.
    
    Attributes:
        key: Chave/path do arquivo
        url: URL pública para download
        size_bytes: Tamanho em bytes
        content_type: MIME type
        created_at: Data de criação
    """
    
    key: str
    url: str
    size_bytes: int
    content_type: str
    created_at: datetime


class StoragePort(ABC):
    """
    Interface para armazenamento de arquivos.
    
    Implementações:
        - LocalStorageAdapter
        - S3Adapter
        - MinioAdapter
    
    Exemplo:
        ```python
        class S3Adapter(StoragePort):
            async def upload(self, content, key, content_type):
                await self.client.put_object(
                    Bucket=self.bucket,
                    Key=key,
                    Body=content,
                    ContentType=content_type,
                )
                return StoredFile(
                    key=key,
                    url=f"https://{self.bucket}.s3.amazonaws.com/{key}",
                    ...
                )
        ```
    """
    
    @abstractmethod
    async def upload(
        self,
        content: bytes,
        key: str,
        content_type: str = "application/octet-stream",
    ) -> StoredFile:
        """
        Faz upload de um arquivo.
        
        Args:
            content: Conteúdo do arquivo em bytes
            key: Chave/path do arquivo
            content_type: MIME type do arquivo
            
        Returns:
            StoredFile com informações do arquivo
            
        Raises:
            StorageError: Se houver erro no upload
        """
        pass
    
    @abstractmethod
    async def download(self, key: str) -> bytes:
        """
        Faz download de um arquivo.
        
        Args:
            key: Chave/path do arquivo
            
        Returns:
            Conteúdo do arquivo em bytes
            
        Raises:
            FileNotFoundError: Se arquivo não existir
            StorageError: Se houver erro no download
        """
        pass
    
    @abstractmethod
    async def delete(self, key: str) -> bool:
        """
        Remove um arquivo.
        
        Args:
            key: Chave/path do arquivo
            
        Returns:
            True se removido com sucesso
        """
        pass
    
    @abstractmethod
    async def exists(self, key: str) -> bool:
        """
        Verifica se um arquivo existe.
        
        Args:
            key: Chave/path do arquivo
            
        Returns:
            True se existe
        """
        pass
    
    @abstractmethod
    async def get_url(self, key: str, expires_in: int = 3600) -> str:
        """
        Gera URL pública/presigned para o arquivo.
        
        Args:
            key: Chave/path do arquivo
            expires_in: Tempo de expiração em segundos
            
        Returns:
            URL para acesso ao arquivo
        """
        pass
    
    @abstractmethod
    async def list_files(
        self,
        prefix: str = "",
        limit: int = 100,
    ) -> list[StoredFile]:
        """
        Lista arquivos com determinado prefixo.
        
        Args:
            prefix: Prefixo para filtrar
            limit: Número máximo de resultados
            
        Returns:
            Lista de StoredFile
        """
        pass

