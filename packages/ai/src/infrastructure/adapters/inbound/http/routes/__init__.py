"""
HTTP routes for the Coomb AI API.

All routes are organized by domain:
- pdf_routes: PDF generation endpoints
- document_routes: Document extraction endpoints
- optimization_routes: Resume optimization endpoints
- health_routes: Health check endpoints
"""

from .pdf_routes import router as pdf_router
from .document_routes import router as document_router
from .optimization_routes import router as optimization_router
from .health_routes import router as health_router
from .chat_routes import router as chat_router

__all__ = ["pdf_router", "document_router", "optimization_router", "health_router", "chat_router"]

