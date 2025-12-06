"""Vector Store Port - Interface for vector databases (RAG)."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class VectorDocument:
    """
    Documento para armazenar no vector store.
    
    Attributes:
        id: ID único do documento
        content: Conteúdo textual
        metadata: Metadados adicionais
        embedding: Vetor de embedding (opcional, pode ser gerado)
    """
    
    id: str
    content: str
    metadata: dict = field(default_factory=dict)
    embedding: Optional[list[float]] = None


@dataclass
class VectorSearchResult:
    """
    Resultado de busca no vector store.
    
    Attributes:
        document: Documento encontrado
        score: Score de similaridade (0-1)
        distance: Distância vetorial
    """
    
    document: VectorDocument
    score: float
    distance: float = 0.0


class VectorStorePort(ABC):
    """
    Interface para vector stores (bancos de dados vetoriais).
    
    Usada para implementar RAG (Retrieval Augmented Generation)
    com conhecimento de mercado, vagas, skills, etc.
    
    Implementações:
        - QdrantAdapter
        - ChromaDBAdapter
        - PineconeAdapter
    
    Exemplo:
        ```python
        class QdrantAdapter(VectorStorePort):
            async def search(self, query, collection, limit):
                results = await self.client.search(
                    collection_name=collection,
                    query_vector=self._embed(query),
                    limit=limit,
                )
                return [self._to_result(r) for r in results]
        ```
    """
    
    @abstractmethod
    async def add_documents(
        self,
        documents: list[VectorDocument],
        collection_name: str,
    ) -> list[str]:
        """
        Adiciona documentos ao vector store.
        
        Args:
            documents: Lista de documentos para adicionar
            collection_name: Nome da collection/índice
            
        Returns:
            Lista de IDs dos documentos adicionados
            
        Raises:
            VectorStoreError: Se houver erro na operação
        """
        pass
    
    @abstractmethod
    async def search(
        self,
        query: str,
        collection_name: str,
        limit: int = 10,
        filter_metadata: Optional[dict] = None,
    ) -> list[VectorSearchResult]:
        """
        Busca documentos similares à query.
        
        Args:
            query: Texto da busca
            collection_name: Nome da collection
            limit: Número máximo de resultados
            filter_metadata: Filtros de metadados
            
        Returns:
            Lista de resultados ordenados por similaridade
            
        Raises:
            VectorStoreError: Se houver erro na busca
        """
        pass
    
    @abstractmethod
    async def delete_documents(
        self,
        document_ids: list[str],
        collection_name: str,
    ) -> int:
        """
        Remove documentos do vector store.
        
        Args:
            document_ids: IDs dos documentos a remover
            collection_name: Nome da collection
            
        Returns:
            Número de documentos removidos
        """
        pass
    
    @abstractmethod
    async def create_collection(
        self,
        collection_name: str,
        dimension: int = 1536,
    ) -> bool:
        """
        Cria uma nova collection.
        
        Args:
            collection_name: Nome da collection
            dimension: Dimensão dos vetores
            
        Returns:
            True se criada com sucesso
        """
        pass
    
    @abstractmethod
    async def collection_exists(self, collection_name: str) -> bool:
        """
        Verifica se uma collection existe.
        
        Args:
            collection_name: Nome da collection
            
        Returns:
            True se existe
        """
        pass
    
    @abstractmethod
    async def is_healthy(self) -> bool:
        """
        Verifica se o vector store está disponível.
        
        Returns:
            True se está operacional
        """
        pass

