from .pdf_routes import router as pdf_router
from .document_routes import router as document_router
from .optimization_routes import router as optimization_router
from .health_routes import router as health_router
from .chat_routes import router as chat_router
from .knowledge_routes import router as knowledge_router

__all__ = [
    "pdf_router",
    "document_router",
    "optimization_router",
    "health_router",
    "chat_router",
    "knowledge_router",
]

