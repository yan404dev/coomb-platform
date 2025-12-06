"""Coomb AI Platform - Entry Point."""

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from infrastructure.config import get_settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info(f"🚀 Coomb AI starting in {settings.app_env} mode...")

    Path("storage").mkdir(exist_ok=True)

    yield

    logger.info("👋 Coomb AI shutting down...")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Coomb AI Platform",
        description="AI service for resume optimization and PDF generation",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from infrastructure.adapters.inbound.http.routes import (
        chat_router,
        document_router,
        health_router,
        optimization_router,
        pdf_router,
    )

    app.include_router(health_router)
    app.include_router(chat_router)
    app.include_router(pdf_router)
    app.include_router(document_router)
    app.include_router(optimization_router)

    storage_path = Path("storage")
    if storage_path.exists():
        app.mount("/storage", StaticFiles(directory="storage"), name="storage")

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    settings = get_settings()
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=settings.debug)
