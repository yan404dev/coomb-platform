"""Health check routes."""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "coomb-ai", "version": "1.0.0"}


@router.get("/")
async def root():
    return {
        "service": "Coomb AI Platform",
        "description": "AI service for resume optimization and PDF generation",
        "version": "1.0.0",
        "docs": "/docs",
    }
