"""Rotas de extração de documentos."""

from __future__ import annotations

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from infrastructure.adapters.outbound.parsers import DOCXParserAdapter, PDFParserAdapter

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/documents", tags=["Document Extraction"])

pdf_parser = PDFParserAdapter()
docx_parser = DOCXParserAdapter()


class ExtractTextResponse(BaseModel):
    text: str
    length: int
    filename: str
    source_type: str


@router.post("/extract-text", response_model=ExtractTextResponse)
async def extract_text(file: UploadFile = File(...)):
    """Extrai texto de PDF ou DOCX."""
    try:
        filename = file.filename or "unknown"
        file_content = await file.read()

        if filename.lower().endswith(".pdf"):
            result = await pdf_parser.extract_text(file_content)
        elif filename.lower().endswith((".docx", ".doc")):
            result = await docx_parser.extract_text(file_content)
        else:
            raise HTTPException(status_code=400, detail="Use PDF ou DOCX.")

        if result.char_count < 50:
            raise HTTPException(status_code=400, detail="Texto extraído muito curto.")

        return ExtractTextResponse(
            text=result.content,
            length=result.char_count,
            filename=filename,
            source_type=result.source_type,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Text extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")


@router.get("/supported-formats")
async def get_supported_formats():
    """Formatos suportados."""
    return {
        "formats": [
            {"extension": ".pdf", "description": "PDF documents"},
            {"extension": ".docx", "description": "Word documents"},
        ]
    }
